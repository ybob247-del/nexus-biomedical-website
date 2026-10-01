import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import brand from '../../config/brand';
import '../../styles/consumer-sample.css';

/**
 * About: why the site exists and who is behind it.
 *
 * The founder's training is stated without her name, by her choice. Degrees
 * are described as research training and immediately bounded: not medical
 * licensure, not a clinician. Keep the limit in the same paragraph as the
 * credential, never in a footnote, so the overall impression is accurate.
 */

const COPY = {
  en: {
    title: 'About Not Imagining It',
    lead: 'Most people do not leave an appointment with a plan. They leave with the feeling that they forgot the one thing that mattered.',
    body: [
      'Fifteen minutes is not long. You have five things going on, they started at different times, and the one you most wanted to raise is the one you leave out. Afterwards you are told everything looks normal, and you are left wondering whether you imagined it.',
      'You did not. This site exists to make that conversation easier to have: to turn what you have been noticing into one clear page, ranked, with the reasons each thing is worth raising and the questions you might ask.',
      'It is deliberately small. One free assessment, one $39 kit, no subscription, no account, and nothing about you stored on our servers.',
    ],
    whoTitle: 'Who makes it',
    who:
      'Not Imagining It was created by a biomedical engineer who holds a bachelor\'s degree, a master\'s degree and a PhD in biomedical engineering, and who carried out her doctoral research at the NIH Clinical Center. That training is in evaluating evidence and explaining complex health information clearly. It is not medical licensure: she is not a doctor, nurse or licensed clinician, and this site does not diagnose, recommend treatment or replace medical care.',
    sourcesTitle: 'How we handle being wrong',
    sources:
      `Everything in the kit is built from published guidance by organizations such as ACOG, NIH institutes and MedlinePlus, and every source link is checked before it ships. If something is inaccurate, unclear, or reads like medical advice rather than education, email ${brand.supportEmail} and it gets corrected for everyone.`,
    cta: 'How the kit is made',
    cta2: 'See a full sample kit',
  },
  es: {
    title: 'Sobre Not Imagining It',
    lead: 'La mayoría de las personas no sale de una consulta con un plan. Sale con la sensación de que olvidó lo único que importaba.',
    body: [
      'Quince minutos no son muchos. Tienes cinco cosas pasando, empezaron en momentos distintos, y justo la que más querías mencionar es la que se queda fuera. Después te dicen que todo salió normal y te quedas pensando si te lo imaginaste.',
      'No te lo imaginaste. Este sitio existe para que esa conversación sea más fácil: convertir lo que has estado notando en una página clara y ordenada, con las razones por las que vale la pena mencionar cada cosa y las preguntas que podrías hacer.',
      'Es pequeño a propósito. Una evaluación gratis, un kit de $39, sin suscripción, sin cuenta y sin guardar nada tuyo en nuestros servidores.',
    ],
    whoTitle: 'Quién lo hace',
    who:
      'Not Imagining It fue creado por una ingeniera biomédica con licenciatura, maestría y doctorado (PhD) en ingeniería biomédica, que realizó su investigación doctoral en el NIH Clinical Center. Esa formación es para evaluar evidencia y explicar información de salud compleja con claridad. No es una licencia médica: no es doctora, enfermera ni profesional de salud con licencia, y este sitio no diagnostica, no recomienda tratamientos ni reemplaza la atención médica.',
    sourcesTitle: 'Qué hacemos cuando nos equivocamos',
    sources:
      `Todo el contenido del kit se basa en guías publicadas por organizaciones como ACOG, institutos de los NIH y MedlinePlus, y cada enlace se verifica antes de publicarse. Si algo es inexacto, confuso o se lee como consejo médico en vez de educación, escribe a ${brand.supportEmail} y se corrige para todas.`,
    cta: 'Cómo se crea el kit',
    cta2: 'Ver un kit de ejemplo completo',
  },
};

export default function About() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const c = COPY[lang];

  return (
    <main className="nii-doc">
      <h1>{c.title}</h1>
      <p className="nii-doc-lead">{c.lead}</p>
      {c.body.map((p) => (
        <p key={p}>{p}</p>
      ))}

      <section>
        <h2>{c.whoTitle}</h2>
        <p>{c.who}</p>
      </section>

      <section>
        <h2>{c.sourcesTitle}</h2>
        <p>{c.sources}</p>
      </section>

      <div className="nii-doc-actions">
        <Link className="nii-sample-cta" to="/sample">{c.cta2}</Link>
        <Link className="nii-sample-ghost" to="/how-it-works">{c.cta}</Link>
      </div>
    </main>
  );
}
