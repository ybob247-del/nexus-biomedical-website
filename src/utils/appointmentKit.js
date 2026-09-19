/**
 * Appointment Prep Kit: turns what the visitor reported into the kit they paid
 * for. Pure functions, run entirely in the browser; nothing here is sent or
 * stored anywhere.
 *
 * The kit is educational. It organises what the person said and suggests
 * questions to ask. It never interprets results, names a condition, or
 * recommends a treatment, supplement or test. Keep it that way: the privacy
 * policy, terms and medical disclaimer all promise it.
 */

import i18n from '../i18n';

// Form option codes -> the locale keys that already label them.
const DURATION_KEYS = {
  less_than_month: 'lessThanMonth',
  '1_3_months': 'oneToThree',
  '3_6_months': 'threeToSix',
  '6_12_months': 'sixToTwelve',
  '1_2_years': 'oneToTwo',
  over_2_years: 'overTwo',
};

// How much weight a symptom's duration adds when ranking what to raise first.
const DURATION_WEIGHT = {
  less_than_month: 0.5,
  '1_3_months': 1,
  '3_6_months': 1.5,
  '6_12_months': 2,
  '1_2_years': 2.5,
  over_2_years: 3,
};

const SYSTEMS = ['thyroid', 'reproductive', 'adrenal', 'metabolic'];

const COPY = {
  en: {
    title: 'My Appointment Summary',
    subtitle: 'Appointment Prep Kit',
    prepared: 'Prepared',
    aboutMe: 'About me',
    age: 'Age',
    sex: 'Biological sex',
    cycle: 'Cycle status',
    sleep: 'Sleep',
    stress: 'Stress',
    exercise: 'Exercise',
    diet: 'Diet',
    outOf10: '/10',
    noticing: "What I've been noticing",
    forDuration: (d) => `for ${d.toLowerCase()}`,
    noSymptoms: 'I did not tick any listed symptoms.',
    raiseFirst: 'The five things to raise first',
    raiseFirstIntro: 'Ranked by how much you reported and for how long. Start with number 1 if time is short.',
    questions: 'Questions to ask',
    questionsIntro: 'Tick the ones you want to ask. Your clinician decides what is right for you.',
    exposures: 'Everyday exposures I mentioned',
    noExposures: 'None of the everyday exposures in the questionnaire stood out.',
    meds: 'Conditions, medications and supplements I listed',
    conditions: 'Conditions',
    medications: 'Medications',
    supplements: 'Supplements',
    none: 'None listed',
    notes: 'Notes from my appointment',
    notesPrompts: ['What my clinician said', 'Next steps and follow-up date'],
    disclaimer:
      'Educational only. This summary organises what I reported so I can discuss it with my clinician. It is not a diagnosis and does not recommend any treatment.',
    footer: 'Not Imagining It  |  notimaginingit.com  |  Educational only, not medical advice.',
    items: {
      pregnant: ['I am pregnant', 'Please consider this first when we talk about anything else.'],
      breastfeeding: ['I am breastfeeding', 'Please consider this first when we talk about anything else.'],
      cluster: (system, list, dur) => ['Several related symptoms together', `${list}${dur}`],
      single: (symptom, dur) => [symptom, dur ? dur.replace(/^, /, '').replace(/^./, (c) => c.toUpperCase()) : 'Reported in the questionnaire'],
      sleep: (label) => ['Sleep', `I rated my sleep as ${label.toLowerCase()}.`],
      stress: (n) => ['Stress', `I rated my stress at ${n} out of 10.`],
      cycle: (label, extra) => ['Changes in my cycle', `Current status: ${label.toLowerCase()}.${extra ? ` Also: ${extra}.` : ''}`],
      meds: ['My medications and supplements', 'So they can be reviewed alongside my symptoms.'],
    },
    q: {
      thyroid: (list) => `Could my ${list} be connected? Is my thyroid worth checking?`,
      perimenopause: 'Could these changes be related to perimenopause or other hormonal changes? What options are there to manage them?',
      reproductive: 'Could the changes in my cycle or libido be hormone-related? What would help us understand them?',
      adrenal: 'How might stress be affecting my energy, sleep and mood, and what could help?',
      metabolic: 'Could my weight, cravings or energy changes be related to blood sugar or metabolism? Is anything worth checking?',
      sleep: 'What might be behind my poor sleep, and what could we try first?',
      exposures: 'Are any of the everyday exposures I noted worth changing?',
      meds: 'Could any of my medications or supplements be contributing to how I feel?',
      track: 'What should I keep tracking before our next visit?',
      followUp: 'When should we follow up, and what would mean I should come back sooner?',
    },
    exposure: {
      plastic: 'Frequent use of plastic food containers, bottles or wrap',
      processed: 'Processed or packaged food most days',
      water: (label) => `Drinking water: ${label.toLowerCase()}`,
      work: 'Possible chemical exposure at work',
    },
    and: 'and',
  },
  es: {
    title: 'Resumen para mi consulta',
    subtitle: 'Kit de preparación para tu consulta',
    prepared: 'Preparado',
    aboutMe: 'Sobre mí',
    age: 'Edad',
    sex: 'Sexo biológico',
    cycle: 'Estado del ciclo',
    sleep: 'Sueño',
    stress: 'Estrés',
    exercise: 'Ejercicio',
    diet: 'Alimentación',
    outOf10: '/10',
    noticing: 'Lo que he estado notando',
    forDuration: (d) => `desde hace ${d.toLowerCase()}`,
    noSymptoms: 'No marqué ninguno de los síntomas de la lista.',
    raiseFirst: 'Las cinco cosas que mencionar primero',
    raiseFirstIntro: 'Ordenadas según cuánto reportaste y desde cuándo. Si hay poco tiempo, empieza por la número 1.',
    questions: 'Preguntas para hacer',
    questionsIntro: 'Marca las que quieras hacer. Tu profesional de salud decide qué es lo adecuado para ti.',
    exposures: 'Exposiciones cotidianas que mencioné',
    noExposures: 'No resaltó ninguna de las exposiciones cotidianas del cuestionario.',
    meds: 'Condiciones, medicamentos y suplementos que indiqué',
    conditions: 'Condiciones',
    medications: 'Medicamentos',
    supplements: 'Suplementos',
    none: 'Nada indicado',
    notes: 'Notas de mi consulta',
    notesPrompts: ['Lo que dijo mi profesional de salud', 'Próximos pasos y fecha de seguimiento'],
    disclaimer:
      'Solo con fines educativos. Este resumen organiza lo que reporté para conversarlo con mi profesional de salud. No es un diagnóstico y no recomienda ningún tratamiento.',
    footer: 'Not Imagining It  |  notimaginingit.com  |  Solo educativo, no es consejo médico.',
    items: {
      pregnant: ['Estoy embarazada', 'Por favor, tenlo en cuenta antes que cualquier otra cosa.'],
      breastfeeding: ['Estoy amamantando', 'Por favor, tenlo en cuenta antes que cualquier otra cosa.'],
      cluster: (system, list, dur) => ['Varios síntomas relacionados a la vez', `${list}${dur}`],
      single: (symptom, dur) => [symptom, dur ? dur.replace(/^, /, '').replace(/^./, (c) => c.toUpperCase()) : 'Indicado en el cuestionario'],
      sleep: (label) => ['Sueño', `Califiqué mi sueño como ${label.toLowerCase()}.`],
      stress: (n) => ['Estrés', `Califiqué mi estrés con ${n} de 10.`],
      cycle: (label, extra) => ['Cambios en mi ciclo', `Estado actual: ${label.toLowerCase()}.${extra ? ` También: ${extra}.` : ''}`],
      meds: ['Mis medicamentos y suplementos', 'Para revisarlos junto con mis síntomas.'],
    },
    q: {
      thyroid: (list) => `¿Podrían estar relacionados mis síntomas (${list})? ¿Vale la pena revisar mi tiroides?`,
      perimenopause: '¿Podrían estos cambios estar relacionados con la perimenopausia u otros cambios hormonales? ¿Qué opciones hay para manejarlos?',
      reproductive: '¿Podrían los cambios en mi ciclo o en mi deseo sexual estar relacionados con las hormonas? ¿Qué nos ayudaría a entenderlos?',
      adrenal: '¿Cómo podría el estrés estar afectando mi energía, mi sueño y mi ánimo, y qué podría ayudar?',
      metabolic: '¿Podrían mis cambios de peso, antojos o energía estar relacionados con el azúcar en sangre o el metabolismo? ¿Vale la pena revisar algo?',
      sleep: '¿Qué podría estar detrás de mi mal sueño y qué podríamos probar primero?',
      exposures: '¿Vale la pena cambiar alguna de las exposiciones cotidianas que anoté?',
      meds: '¿Podría alguno de mis medicamentos o suplementos estar influyendo en cómo me siento?',
      track: '¿Qué debería seguir registrando antes de nuestra próxima consulta?',
      followUp: '¿Cuándo deberíamos hacer seguimiento y qué señales me indicarían volver antes?',
    },
    exposure: {
      plastic: 'Uso frecuente de envases, botellas o plástico para alimentos',
      processed: 'Alimentos procesados o empaquetados la mayoría de los días',
      water: (label) => `Agua para beber: ${label.toLowerCase()}`,
      work: 'Posible exposición a químicos en el trabajo',
    },
    and: 'y',
  },
};

// Lower-case only the first letter, so acronyms such as PMS/SPM survive.
const lowerFirst = (text) =>
  !text || /^[A-ZÁÉÍÓÚÑ]{2}/.test(text) ? text : text.charAt(0).toLowerCase() + text.slice(1);

// Drop a trailing explanation in brackets, e.g. 'Poor (less than 5 hours...)'.
const short = (text) => String(text || '').replace(/\s*\([^)]*\)\s*$/, '');

const sentenceList = (items) => items.map((s, i) => (i === 0 ? s : lowerFirst(s)));

const joinList = (items, and) =>
  items.length <= 1 ? items.join('') : `${items.slice(0, -1).join(', ')} ${and} ${items[items.length - 1]}`;

/**
 * Build the kit.
 * @param {object} results  Assessment results, including `reported` (the
 *                          visitor's own answers, attached in the browser).
 * @param {string} language 'en' or 'es'
 */
export function buildAppointmentKit(results, language = i18n.language) {
  const lang = String(language || '').startsWith('es') ? 'es' : 'en';
  const c = COPY[lang];
  const t = i18n.getFixedT(lang);
  const r = results?.reported || {};

  const label = (key) => (key ? short(t(key)) : '');
  const durationLabel = r.symptomDuration && DURATION_KEYS[r.symptomDuration]
    ? t(`endoguard.steps.symptoms.durationOptions.${DURATION_KEYS[r.symptomDuration]}`)
    : '';
  const durationPhrase = durationLabel ? `, ${c.forDuration(durationLabel)}` : '';

  // Symptoms grouped by body system, labelled in the kit's language.
  const bySystem = {};
  for (const key of r.symptomKeys || []) {
    const system = SYSTEMS.find((s) => key.startsWith(`endoguard.steps.symptoms.${s}.`));
    if (!system) continue;
    (bySystem[system] ||= []).push(label(key));
  }
  const symptomGroups = SYSTEMS.filter((s) => bySystem[s]?.length).map((s) => ({
    system: s,
    title: t(`endoguard.steps.symptoms.systems.${s}`),
    items: bySystem[s],
  }));

  // About me.
  const about = [];
  if (r.age) about.push([c.age, String(r.age)]);
  if (r.biologicalSex) about.push([c.sex, label(`endoguard.steps.demographics.${r.biologicalSex}`)]);
  if (r.menstrualStatus) about.push([c.cycle, label(`endoguard.steps.demographics.menstrualOptions.${r.menstrualStatus}`)]);
  if (r.sleepQuality) about.push([c.sleep, label(`endoguard.steps.lifestyle.sleepOptions.${r.sleepQuality}`)]);
  if (r.stressLevel !== undefined && r.stressLevel !== '') about.push([c.stress, `${r.stressLevel}${c.outOf10}`]);
  if (r.exerciseFrequency) about.push([c.exercise, label(`endoguard.steps.lifestyle.exerciseOptions.${r.exerciseFrequency}`)]);
  if (r.dietQuality) about.push([c.diet, label(`endoguard.steps.lifestyle.dietOptions.${r.dietQuality}`)]);

  // Five things to raise first, ranked.
  const candidates = [];
  const durWeight = DURATION_WEIGHT[r.symptomDuration] || 1;
  if (r.menstrualStatus === 'pregnant') candidates.push({ w: 100, text: c.items.pregnant });
  if (r.menstrualStatus === 'breastfeeding') candidates.push({ w: 100, text: c.items.breastfeeding });
  const cycleChanging = ['irregular', 'perimenopause'].includes(r.menstrualStatus);
  for (const g of symptomGroups) {
    // Reproductive symptoms travel with the cycle item when there is one.
    if (g.system === 'reproductive' && cycleChanging) continue;
    if (g.items.length >= 2) {
      candidates.push({ w: g.items.length * 2 + durWeight, text: c.items.cluster(g.title, joinList(sentenceList(g.items), c.and), durationPhrase) });
    } else {
      candidates.push({ w: 1 + durWeight * 0.5, text: c.items.single(g.items[0], durationPhrase) });
    }
  }
  if (r.sleepQuality === 'poor' || r.sleepQuality === 'fair') {
    candidates.push({ w: r.sleepQuality === 'poor' ? 3 : 1.5, text: c.items.sleep(label(`endoguard.steps.lifestyle.sleepOptions.${r.sleepQuality}`)) });
  }
  const stress = Number(r.stressLevel);
  if (stress >= 7) candidates.push({ w: stress - 4, text: c.items.stress(stress) });
  if (cycleChanging) {
    const extra = bySystem.reproductive?.length ? joinList(bySystem.reproductive.map(lowerFirst), c.and) : '';
    candidates.push({ w: 3.5 + (extra ? 1 : 0), text: c.items.cycle(label(`endoguard.steps.demographics.menstrualOptions.${r.menstrualStatus}`), extra) });
  }
  if ((r.medications || '').trim() || (r.supplements || '').trim()) candidates.push({ w: 2, text: c.items.meds });
  const raiseFirst = candidates
    .sort((a, b) => b.w - a.w)
    .slice(0, 5)
    .map(({ text: [title, detail] }) => ({ title, detail }));

  // Questions, chosen by what was reported.
  const questions = [];
  if (bySystem.thyroid?.length) questions.push(c.q.thyroid(joinList(bySystem.thyroid.map(lowerFirst), c.and)));
  const age = Number(r.age);
  const perimenopauseLikely =
    r.biologicalSex === 'female' &&
    (['irregular', 'perimenopause', 'menopause'].includes(r.menstrualStatus) ||
      (age >= 38 && (r.symptomKeys || []).some((k) => /hotFlashes|irregularCycles/.test(k))));
  if (perimenopauseLikely) questions.push(c.q.perimenopause);
  else if (bySystem.reproductive?.length) questions.push(c.q.reproductive);
  if (bySystem.adrenal?.length || stress >= 7) questions.push(c.q.adrenal);
  if (bySystem.metabolic?.length) questions.push(c.q.metabolic);
  if (r.sleepQuality === 'poor') questions.push(c.q.sleep);

  const exposures = [];
  if (['high', 'moderate'].includes(r.plasticUseFrequency)) exposures.push(c.exposure.plastic);
  if (['daily', 'several_times_week'].includes(r.processedFoodFrequency)) exposures.push(c.exposure.processed);
  const waterKeys = { tap_unfiltered: 'tapUnfiltered', bottled: 'bottled', well: 'well' };
  if (waterKeys[r.waterSource]) exposures.push(c.exposure.water(t(`endoguard.steps.exposure.waterOptions.${waterKeys[r.waterSource]}`)));
  if (r.occupationalExposure) exposures.push(c.exposure.work);
  if (exposures.length) questions.push(c.q.exposures);

  const conditions = (r.existingConditions || '').trim();
  const medications = (r.medications || '').trim();
  const supplements = (r.supplements || '').trim();
  // Medications matter most when they are listed, so that question goes near
  // the top (after the first two symptom questions) before the cap applies.
  if (medications || supplements) questions.splice(Math.min(2, questions.length), 0, c.q.meds);
  const tailored = questions.slice(0, 6);

  return {
    lang,
    copy: c,
    preparedOn: new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    about,
    symptomGroups,
    durationLabel,
    raiseFirst,
    questions: [...tailored, c.q.track, c.q.followUp],
    exposures,
    listed: { conditions, medications, supplements },
    hasReported: Boolean(results?.reported),
  };
}
