import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import brand from '../../config/brand';
import AppointmentKitView from '../../components/AppointmentKitView';
import FreeTrackerLink from '../../components/brand/FreeTrackerLink';
import { exportAppointmentKitPDF } from '../../utils/appointmentKitPdf';
import '../../styles/consumer-sample.css';

/**
 * A full, public sample of the paid Appointment Prep Kit.
 *
 * Buyers cannot inspect a digital product before paying, so this page shows
 * the whole thing, built by the same code that builds a real kit, from
 * invented answers. Every screen is watermarked as an illustrative sample so
 * nobody mistakes it for a real person's health information.
 *
 * The answers below are fiction. They are chosen to show a realistic mix
 * (several systems, a clear duration, some exposures) rather than a best case.
 */

const S = 'endoguard.steps.symptoms';

const SAMPLE_RESULTS = {
  reported: {
    age: 46,
    biologicalSex: 'female',
    menstrualStatus: 'irregular',
    sleepQuality: 'poor',
    stressLevel: 7,
    exerciseFrequency: 'occasional',
    dietQuality: 'fair',
    symptomDuration: '6_12_months',
    plasticUseFrequency: 'high',
    processedFoodFrequency: 'daily',
    medications: 'Loratadine 10 mg daily',
    supplements: 'Vitamin D 1000 IU daily',
    symptomKeys: [
      `${S}.thyroid.fatigue`,
      `${S}.thyroid.brainFog`,
      `${S}.thyroid.weightChange`,
      `${S}.reproductive.female.hotFlashes`,
      `${S}.reproductive.female.irregularCycles`,
      `${S}.reproductive.female.lowLibido`,
      `${S}.adrenal.moodSwings`,
      `${S}.metabolic.sugarCravings`,
    ],
  },
};

const COPY = {
  en: {
    eyebrow: 'Full sample',
    title: 'See exactly what the $39 kit produces',
    intro:
      'This is a complete Appointment Prep Kit, built by the same code that builds a real one. The answers are invented, so the content is not anyone\'s real health information. Yours is built from your own answers and will read differently.',
    watermark: 'Illustrative sample — not a real person',
    downloadLabel: 'Download this sample as a PDF',
    compareTitle: 'Free assessment vs. the $39 kit',
    compareFree: 'Free assessment',
    comparePaid: 'Appointment Prep Kit, $39',
    rows: [
      ['Your summary score and what you reported', true, true],
      ['Your symptoms grouped by body system', true, true],
      ['The five things most worth raising first, ranked', false, true],
      ['Plain-language reason each one is worth raising, with a trusted source', false, true],
      ['A 30-second opener to read at the start of the visit', false, true],
      ['Questions to ask, and tests people commonly ask about', false, true],
      ['What to bring, what to say if you feel rushed, when not to wait', false, true],
      ['A printable PDF, with a two-week symptom log and notes pages', false, true],
    ],
    privacy:
      'Both are built in your browser. We never save your answers or your results on our servers, and nothing on this page came from a real visitor.',
    ctaPrimary: 'Start my free assessment',
    ctaSecondary: 'How the kit is made',
    refund: 'One-time $39. No subscription. Full refund within 14 days if it is not useful to you.',
  },
  es: {
    eyebrow: 'Ejemplo completo',
    title: 'Mira exactamente qué entrega el kit de $39',
    intro:
      'Este es un Kit de preparación para tu consulta completo, creado con el mismo código que crea uno real. Las respuestas son inventadas, así que el contenido no es la información de salud de ninguna persona. El tuyo se crea con tus propias respuestas y se leerá distinto.',
    watermark: 'Ejemplo ilustrativo — no es una persona real',
    downloadLabel: 'Descargar este ejemplo en PDF',
    compareTitle: 'Evaluación gratis vs. el kit de $39',
    compareFree: 'Evaluación gratis',
    comparePaid: 'Kit de preparación, $39',
    rows: [
      ['Tu puntaje resumen y lo que reportaste', true, true],
      ['Tus síntomas agrupados por sistema del cuerpo', true, true],
      ['Las cinco cosas más importantes que mencionar primero, ordenadas', false, true],
      ['Una explicación sencilla de por qué vale la pena mencionarlas, con una fuente confiable', false, true],
      ['Una presentación de 30 segundos para leer al empezar la consulta', false, true],
      ['Preguntas para hacer y análisis por los que la gente suele preguntar', false, true],
      ['Qué llevar, qué decir si sientes prisa y cuándo no esperar', false, true],
      ['Un PDF para imprimir, con un registro de síntomas de dos semanas y hojas de notas', false, true],
    ],
    privacy:
      'Ambos se crean en tu navegador. Nunca guardamos tus respuestas ni tus resultados en nuestros servidores, y nada de esta página vino de una visitante real.',
    ctaPrimary: 'Empezar mi evaluación gratis',
    ctaSecondary: 'Cómo se crea el kit',
    refund: 'Pago único de $39. Sin suscripción. Reembolso completo dentro de 14 días si no te resulta útil.',
  },
};

/**
 * The repeating diagonal watermark, as a tiled SVG. Drawn as a background
 * image on an overlay so it sits above the white cards, and built here rather
 * than in CSS so it can carry the translated wording.
 */
function watermarkTile(text) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="620" height="300">
    <text x="0" y="200" transform="rotate(-24 0 200)" font-family="Karla, Arial, sans-serif"
      font-size="22" font-weight="700" letter-spacing="2" fill="rgba(196,71,47,0.16)">${text}</text>
  </svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export default function SampleKit() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
  const c = COPY[lang];

  return (
    <main className="nii-sample">
      <header className="nii-sample-head">
        <p className="nii-sample-eyebrow">{c.eyebrow}</p>
        <h1>{c.title}</h1>
        <p className="nii-sample-intro">{c.intro}</p>
        <div className="nii-sample-actions">
          <Link className="nii-sample-cta" to={brand.routes.assessment}>
            {c.ctaPrimary}
          </Link>
          <button
            type="button"
            className="nii-sample-ghost"
            onClick={() => exportAppointmentKitPDF(SAMPLE_RESULTS, i18n.language)}
          >
            {c.downloadLabel}
          </button>
        </div>
        <p className="nii-sample-refund">{c.refund}</p>
      </header>

      <section className="nii-sample-compare" aria-label={c.compareTitle}>
        <h2>{c.compareTitle}</h2>
        <table>
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col">{c.compareFree}</th>
              <th scope="col">{c.comparePaid}</th>
            </tr>
          </thead>
          <tbody>
            {c.rows.map(([label, free, paid]) => (
              <tr key={label}>
                <th scope="row">{label}</th>
                <td>{free ? <span className="yes" aria-label="yes">✓</span> : <span className="no" aria-label="no">—</span>}</td>
                <td>{paid ? <span className="yes" aria-label="yes">✓</span> : <span className="no" aria-label="no">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="nii-sample-privacy">{c.privacy}</p>
      </section>

      {/* The sample itself, watermarked so it can never be mistaken for real
          health information if it is screenshotted or printed. */}
      <div className="nii-sample-frame">
        <p className="nii-sample-banner">{c.watermark}</p>
        <div className="nii-sample-watermark" style={{ '--nii-watermark': watermarkTile(c.watermark) }}>
          <AppointmentKitView results={SAMPLE_RESULTS} />
        </div>
        <p className="nii-sample-banner">{c.watermark}</p>
      </div>

      <FreeTrackerLink variant="card" />

      <footer className="nii-sample-foot">
        <Link className="nii-sample-cta" to={brand.routes.assessment}>
          {c.ctaPrimary}
        </Link>
        <Link className="nii-sample-ghost" to="/how-it-works">
          {c.ctaSecondary}
        </Link>
      </footer>
    </main>
  );
}
