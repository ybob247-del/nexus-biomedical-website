/**
 * Appointment Prep Kit: turns what the visitor reported into the kit they paid
 * for. Pure functions, run entirely in the browser; nothing here is sent or
 * stored anywhere.
 *
 * The kit is educational. It organises what the person said, explains in plain
 * language why each pattern is worth raising (with one reputable source), and
 * suggests questions to ask, including questions about tests people commonly
 * ask about. It never interprets results, names a condition as theirs, or
 * recommends a treatment, supplement or test. Keep it that way: the privacy
 * policy, terms and medical disclaimer all promise it. Topic content lives in
 * appointmentKitTopics.js.
 */

import i18n from '../i18n';
import { TOPICS, EXTRA_TOPICS, GLOSSARY } from './appointmentKitTopics';

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

// Extra weight for topics people usually most want answered, or that should
// not wait, so one of them is not buried under a longer list of milder items.
const TOPIC_BONUS = { fertility: 5, heavy: 3, perimenopause: 2, male: 2, irregular: 1.5 };

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
    raiseFirstIntro: 'Ranked by how much you reported, for how long, and what usually should not wait. Start with number 1 if time is short.',
    opener: 'My 30-second opener',
    openerIntro: 'Read this out at the start of the visit. Fill in the blank first.',
    opening: (dur, list) =>
      `Thank you for seeing me. ${dur ? `For ${dur.toLowerCase()} now` : 'Lately'}, the main things I have been dealing with are ${list}. It is affecting my ____________________. I have put everything on one page. Could we go through it, starting with number 1?`,
    questions: 'Questions to ask',
    questionsIntro: 'Tick the ones you want to ask. Your clinician decides what is right for you.',
    tests: 'Tests people commonly ask about',
    testsIntro: 'Phrased as questions, because only your clinician can say whether any test is right for you. Ask why, or why not.',
    understanding: 'Why these are worth raising',
    understandingIntro: 'Plain-language background for you, with one trusted source for each. Not a diagnosis.',
    source: 'Source',
    exposures: 'Everyday exposures I mentioned',
    noExposures: 'None of the everyday exposures in the questionnaire stood out.',
    meds: 'Conditions, medications and supplements I listed',
    conditions: 'Conditions',
    medications: 'Medications',
    supplements: 'Supplements',
    none: 'None listed',
    bring: 'What to bring',
    bringItems: [
      'This summary (printed or on your phone)',
      'Every medication and supplement you take, with the dose (or the bottles)',
      'The first day of your last two or three periods, if you have periods',
      'Any recent test results, especially from other clinics',
      'Family history: thyroid, diabetes, early menopause, PCOS, heart disease',
      'Someone you trust, if you would like support or a second pair of ears',
    ],
    rushed: 'If you feel rushed or not heard',
    rushedItems: [
      'Of everything on my list, number 1 matters most to me today.',
      'What else could be causing this?',
      'If we do not check for it today, what would make you want to check it later?',
      'Could you note in my chart that I raised this, and what we decided?',
      'Who should I see next if this does not improve?',
      'Can we book a follow-up for the rest of my list?',
    ],
    urgent: 'Get care promptly (do not wait for the appointment) if',
    urgentItems: [
      'Bleeding soaks a pad or tampon every hour for more than two hours, or you feel faint',
      'Any bleeding after menopause (12 months or more with no period)',
      'A new breast lump, or skin or nipple changes',
      'Chest pain, fainting, sudden severe headache, or severe pain in the belly or pelvis',
      'Thoughts of harming yourself: in the US call or text 988; elsewhere, your local emergency number',
    ],
    logOnPdf: 'Your PDF also includes a two-week log to fill in before the visit and space for notes from the appointment.',
    log: 'My two-week log',
    logIntro: 'Fill in one row a day before the visit. Rate each 0 to 3: 0 = none or fine, 1 = mild, 2 = moderate, 3 = severe or very poor. Bring it with you.',
    logCols: { day: 'Day', date: 'Date', sleep: 'Sleep', energy: 'Energy', mood: 'Mood', period: 'Period?', notes: 'Notes' },
    notes: 'Notes from my appointment',
    notesPrompts: ['What my clinician said', 'Tests or referrals, and when and how I get results', 'Next steps, follow-up date, and what to do if nothing improves'],
    glossary: 'Words you may hear',
    disclaimer:
      'Educational only. This summary organizes what I reported so I can discuss it with my clinician. It is not a diagnosis and does not recommend any treatment or test. Sources are listed so I can read more.',
    footer: 'Not Imagining It  |  notimaginingit.com  |  Educational only, not medical advice.',
    items: {
      pregnant: ['I am pregnant', 'Please consider this first when we talk about anything else.'],
      breastfeeding: ['I am breastfeeding', 'Please consider this first when we talk about anything else.'],
      reported: (list, dur) => `${list}${dur}`,
      status: (label) => `Current status: ${label.toLowerCase()}.`,
      sleep: (label) => `I rated my sleep as ${label.toLowerCase()}.`,
      stress: (n) => `I rated my stress at ${n} out of 10.`,
      meds: ['My medications and supplements', 'So they can be reviewed alongside my symptoms.'],
    },
    q: {
      thyroid: (list) => `Could my ${list} be connected?`,
      perimenopause: 'Could these changes be related to perimenopause or other hormonal changes? What options are there to manage them?',
      reproductive: 'Could the changes in my cycle or libido be hormone-related? What would help us understand them?',
      adrenal: 'How might stress be affecting my energy, sleep and mood, and what could help?',
      metabolic: 'Could my weight, cravings or energy changes be related to blood sugar or metabolism?',
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
    raiseFirstIntro: 'Ordenadas según cuánto reportaste, desde cuándo y lo que normalmente no debe esperar. Si hay poco tiempo, empieza por la número 1.',
    opener: 'Mi presentación de 30 segundos',
    openerIntro: 'Léela al empezar la consulta. Completa primero el espacio en blanco.',
    opening: (dur, list) =>
      `Gracias por atenderme. ${dur ? `Desde hace ${dur.toLowerCase()}` : 'Últimamente'}, lo que más me ha afectado es: ${list}. Esto está afectando mi ____________________. Lo he puesto todo en una página. ¿Podemos revisarlo empezando por el número 1?`,
    questions: 'Preguntas para hacer',
    questionsIntro: 'Marca las que quieras hacer. Tu profesional de salud decide qué es lo adecuado para ti.',
    tests: 'Análisis por los que la gente suele preguntar',
    testsIntro: 'Escritos como preguntas, porque solo tu profesional de salud puede decir si algún análisis es adecuado para ti. Pregunta por qué sí o por qué no.',
    understanding: 'Por qué vale la pena mencionarlos',
    understandingIntro: 'Información sencilla para ti, con una fuente confiable para cada punto. No es un diagnóstico.',
    source: 'Fuente',
    exposures: 'Exposiciones cotidianas que mencioné',
    noExposures: 'No resaltó ninguna de las exposiciones cotidianas del cuestionario.',
    meds: 'Condiciones, medicamentos y suplementos que indiqué',
    conditions: 'Condiciones',
    medications: 'Medicamentos',
    supplements: 'Suplementos',
    none: 'Nada indicado',
    bring: 'Qué llevar',
    bringItems: [
      'Este resumen (impreso o en tu teléfono)',
      'Todos los medicamentos y suplementos que tomas, con la dosis (o los frascos)',
      'El primer día de tus dos o tres últimos períodos, si tienes períodos',
      'Resultados de análisis recientes, sobre todo de otras clínicas',
      'Antecedentes familiares: tiroides, diabetes, menopausia temprana, SOP, enfermedades del corazón',
      'Una persona de confianza, si quieres apoyo o alguien que también escuche',
    ],
    rushed: 'Si sientes prisa o que no te escuchan',
    rushedItems: [
      'De todo lo que traigo, el número 1 es lo que más me importa hoy.',
      '¿Qué más podría estar causando esto?',
      'Si hoy no lo revisamos, ¿qué haría que quisiera revisarlo más adelante?',
      '¿Podría anotar en mi historial que mencioné esto y lo que decidimos?',
      '¿A quién debería ver después si esto no mejora?',
      '¿Podemos agendar un seguimiento para el resto de mi lista?',
    ],
    urgent: 'Busca atención pronto (sin esperar a la consulta) si',
    urgentItems: [
      'El sangrado empapa una toalla o un tampón cada hora durante más de dos horas, o te sientes a punto de desmayarte',
      'Cualquier sangrado después de la menopausia (12 meses o más sin período)',
      'Un bulto nuevo en el seno, o cambios en la piel o el pezón',
      'Dolor en el pecho, desmayo, dolor de cabeza repentino e intenso, o dolor fuerte en el abdomen o la pelvis',
      'Pensamientos de hacerte daño: en EE. UU. llama o escribe al 988 (opción en español); en otros países, al número de emergencias local',
    ],
    logOnPdf: 'Tu PDF también incluye un registro de dos semanas para llenar antes de la consulta y espacio para notas de la consulta.',
    log: 'Mi registro de dos semanas',
    logIntro: 'Llena una fila al día antes de la consulta. Califica cada columna de 0 a 3: 0 = nada o bien, 1 = leve, 2 = moderado, 3 = fuerte o muy mal. Llévalo contigo.',
    logCols: { day: 'Día', date: 'Fecha', sleep: 'Sueño', energy: 'Energía', mood: 'Ánimo', period: '¿Período?', notes: 'Notas' },
    notes: 'Notas de mi consulta',
    notesPrompts: ['Lo que dijo mi profesional de salud', 'Análisis o derivaciones, y cuándo y cómo recibiré los resultados', 'Próximos pasos, fecha de seguimiento y qué hacer si nada mejora'],
    glossary: 'Palabras que podrías escuchar',
    disclaimer:
      'Solo con fines educativos. Este resumen organiza lo que reporté para conversarlo con mi profesional de salud. No es un diagnóstico y no recomienda ningún tratamiento ni análisis. Las fuentes aparecen para que pueda leer más.',
    footer: 'Not Imagining It  |  notimaginingit.com  |  Solo educativo, no es consejo médico.',
    items: {
      pregnant: ['Estoy embarazada', 'Por favor, tenlo en cuenta antes que cualquier otra cosa.'],
      breastfeeding: ['Estoy amamantando', 'Por favor, tenlo en cuenta antes que cualquier otra cosa.'],
      reported: (list, dur) => `${list}${dur}`,
      status: (label) => `Estado actual: ${label.toLowerCase()}.`,
      sleep: (label) => `Califiqué mi sueño como ${label.toLowerCase()}.`,
      stress: (n) => `Califiqué mi estrés con ${n} de 10.`,
      meds: ['Mis medicamentos y suplementos', 'Para revisarlos junto con mis síntomas.'],
    },
    q: {
      thyroid: (list) => `¿Podrían estar relacionados mis síntomas (${list})?`,
      perimenopause: '¿Podrían estos cambios estar relacionados con la perimenopausia u otros cambios hormonales? ¿Qué opciones hay para manejarlos?',
      reproductive: '¿Podrían los cambios en mi ciclo o en mi deseo sexual estar relacionados con las hormonas? ¿Qué nos ayudaría a entenderlos?',
      adrenal: '¿Cómo podría el estrés estar afectando mi energía, mi sueño y mi ánimo, y qué podría ayudar?',
      metabolic: '¿Podrían mis cambios de peso, antojos o energía estar relacionados con el azúcar en sangre o el metabolismo?',
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

// Last segment of an i18n symptom key: 'endoguard.steps.symptoms.thyroid.fatigue' -> 'fatigue'.
const shortKey = (key) => String(key).split('.').pop();

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
  const labelByShort = {};
  for (const key of r.symptomKeys || []) {
    const system = SYSTEMS.find((s) => key.startsWith(`endoguard.steps.symptoms.${s}.`));
    if (!system) continue;
    (bySystem[system] ||= []).push(label(key));
    labelByShort[shortKey(key)] = label(key);
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

  // Match topics. Order in TOPICS matters: a later topic can check whether an
  // earlier one matched (irregular cycles defer to perimenopause, and so on).
  const durWeight = DURATION_WEIGHT[r.symptomDuration] || 1;
  const matched = new Map();
  const ctx = {
    age: Number(r.age) || 0,
    female: r.biologicalSex === 'female',
    male: r.biologicalSex === 'male',
    menstrualStatus: r.menstrualStatus,
    has: (k) => Boolean(labelByShort[k]),
    topicMatched: (id) => matched.has(id),
  };
  for (const topic of TOPICS) {
    const hits = topic.keys.filter(ctx.has);
    const ok = topic.when ? topic.when(ctx) : hits.length >= topic.min;
    if (!ok || (hits.length === 0 && !topic.when)) continue;
    matched.set(topic.id, { topic, hits });
  }

  // Five things to raise first, ranked. Each carries its background and source.
  const candidates = [];
  if (r.menstrualStatus === 'pregnant') candidates.push({ w: 100, title: c.items.pregnant[0], detail: c.items.pregnant[1] });
  if (r.menstrualStatus === 'breastfeeding') candidates.push({ w: 100, title: c.items.breastfeeding[0], detail: c.items.breastfeeding[1] });
  for (const { topic, hits } of matched.values()) {
    const content = topic[lang];
    const list = hits.map((k) => labelByShort[k]);
    const statusLabel = r.menstrualStatus ? label(`endoguard.steps.demographics.menstrualOptions.${r.menstrualStatus}`) : '';
    const detail = list.length
      ? c.items.reported(joinList(sentenceList(list), c.and), durationPhrase)
      : c.items.status(statusLabel);
    candidates.push({
      w: hits.length * 2 + durWeight + (TOPIC_BONUS[topic.id] || 0),
      id: topic.id,
      brief: list.length ? lowerFirst(list[0]) : lowerFirst(content.title),
      title: content.title,
      detail,
      why: content.why,
      test: content.test,
      ask: content.ask,
      source: content.source,
    });
  }
  const stress = Number(r.stressLevel);
  if (r.sleepQuality === 'poor' || r.sleepQuality === 'fair') {
    const sleepLabel = label(`endoguard.steps.lifestyle.sleepOptions.${r.sleepQuality}`);
    candidates.push({
      w: r.sleepQuality === 'poor' ? 3 : 1.5,
      id: 'sleep',
      brief: lang === 'es' ? 'dormir mal' : 'poor sleep',
      title: EXTRA_TOPICS.sleep[lang].title,
      detail: c.items.sleep(sleepLabel),
      ...pick(EXTRA_TOPICS.sleep[lang]),
    });
  }
  if (stress >= 7 && !matched.has('mood')) {
    const mood = TOPICS.find((x) => x.id === 'mood')[lang];
    candidates.push({ w: stress - 4, id: 'mood', brief: mood.title.toLowerCase(), title: mood.title, detail: c.items.stress(stress), ...pick(mood) });
  }
  if ((r.medications || '').trim() || (r.supplements || '').trim()) {
    candidates.push({ w: 2, title: c.items.meds[0], detail: c.items.meds[1] });
  }
  const ranked = candidates.sort((a, b) => b.w - a.w);
  const raiseFirst = ranked.slice(0, 5).map(({ w, ...item }) => item);

  // Opener: the top three things in the person's own words.
  const briefs = raiseFirst.filter((x) => x.brief).slice(0, 3).map((x) => x.brief);
  const opener = briefs.length
    ? c.opening(r.symptomDuration === 'less_than_month' ? '' : durationLabel, joinList(briefs, c.and))
    : '';

  // Tests people commonly ask about: from every matched topic, top ranked first.
  const tests = ranked.filter((x) => x.test).map((x) => x.test).slice(0, 5);

  // Background for each ranked topic, plus exposures when any were noted.
  const understanding = ranked.filter((x) => x.why).slice(0, 5).map(({ title, why, source }) => ({ title, why, source }));

  // Questions, chosen by what was reported.
  const questions = [];
  if (bySystem.thyroid?.length >= 2) questions.push(c.q.thyroid(joinList(bySystem.thyroid.map(lowerFirst), c.and)));
  if (matched.has('perimenopause')) questions.push(c.q.perimenopause);
  else if (bySystem.reproductive?.length) questions.push(c.q.reproductive);
  if (bySystem.adrenal?.length || stress >= 7) questions.push(c.q.adrenal);
  if (bySystem.metabolic?.length) questions.push(c.q.metabolic);
  if (r.sleepQuality === 'poor') questions.push(c.q.sleep);
  for (const x of ranked) if (x.ask) questions.push(x.ask);

  const exposures = [];
  if (['high', 'moderate'].includes(r.plasticUseFrequency)) exposures.push(c.exposure.plastic);
  if (['daily', 'several_times_week'].includes(r.processedFoodFrequency)) exposures.push(c.exposure.processed);
  const waterKeys = { tap_unfiltered: 'tapUnfiltered', bottled: 'bottled', well: 'well' };
  if (waterKeys[r.waterSource]) exposures.push(c.exposure.water(t(`endoguard.steps.exposure.waterOptions.${waterKeys[r.waterSource]}`)));
  if (r.occupationalExposure) exposures.push(c.exposure.work);
  if (exposures.length) {
    questions.push(c.q.exposures);
    understanding.push({ title: EXTRA_TOPICS.exposures[lang].title, why: EXTRA_TOPICS.exposures[lang].why, source: EXTRA_TOPICS.exposures[lang].source });
  }

  const conditions = (r.existingConditions || '').trim();
  const medications = (r.medications || '').trim();
  const supplements = (r.supplements || '').trim();
  // Medications matter most when they are listed, so that question goes near
  // the top (after the first two symptom questions) before the cap applies.
  if (medications || supplements) questions.splice(Math.min(2, questions.length), 0, c.q.meds);
  const tailored = questions.slice(0, 6);

  // Two-week log: the person's top two symptoms get their own columns.
  const logSymptoms = raiseFirst
    .filter((x) => x.brief && !['sleep', 'fertility'].includes(x.id))
    .slice(0, 2)
    .map((x) => x.brief.charAt(0).toUpperCase() + x.brief.slice(1));

  // Glossary: only the terms that appear somewhere in this person's kit.
  const kitText = JSON.stringify([tests, understanding, raiseFirst]).toLowerCase();
  const glossary = GLOSSARY
    .map((g) => ({ term: lang === 'es' ? g.es_term || g.term : g.term, text: g[lang] }))
    .filter((g) => kitText.includes(g.term.toLowerCase()));

  return {
    lang,
    copy: c,
    preparedOn: new Date().toLocaleDateString(lang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    about,
    symptomGroups,
    durationLabel,
    raiseFirst,
    opener,
    questions: [...tailored, c.q.track, c.q.followUp],
    tests,
    understanding,
    glossary,
    exposures,
    listed: { conditions, medications, supplements },
    logSymptoms,
    showsPeriodColumn: r.biologicalSex === 'female' && !['menopause', 'postmenopause', 'pregnant'].includes(r.menstrualStatus),
    hasReported: Boolean(results?.reported),
  };
}

function pick({ why, test, source }) {
  return { why, test, source };
}
