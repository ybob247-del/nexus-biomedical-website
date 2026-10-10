import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import brand from '../../config/brand';
import '../../styles/consumer-sample.css';

/**
 * How the kit is made: inputs, how they are ordered, where the background
 * comes from, and what the tool never does.
 *
 * This page exists because the product is health-adjacent and faceless. A
 * buyer cannot judge it by a face or a clinic, so the method has to be
 * inspectable instead. Keep every claim here true of the shipped code: if the
 * kit changes, this page changes with it.
 */

const COPY = {
  en: {
    title: 'How the kit is made',
    updated: 'Last updated 30 September 2026',
    intro:
      'Not Imagining It is an educational tool. It organizes what you report so you can discuss it with your clinician. It does not diagnose, does not recommend treatment, and does not tell you which tests to have. Here is exactly how it works.',
    sections: [
      {
        h: 'What goes in',
        p: 'Only what you type into the assessment: your age, biological sex, cycle status, the symptoms you tick, how long you have had them, your sleep, stress, exercise and diet ratings, everyday exposures, and any conditions, medications or supplements you choose to list.',
      },
      {
        h: 'What happens to it',
        p: 'Your kit is built in your browser, on your device. Your answers are sent to our server only to produce your results, and are discarded once that response is sent. We do not save your answers or your results, we do not build a profile, and nothing is sold or shared. Your kit lives in your browser for up to 24 hours so you can return from checkout, and then it is deleted.',
      },
      {
        h: 'How the five things to raise first are ordered',
        p: 'Rules, not opinion. Symptoms that cluster in the same body system rank above single symptoms. Longer duration raises an item. A few topics carry extra weight because people usually most want them answered or because they generally should not wait, for example fertility concerns or heavy bleeding. Pregnancy and breastfeeding always come first. The same answers always produce the same order.',
      },
      {
        h: 'Where the background comes from',
        p: 'Each pattern carries two or three sentences of plain-language background and a link to one reputable patient-facing source: the American College of Obstetricians and Gynecologists, NIH institutes including NIDDK, NHLBI, NIMH and NIEHS, MedlinePlus, the Endocrine Society, the American Thyroid Association and the American Academy of Dermatology. Every link is checked to load before it ships. Spanish readers get a Spanish source wherever one exists, and English pages are labelled when one does not.',
      },
      {
        h: 'Where artificial intelligence is used',
        p: 'The ranking, the background text, the questions, the tests to ask about and the PDF are fixed content and rules, written and reviewed in advance, not generated per person. No AI or language model is used to produce your results, and your answers are not sent to any AI service. Nothing is generated per person: the same answers always give the same kit.',
      },
      {
        h: 'What the kit never does',
        p: 'It never names a condition as yours, never recommends or rules out a treatment, never recommends a supplement, and never tells you to get a test. Tests appear only as questions you can ask, because that decision belongs to your clinician.',
      },
      {
        h: 'When something is wrong',
        p: `If your kit does not match what you entered, or anything reads as medical advice rather than education, email ${brand.supportEmail}. Corrections are made for everyone, not just the person who reported it. If it is not useful to you, the refund is 14 days, no reason needed.`,
      },
    ],
    cta: 'See a full sample kit',
    cta2: 'Start my free assessment',
  },
  es: {
    title: 'Cómo se crea el kit',
    updated: 'Última actualización: 30 de septiembre de 2026',
    intro:
      'Not Imagining It es una herramienta educativa. Organiza lo que reportas para que puedas conversarlo con tu profesional de salud. No diagnostica, no recomienda tratamientos y no te dice qué análisis hacerte. Así funciona exactamente.',
    sections: [
      {
        h: 'Qué entra',
        p: 'Solo lo que escribes en la evaluación: tu edad, sexo biológico, estado del ciclo, los síntomas que marcas, desde cuándo los tienes, cómo califican tu sueño, estrés, ejercicio y alimentación, las exposiciones cotidianas y las condiciones, medicamentos o suplementos que decidas indicar.',
      },
      {
        h: 'Qué pasa con esa información',
        p: 'Tu kit se crea en tu navegador, en tu dispositivo. Tus respuestas se envían a nuestro servidor solo para generar tus resultados y se descartan al enviar esa respuesta. No guardamos tus respuestas ni tus resultados, no creamos un perfil y no vendemos ni compartimos nada. Tu kit permanece en tu navegador hasta 24 horas para que puedas volver después del pago, y luego se borra.',
      },
      {
        h: 'Cómo se ordenan las cinco cosas que mencionar primero',
        p: 'Con reglas, no con opiniones. Los síntomas que se agrupan en un mismo sistema del cuerpo van antes que los síntomas aislados. Más tiempo con el síntoma sube su posición. Algunos temas pesan más porque suelen ser los que más urge responder o porque en general no deberían esperar, por ejemplo las preocupaciones de fertilidad o el sangrado abundante. El embarazo y la lactancia siempre van primero. Las mismas respuestas siempre dan el mismo orden.',
      },
      {
        h: 'De dónde viene la información',
        p: 'Cada patrón incluye dos o tres frases en lenguaje sencillo y un enlace a una fuente confiable para pacientes: el Colegio Americano de Obstetras y Ginecólogos (ACOG), institutos de los NIH como NIDDK, NHLBI, NIMH y NIEHS, MedlinePlus, la Endocrine Society, la American Thyroid Association y la Academia Americana de Dermatología. Cada enlace se verifica antes de publicarse. En español usamos una fuente en español siempre que exista, y marcamos las que solo están en inglés.',
      },
      {
        h: 'Dónde se usa inteligencia artificial',
        p: 'El orden, los textos de contexto, las preguntas, los análisis por los que preguntar y el PDF son contenido y reglas fijas, escritas y revisadas de antemano, no generadas para cada persona. No se usa IA ni ningún modelo de lenguaje para producir tus resultados, y tus respuestas no se envían a ningún servicio de IA. Nada se genera por persona: las mismas respuestas dan siempre el mismo kit.',
      },
      {
        h: 'Lo que el kit nunca hace',
        p: 'Nunca dice que tienes una condición, nunca recomienda ni descarta un tratamiento, nunca recomienda suplementos y nunca te indica hacerte un análisis. Los análisis aparecen solo como preguntas que puedes hacer, porque esa decisión es de tu profesional de salud.',
      },
      {
        h: 'Si algo está mal',
        p: `Si tu kit no coincide con lo que ingresaste, o si algo se lee como consejo médico en vez de educación, escribe a ${brand.supportEmail}. Las correcciones se aplican para todas, no solo para quien lo reportó. Si no te resulta útil, el reembolso es de 14 días, sin dar razones.`,
      },
    ],
    cta: 'Ver un kit de ejemplo completo',
    cta2: 'Empezar mi evaluación gratis',
  },
};

export default function HowItWorks() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const c = COPY[lang];

  return (
    <main className="nii-doc">
      <h1>{c.title}</h1>
      <p className="nii-doc-updated">{c.updated}</p>
      <p className="nii-doc-lead">{c.intro}</p>

      {c.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          <p>{s.p}</p>
        </section>
      ))}

      <div className="nii-doc-actions">
        <Link className="nii-sample-cta" to="/sample">{c.cta}</Link>
        <Link className="nii-sample-ghost" to={brand.routes.assessment}>{c.cta2}</Link>
      </div>
    </main>
  );
}
