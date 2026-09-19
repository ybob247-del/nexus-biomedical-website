/**
 * Educational content for the Appointment Prep Kit.
 *
 * Each topic matches a pattern in what the person reported and supplies, in
 * English and Spanish:
 *   - title: a plain name for the pattern
 *   - why:   two or three sentences on why it is worth raising
 *   - test:  a question about tests people commonly ask about, phrased as a
 *            question for the clinician, never as advice to get the test
 *   - ask:   (instead of test) a question for the question list
 *   - source: one reputable patient-facing page
 *
 * Rules for this file (the terms, privacy policy and medical disclaimer rely
 * on them): no diagnosis, no "you have", no treatment, dose or supplement
 * advice, no test recommendations. Describe what is common and why it is worth
 * mentioning, and leave every decision to the clinician. Sources are
 * organisations (medical societies, government health agencies), not single
 * studies. Every URL was checked to load (HTTP 200) on 2026-09-19; re-check
 * them when editing.
 */

// Short symptom key -> the topic it belongs to. Keys are the last segment of
// the i18n key (endoguard.steps.symptoms.<system>[.<sex>].<key>).
export const TOPICS = [
  {
    id: 'thyroid',
    keys: ['fatigue', 'weightChange', 'coldIntolerance', 'drySkin', 'brainFog', 'hairLoss'],
    min: 2,
    en: {
      title: 'Tiredness and other changes that often travel with the thyroid',
      why: 'Tiredness, weight change, dry skin, feeling cold, brain fog and thinning hair each have many possible causes. Together they are a pattern clinicians often think of checking the thyroid for, because an underactive thyroid is common in women and is checked with a simple blood test.',
      test: 'Would a thyroid blood test (TSH) make sense for me?',
      source: { name: 'American Thyroid Association: Hypothyroidism', url: 'https://www.thyroid.org/hypothyroidism/' },
    },
    es: {
      title: 'Cansancio y otros cambios que suelen relacionarse con la tiroides',
      why: 'El cansancio, los cambios de peso, la piel seca, sentir frío, la confusión mental y el cabello más delgado tienen muchas causas posibles. Juntos forman un patrón por el que los profesionales de salud a menudo consideran revisar la tiroides, porque la tiroides poco activa es frecuente en las mujeres y se revisa con un análisis de sangre sencillo.',
      test: '¿Tendría sentido un análisis de sangre de la tiroides (TSH) en mi caso?',
      source: { name: 'MedlinePlus: Hipotiroidismo', url: 'https://medlineplus.gov/spanish/hypothyroidism.html' },
    },
  },
  {
    id: 'perimenopause',
    keys: ['hotFlashes', 'irregularCycles', 'vaginalDryness'],
    when: (ctx) =>
      ctx.female &&
      (['perimenopause', 'menopause', 'postmenopause'].includes(ctx.menstrualStatus) ||
        (ctx.age >= 38 && (ctx.has('hotFlashes') || (ctx.has('irregularCycles') && ctx.menstrualStatus !== 'regular')))),
    min: 0,
    en: {
      title: 'Changes that may be linked to perimenopause or menopause',
      why: 'Perimenopause often starts in the 40s, sometimes the late 30s, and can last several years. Hot flashes, night sweats, sleep changes, irregular periods, mood changes and vaginal dryness are common, and there are effective ways to manage them. It is usually recognized from age and symptoms, so a clear record like this one helps.',
      test: 'Are any blood tests useful in my case, for example to rule out thyroid changes, or are my age and symptoms enough to go on?',
      source: { name: 'ACOG: The Menopause Years', url: 'https://www.acog.org/womens-health/faqs/the-menopause-years' },
    },
    es: {
      title: 'Cambios que podrían estar relacionados con la perimenopausia o la menopausia',
      why: 'La perimenopausia suele empezar en los 40, a veces al final de los 30, y puede durar varios años. Los sofocos, los sudores nocturnos, los cambios de sueño, los períodos irregulares, los cambios de ánimo y la sequedad vaginal son frecuentes, y hay formas eficaces de manejarlos. Normalmente se reconoce por la edad y los síntomas, así que un registro claro como este ayuda.',
      test: '¿Me serviría algún análisis de sangre, por ejemplo para descartar cambios de la tiroides, o basta con mi edad y mis síntomas?',
      source: { name: 'ACOG: Los años de la menopausia', url: 'https://www.acog.org/womens-health/faqs/los-anos-de-la-menopausia' },
    },
  },
  {
    id: 'irregular',
    keys: ['irregularCycles'],
    when: (ctx) => ctx.female && (ctx.has('irregularCycles') || ctx.menstrualStatus === 'irregular') && !ctx.topicMatched('perimenopause'),
    min: 0,
    en: {
      title: 'Irregular cycles',
      why: 'Cycles that are often shorter than 21 days, longer than 35 days, or hard to predict are worth mentioning. Common reasons include thyroid changes, stress, weight changes and polycystic ovary syndrome (PCOS), and most can be looked into with questions, an exam and basic tests.',
      test: 'Would a pregnancy test, thyroid test or hormone tests (such as prolactin or testosterone) help us understand my cycles?',
      source: { name: 'ACOG: Abnormal Uterine Bleeding', url: 'https://www.acog.org/womens-health/faqs/abnormal-uterine-bleeding' },
    },
    es: {
      title: 'Ciclos irregulares',
      why: 'Vale la pena mencionar los ciclos que a menudo duran menos de 21 días, más de 35 días o que son difíciles de predecir. Entre las causas frecuentes están los cambios de la tiroides, el estrés, los cambios de peso y el síndrome de ovario poliquístico (SOP), y la mayoría se pueden estudiar con preguntas, un examen y análisis básicos.',
      test: '¿Nos ayudaría una prueba de embarazo, un análisis de tiroides o análisis hormonales (como prolactina o testosterona) a entender mis ciclos?',
      source: { name: 'MedlinePlus: Sangrado uterino anormal', url: 'https://medlineplus.gov/spanish/ency/article/000903.htm' },
    },
  },
  {
    id: 'heavy',
    keys: ['heavyPeriods'],
    min: 1,
    en: {
      title: 'Heavy or painful periods',
      why: 'Periods that soak through a pad or tampon every hour or two, last longer than 7 days, or stop you doing normal things are worth raising. Heavy bleeding can lower iron, which on its own can cause tiredness, and painful periods have causes that can be looked into.',
      test: 'Given my periods, would a blood count or iron (ferritin) test make sense?',
      source: { name: 'ACOG: Heavy Menstrual Bleeding', url: 'https://www.acog.org/womens-health/faqs/heavy-menstrual-bleeding' },
    },
    es: {
      title: 'Períodos abundantes o dolorosos',
      why: 'Vale la pena mencionar los períodos que empapan una toalla o un tampón cada una o dos horas, que duran más de 7 días o que te impiden hacer tus actividades normales. El sangrado abundante puede bajar el hierro, lo que por sí solo puede causar cansancio, y los períodos dolorosos tienen causas que se pueden estudiar.',
      test: 'Por cómo son mis períodos, ¿tendría sentido un hemograma o un análisis de hierro (ferritina)?',
      source: { name: 'MedlinePlus: Sangrado uterino anormal', url: 'https://medlineplus.gov/spanish/ency/article/000903.htm' },
    },
  },
  {
    id: 'fertility',
    keys: ['fertility'],
    min: 1,
    en: {
      title: 'Concerns about fertility',
      why: 'The usual guidance is to see a clinician after 12 months of trying to conceive if you are under 35, after 6 months if you are 35 or older, and sooner if cycles are irregular or there is a known concern. An evaluation normally looks at both partners.',
      test: 'What would a basic fertility evaluation involve for me, and for my partner?',
      source: { name: 'ACOG: Evaluating Infertility', url: 'https://www.acog.org/womens-health/faqs/evaluating-infertility' },
    },
    es: {
      title: 'Preocupaciones sobre la fertilidad',
      why: 'La recomendación habitual es consultar después de 12 meses intentando un embarazo si tienes menos de 35 años, después de 6 meses si tienes 35 o más, y antes si los ciclos son irregulares o hay alguna preocupación conocida. La evaluación normalmente incluye a ambos miembros de la pareja.',
      test: '¿Qué incluiría una evaluación básica de fertilidad para mí y para mi pareja?',
      source: { name: 'MedlinePlus: Infertilidad', url: 'https://medlineplus.gov/spanish/infertility.html' },
    },
  },
  {
    id: 'pms',
    keys: ['pms', 'breastTenderness'],
    min: 1,
    en: {
      title: 'Symptoms before my period',
      why: 'Symptoms that build in the week or two before a period and ease once it starts are easier to recognize when they are tracked over two or more cycles. The two-week log in this kit is built for that. Breast tenderness that comes and goes with the cycle is common; a new lump or skin change is worth mentioning promptly.',
      test: 'Would tracking two cycles help us tell whether these symptoms follow my cycle?',
      source: { name: 'ACOG: Premenstrual Syndrome (PMS)', url: 'https://www.acog.org/womens-health/faqs/premenstrual-syndrome' },
    },
    es: {
      title: 'Síntomas antes de mi período',
      why: 'Los síntomas que aumentan una o dos semanas antes del período y mejoran cuando empieza se reconocen mejor si se registran durante dos ciclos o más. El registro de dos semanas de este kit está hecho para eso. La sensibilidad en los senos que va y viene con el ciclo es frecuente; un bulto nuevo o un cambio en la piel conviene mencionarlo pronto.',
      test: '¿Nos ayudaría registrar dos ciclos para saber si estos síntomas siguen mi ciclo?',
      source: { name: 'MedlinePlus: Síndrome premenstrual', url: 'https://medlineplus.gov/spanish/premenstrualsyndrome.html' },
    },
  },
  {
    id: 'libido',
    keys: ['lowLibido', 'vaginalDryness'],
    when: (ctx) => ctx.female && (ctx.has('lowLibido') || (ctx.has('vaginalDryness') && !ctx.topicMatched('perimenopause'))),
    min: 0,
    en: {
      title: 'Changes in desire or vaginal dryness',
      why: 'Changes in desire are common and have many possible contributors: sleep, stress, mood, relationship factors, some medications (including some antidepressants and hormonal birth control), dryness or pain, and hormonal changes. Vaginal dryness usually does not improve on its own and there are several options, so it is worth naming directly.',
      ask: 'Could any medication I take be affecting my desire or causing dryness?',
      source: { name: 'MedlinePlus: Sexual Problems in Women', url: 'https://medlineplus.gov/sexualproblemsinwomen.html' },
    },
    es: {
      title: 'Cambios en el deseo o sequedad vaginal',
      why: 'Los cambios en el deseo son frecuentes y tienen muchas causas posibles: el sueño, el estrés, el ánimo, la relación de pareja, algunos medicamentos (como algunos antidepresivos y anticonceptivos hormonales), la sequedad o el dolor y los cambios hormonales. La sequedad vaginal normalmente no mejora sola y hay varias opciones, así que vale la pena nombrarla directamente.',
      ask: '¿Podría algún medicamento que tomo estar afectando mi deseo o causando sequedad?',
      source: { name: 'MedlinePlus: Problemas sexuales en las mujeres', url: 'https://medlineplus.gov/spanish/sexualproblemsinwomen.html' },
    },
  },
  {
    id: 'male',
    keys: ['lowLibido', 'erectileDysfunction', 'muscleLoss', 'gynecomastia', 'testicularAtrophy'],
    when: (ctx) => ctx.male && ['lowLibido', 'erectileDysfunction', 'muscleLoss', 'gynecomastia', 'testicularAtrophy'].some(ctx.has),
    min: 0,
    en: {
      title: 'Changes in desire, erections or muscle',
      why: 'Low desire and erection problems are common and can be linked to blood vessel health, blood sugar, medications, mood or low testosterone. Erection problems can be an early sign of heart or blood vessel issues, which is a good reason to raise them.',
      test: 'Would a morning testosterone test, or checks of blood sugar and cholesterol, make sense for me?',
      source: { name: 'MedlinePlus: Erectile Dysfunction', url: 'https://medlineplus.gov/erectiledysfunction.html' },
    },
    es: {
      title: 'Cambios en el deseo, las erecciones o la masa muscular',
      why: 'El bajo deseo y los problemas de erección son frecuentes y pueden relacionarse con la salud de los vasos sanguíneos, el azúcar en sangre, los medicamentos, el ánimo o la testosterona baja. Los problemas de erección pueden ser una señal temprana de problemas del corazón o de los vasos sanguíneos, lo que es una buena razón para mencionarlos.',
      test: '¿Tendría sentido un análisis de testosterona por la mañana, o revisar el azúcar en sangre y el colesterol?',
      source: { name: 'MedlinePlus: Disfunción eréctil', url: 'https://medlineplus.gov/spanish/erectiledysfunction.html' },
    },
  },
  {
    id: 'mood',
    keys: ['stress', 'stressHandling', 'moodSwings', 'wakingDifficulty', 'energyCrashes', 'saltCravings'],
    min: 1,
    en: {
      title: 'Stress, anxiety and mood',
      why: 'Ongoing stress, anxiety and mood swings affect sleep, energy and appetite, and they can also be part of hormonal or thyroid changes. Clinicians often use a short questionnaire to understand mood, and it is fine to ask for one. "Adrenal fatigue" is not a recognized medical diagnosis, but the symptoms themselves are real and worth discussing.',
      test: 'Could we use a short mood or anxiety questionnaire to see where I am?',
      source: { name: 'NIMH: Anxiety Disorders', url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders' },
    },
    es: {
      title: 'Estrés, ansiedad y estado de ánimo',
      why: 'El estrés continuo, la ansiedad y los cambios de humor afectan el sueño, la energía y el apetito, y también pueden formar parte de cambios hormonales o de la tiroides. Los profesionales de salud suelen usar un cuestionario corto para entender el estado de ánimo, y está bien pedirlo. La "fatiga suprarrenal" no es un diagnóstico médico reconocido, pero los síntomas son reales y vale la pena hablarlos.',
      test: '¿Podríamos usar un cuestionario corto de ánimo o ansiedad para ver cómo estoy?',
      source: { name: 'MedlinePlus: Ansiedad', url: 'https://medlineplus.gov/spanish/anxiety.html' },
    },
  },
  {
    id: 'metabolic',
    keys: ['bloodSugar', 'bellyFat', 'sugarCravings', 'weightLoss', 'insulinResistance'],
    min: 1,
    en: {
      title: 'Blood sugar, cravings and weight',
      why: 'Blood sugar swings, cravings, weight around the middle and difficulty losing weight can be linked to how the body handles insulin. Prediabetes is common, often has no clear symptoms, and is checked with simple blood tests.',
      test: 'Would an A1C or fasting glucose test make sense for me?',
      source: { name: 'NIDDK: Insulin Resistance & Prediabetes', url: 'https://www.niddk.nih.gov/health-information/diabetes/overview/what-is-diabetes/prediabetes-insulin-resistance' },
    },
    es: {
      title: 'Azúcar en sangre, antojos y peso',
      why: 'Los cambios del azúcar en sangre, los antojos, el peso en la cintura y la dificultad para perder peso pueden relacionarse con cómo el cuerpo maneja la insulina. La prediabetes es frecuente, a menudo no da síntomas claros y se revisa con análisis de sangre sencillos.',
      test: '¿Tendría sentido un análisis de A1C o de glucosa en ayunas?',
      source: { name: 'MedlinePlus: Prediabetes', url: 'https://medlineplus.gov/spanish/prediabetes.html' },
    },
  },
  {
    id: 'hair',
    keys: ['hairLoss'],
    when: (ctx) => ctx.has('hairLoss') && !ctx.topicMatched('thyroid'),
    min: 0,
    en: {
      title: 'Hair thinning',
      why: 'Hair thinning can be linked to thyroid changes, low iron, hormonal changes, a recent illness or stressful event, or medications. Knowing roughly when it started helps.',
      test: 'Would checking my thyroid and iron levels help explain the thinning?',
      source: { name: 'American Academy of Dermatology: Hair loss', url: 'https://www.aad.org/public/diseases/hair-loss/causes/18-causes' },
    },
    es: {
      title: 'Cabello más delgado',
      why: 'El cabello más delgado puede relacionarse con cambios de la tiroides, hierro bajo, cambios hormonales, una enfermedad o un momento estresante reciente, o medicamentos. Ayuda saber más o menos cuándo empezó.',
      test: '¿Ayudaría revisar mi tiroides y mi hierro para entender la caída del cabello?',
      source: { name: 'MedlinePlus: Pérdida del cabello', url: 'https://medlineplus.gov/spanish/hairloss.html' },
    },
  },
];

// Topics that come from answers other than the symptom list.
export const EXTRA_TOPICS = {
  sleep: {
    en: {
      title: 'Poor sleep',
      why: 'Poor sleep affects mood, energy, appetite and weight. For long-term insomnia, guidelines recommend cognitive behavioral therapy for insomnia (CBT-I) as a first step. Loud snoring, gasping, or pauses in breathing at night are worth mentioning, because they can point to sleep apnea.',
      test: 'Is a referral for CBT-I, or a sleep study, worth considering for me?',
      source: { name: 'NHLBI: Insomnia', url: 'https://www.nhlbi.nih.gov/health/insomnia' },
    },
    es: {
      title: 'Dormir mal',
      why: 'Dormir mal afecta el ánimo, la energía, el apetito y el peso. Para el insomnio de larga duración, las guías recomiendan como primer paso la terapia cognitivo-conductual para el insomnio (TCC-I). Vale la pena mencionar los ronquidos fuertes, los jadeos o las pausas al respirar por la noche, porque pueden indicar apnea del sueño.',
      test: '¿Vale la pena considerar una derivación a TCC-I o un estudio del sueño?',
      source: { name: 'MedlinePlus: Insomnio', url: 'https://medlineplus.gov/spanish/insomnia.html' },
    },
  },
  exposures: {
    en: {
      title: 'Everyday chemical exposures',
      why: 'Some chemicals in everyday products, such as certain plastics, can interfere with hormones. These are called endocrine disruptors. Research is still developing, so ask your clinician which changes, if any, are worth making.',
      source: { name: 'NIEHS: Endocrine Disruptors', url: 'https://www.niehs.nih.gov/health/topics/agents/endocrine' },
    },
    es: {
      title: 'Exposiciones químicas cotidianas',
      why: 'Algunas sustancias químicas de productos cotidianos, como ciertos plásticos, pueden interferir con las hormonas. Se llaman disruptores endocrinos. La investigación sigue avanzando, así que pregunta a tu profesional de salud qué cambios valen la pena, si los hay.',
      source: { name: 'NIEHS: Endocrine Disruptors (en inglés)', url: 'https://www.niehs.nih.gov/health/topics/agents/endocrine' },
    },
  },
};

// Short glossary. A term is shown only when it appears in the person's kit.
export const GLOSSARY = [
  { term: 'TSH', en: 'Thyroid-stimulating hormone. The usual first blood test of thyroid function.', es: 'Hormona estimulante de la tiroides. El primer análisis de sangre habitual para ver cómo funciona la tiroides.' },
  { term: 'A1C', en: 'A blood test that reflects average blood sugar over about three months.', es: 'Análisis de sangre que refleja el promedio del azúcar en sangre de unos tres meses.' },
  { term: 'ferritin', es_term: 'ferritina', en: 'A blood test that shows how much iron the body has stored.', es: 'Análisis de sangre que muestra cuánto hierro tiene guardado el cuerpo.' },
  { term: 'prolactin', es_term: 'prolactina', en: 'A hormone that affects periods and milk production; sometimes checked when cycles are irregular.', es: 'Hormona que influye en los períodos y en la producción de leche; a veces se revisa cuando los ciclos son irregulares.' },
  { term: 'PCOS', es_term: 'SOP', en: 'Polycystic ovary syndrome. A common hormonal condition that can affect cycles, skin, hair and blood sugar.', es: 'Síndrome de ovario poliquístico. Una condición hormonal frecuente que puede afectar los ciclos, la piel, el cabello y el azúcar en sangre.' },
  { term: 'CBT-I', es_term: 'TCC-I', en: 'Cognitive behavioral therapy for insomnia. A structured, drug-free program to improve sleep.', es: 'Terapia cognitivo-conductual para el insomnio. Un programa estructurado, sin medicamentos, para dormir mejor.' },
  { term: 'perimenopause', es_term: 'perimenopausia', en: 'The years before menopause when hormone levels shift and periods change.', es: 'Los años antes de la menopausia, cuando las hormonas cambian y los períodos también.' },
  { term: 'endocrine disruptors', es_term: 'disruptores endocrinos', en: 'Chemicals in some everyday products that can interfere with hormones.', es: 'Sustancias químicas de algunos productos cotidianos que pueden interferir con las hormonas.' },
];
