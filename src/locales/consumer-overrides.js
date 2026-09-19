/**
 * Copy for the consumer brand that replaces the shared locale strings by key.
 *
 * The shared locale files describe the Nexus EndoGuard product, and the Spanish
 * file has drifted from the English one. The consumer site sells a one-time
 * Appointment Prep Kit, so its landing copy is written here once, in both
 * languages, with the same structure. Keys not listed keep the shared text.
 *
 * Keep EN and ES in step: same keys, same meaning.
 */

export const PRODUCT_NAME_ES = 'Kit de preparación para tu consulta';

const learnmoreEN = {
  hero: {
    title: 'Not Imagining It',
    subtitle: 'Walk Into Your Next Appointment Prepared',
    disclaimer1: 'Educational only. Not a diagnosis.',
    disclaimer2: 'If you\'ve been told "your labs are normal" but you still don\'t feel normal, start here.',
  },
  problem: {
    title: 'Why This Exists',
    p1: 'Hormone-related concerns are often hard to explain in a short appointment. Symptoms build slowly, they show up in different parts of life, and many of them do not show on a standard lab test. It is easy to leave the visit without having said the things that mattered most.',
    p2: 'Not Imagining It turns what you have been noticing into a clear, plain-language summary you can bring to your clinician, so the two of you can decide together what to look into next. It does not diagnose, predict, or treat any condition.',
  },
  howItWorks: {
    title: 'How It Works',
    steps: [
      { step: '1', title: 'Your Symptoms & History', desc: 'Answer questions about your symptoms, how long you have had them, your health history, and your daily routine. It takes about 5 minutes.' },
      { step: '2', title: 'Everyday Exposures', desc: 'Answer a few questions about everyday exposures that research has studied in relation to hormones, such as plastics, processed food, drinking water, and work environments.' },
      { step: '3', title: 'Your Symptom Summary', desc: 'Your answers are grouped into a clear summary of what you reported, organized so it is quick to read. This part is free.' },
      { step: '4', title: 'What To Bring Up First', desc: 'See which of the things you reported are most worth raising at your next appointment.' },
      { step: '5', title: 'Questions For Your Clinician', desc: 'Get talking points and questions to ask, including topics such as tests you may want to discuss. Your clinician decides what is right for you.' },
      { step: '6', title: 'Your Printable PDF', desc: 'The full Appointment Prep Kit puts it all on a printable PDF you can keep or hand to your clinician.' },
    ],
  },
  features: {
    title: "What's In The Kit",
    items: [
      { title: 'A Clear Summary', desc: 'Everything you reported, organized so it is quick for you and your clinician to read.' },
      { title: 'What To Raise First', desc: 'Of everything you reported, the items most worth your limited appointment time.' },
      { title: 'Questions To Ask', desc: 'Talking points and questions to bring to your appointment, written in plain language.' },
      { title: 'Clinician-Friendly Page', desc: 'A concise page designed to be handed to your healthcare provider.' },
      { title: 'Sources Where They Apply', desc: 'Where the summary refers to published research, the source is listed so you can read it yourself.' },
      { title: 'English and Spanish', desc: 'Use the whole site in English or Spanish. Switch anytime at the top of the page.' },
    ],
  },
  cta: {
    title: 'Ready to get started?',
    subtitle: 'Answer a few questions for free. Your full Appointment Prep Kit is $39, one time.',
    button: 'Start My Free Assessment',
  },
};

const learnmoreES = {
  hero: {
    title: 'Not Imagining It',
    subtitle: 'Prepárate para tu próxima consulta',
    disclaimer1: 'Solo con fines educativos. No es un diagnóstico.',
    disclaimer2: 'Si te han dicho "tus análisis salieron normales" pero aún no te sientes bien, empieza aquí.',
  },
  problem: {
    title: 'Por qué existe',
    p1: 'Las molestias relacionadas con las hormonas suelen ser difíciles de explicar en una consulta corta. Los síntomas aparecen poco a poco, afectan distintas partes de tu vida y muchos no se ven en un análisis de laboratorio común. Es fácil salir de la consulta sin haber dicho lo que más importaba.',
    p2: 'Not Imagining It convierte lo que has estado notando en un resumen claro y sencillo que puedes llevar a tu profesional de salud, para que decidan juntos qué conviene revisar. No diagnostica, no predice ni trata ninguna enfermedad.',
  },
  howItWorks: {
    title: 'Cómo funciona',
    steps: [
      { step: '1', title: 'Tus síntomas e historial', desc: 'Responde preguntas sobre tus síntomas, desde cuándo los tienes, tu historial de salud y tu rutina diaria. Toma unos 5 minutos.' },
      { step: '2', title: 'Exposiciones cotidianas', desc: 'Responde algunas preguntas sobre exposiciones cotidianas que la investigación ha estudiado en relación con las hormonas, como plásticos, alimentos procesados, agua potable y entornos de trabajo.' },
      { step: '3', title: 'Tu resumen de síntomas', desc: 'Tus respuestas se agrupan en un resumen claro de lo que reportaste, organizado para leerse rápido. Esta parte es gratis.' },
      { step: '4', title: 'Qué mencionar primero', desc: 'Descubre cuáles de las cosas que reportaste vale más la pena mencionar en tu próxima consulta.' },
      { step: '5', title: 'Preguntas para tu profesional de salud', desc: 'Recibe puntos para conversar y preguntas, incluidos temas como pruebas que quizá quieras comentar. Tu profesional de salud decide qué es lo adecuado para ti.' },
      { step: '6', title: 'Tu PDF para imprimir', desc: `El ${PRODUCT_NAME_ES} completo reúne todo en un PDF para imprimir que puedes guardar o entregar a tu profesional de salud.` },
    ],
  },
  features: {
    title: 'Qué incluye el kit',
    items: [
      { title: 'Un resumen claro', desc: 'Todo lo que reportaste, organizado para que tú y tu profesional de salud lo lean rápido.' },
      { title: 'Qué mencionar primero', desc: 'De todo lo que reportaste, lo que más vale tu tiempo limitado en la consulta.' },
      { title: 'Preguntas para hacer', desc: 'Puntos para conversar y preguntas para llevar a tu consulta, en lenguaje sencillo.' },
      { title: 'Una página para tu profesional de salud', desc: 'Una página concisa pensada para entregarla a quien te atiende.' },
      { title: 'Fuentes cuando corresponde', desc: 'Cuando el resumen se refiere a investigación publicada, se indica la fuente para que puedas leerla.' },
      { title: 'Inglés y español', desc: 'Usa todo el sitio en inglés o en español. Cambia de idioma cuando quieras en la parte superior de la página.' },
    ],
  },
  cta: {
    title: '¿Empezamos?',
    subtitle: `Responde algunas preguntas gratis. Tu ${PRODUCT_NAME_ES} completo cuesta $39, pago único.`,
    button: 'Empezar mi evaluación gratis',
  },
};

const assessmentEN = {
  title: 'Your Free Assessment',
  description: 'Answer questions about your symptoms, health history and everyday exposures. You will see a free summary at the end.',
  freeAssessmentBanner: 'Free to start. No credit card needed.',
  freeAssessmentDetails: 'About 5 minutes • Your answers are not stored • Educational, not a diagnosis',
};

const assessmentES = {
  title: 'Tu evaluación gratis',
  description: 'Responde preguntas sobre tus síntomas, tu historial de salud y tus exposiciones cotidianas. Al final verás un resumen gratis.',
  freeAssessmentBanner: 'Empezar es gratis. No necesitas tarjeta.',
  freeAssessmentDetails: 'Unos 5 minutos • No guardamos tus respuestas • Educativo, no es un diagnóstico',
};

// Results page. The score is a summary of how much the visitor reported
// (symptoms, duration, everyday exposures), not a risk of disease, so it is
// named and explained that way.
const resultsEN = {
  title: 'Your Not Imagining It Summary',
  overallRiskLevel: 'Your Summary Score',
  riskScore: 'Summary Score',
  riskLevel: 'Level',
  riskLevels: { low: 'Low', moderate: 'Moderate', high: 'High', veryHigh: 'Very high' },
  riskDescriptions: {
    HIGH: 'You reported a lot: several symptoms, lasting a while, alongside everyday exposures. That is worth a clear conversation with your clinician. This score is not a diagnosis.',
    MODERATE: 'You reported a meaningful number of symptoms and everyday exposures. Bringing a clear summary to your next appointment can help. This score is not a diagnosis.',
    LOW: 'You reported relatively few symptoms and exposures. If something still feels off, it is still worth raising with your clinician. This score is not a diagnosis.',
  },
  edcExposure: {
    title: '🧪 Everyday Exposures',
    exposureRiskScore: 'Everyday Exposure Score',
    risk: '',
    keyRiskFactors: 'What stood out in your answers:',
    impact: 'Why it matters:',
    action: 'To discuss:',
  },
  recommendations: {
    title: '💬 Topics To Discuss With Your Clinician',
    noRecommendations: 'Nothing specific stood out. If something still feels off, bring it up at your next appointment.',
  },
};

const resultsES = {
  title: 'Tu resumen de Not Imagining It',
  overallRiskLevel: 'Tu puntuación resumen',
  riskScore: 'Puntuación resumen',
  riskLevel: 'Nivel',
  riskLevels: { low: 'Bajo', moderate: 'Moderado', high: 'Alto', veryHigh: 'Muy alto' },
  riskDescriptions: {
    HIGH: 'Reportaste bastante: varios síntomas, desde hace un tiempo, junto con exposiciones cotidianas. Vale la pena conversarlo con claridad con tu profesional de salud. Esta puntuación no es un diagnóstico.',
    MODERATE: 'Reportaste un número importante de síntomas y exposiciones cotidianas. Llevar un resumen claro a tu próxima consulta puede ayudarte. Esta puntuación no es un diagnóstico.',
    LOW: 'Reportaste relativamente pocos síntomas y exposiciones. Si algo aún no se siente bien, vale la pena mencionarlo a tu profesional de salud. Esta puntuación no es un diagnóstico.',
  },
  edcExposure: {
    title: '🧪 Exposiciones cotidianas',
    exposureRiskScore: 'Puntuación de exposiciones cotidianas',
    risk: '',
    keyRiskFactors: 'Lo que resaltó en tus respuestas:',
    impact: 'Por qué importa:',
    action: 'Para conversar:',
  },
  recommendations: {
    title: '💬 Temas para conversar con tu profesional de salud',
    noRecommendations: 'No resaltó nada en particular. Si algo aún no se siente bien, menciónalo en tu próxima consulta.',
  },
};

export const consumerOverrides = {
  en: { endoguard: { learnmore: learnmoreEN, assessment: assessmentEN, results: resultsEN } },
  es: { endoguard: { learnmore: learnmoreES, assessment: assessmentES, results: resultsES } },
};

/** Deep-merge overrides into a locale bundle. Arrays in overrides replace whole. */
export function applyOverrides(base, overrides) {
  if (!overrides) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(overrides)) {
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && base && typeof base[key] === 'object'
        ? applyOverrides(base[key], value)
        : value;
  }
  return out;
}
