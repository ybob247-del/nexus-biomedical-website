import { useTranslation } from 'react-i18next';
import brand from '../../config/brand';
import LegalPage from './LegalPage';

/**
 * Medical disclaimer for the consumer brand. Educational tool only: no
 * diagnosis, no treatment, no doctor-patient relationship, not FDA reviewed.
 * English and Spanish live side by side so they stay in sync.
 */
export default function MedicalDisclaimer() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  const email = <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>;

  if (lang === 'es') {
    return (
      <LegalPage title="Aviso médico" updated="Última actualización: 16 de septiembre de 2026">
        <p className="nii-legal-callout">
          <strong>¿Es una emergencia?</strong> Llama al número de emergencias de tu país (911 en
          Estados Unidos) o ve a la sala de emergencias más cercana. No uses este sitio.
        </p>

        <h2>Solo información educativa</h2>
        <p>
          {brand.name} ofrece información educativa para ayudarte a preparar una conversación con tu
          médico. No es consejo médico, diagnóstico ni tratamiento. El sitio no está diseñado para
          diagnosticar ni tratar ninguna enfermedad.
        </p>

        <h2>No somos tu médico</h2>
        <p>
          Usar este sitio o comprar el kit no crea una relación médico-paciente. Habla siempre con un
          profesional de la salud calificado sobre tus síntomas y tu salud.
        </p>

        <h2>No cambies tu tratamiento por lo que leas aquí</h2>
        <p>
          No empieces, suspendas ni cambies ningún medicamento o tratamiento con base en este sitio.
          Consulta primero con tu médico.
        </p>

        <h2>Embarazo y lactancia</h2>
        <p>
          Si estás embarazada, crees que podrías estarlo o estás amamantando, habla de tus resultados con
          tu médico antes de hacer cualquier cambio.
        </p>

        <h2>Los límites de tus resultados</h2>
        <ul>
          <li>Tus resultados dependen de lo que respondiste y de investigaciones publicadas, que tienen
            sus propias limitaciones.</li>
          <li>Partes del texto las redacta una inteligencia artificial y pueden ser incorrectas o estar
            incompletas.</li>
          <li>Si se mencionan análisis de laboratorio, son temas para conversar con tu médico, no una
            recomendación para hacerte o evitar un análisis.</li>
        </ul>

        <h2>Sin revisión de la FDA</h2>
        <p>
          Este sitio y su contenido no han sido revisados ni aprobados por la Administración de
          Alimentos y Medicamentos de EE. UU. (FDA).
        </p>

        <h2>Contacto</h2>
        <p>¿Preguntas sobre este aviso? Escríbenos a {email}.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Medical Disclaimer" updated="Last updated September 16, 2026">
      <p className="nii-legal-callout">
        <strong>Is this an emergency?</strong> Call your local emergency number (911 in the US) or go to
        the nearest emergency department. Don&apos;t use this site.
      </p>

      <h2>Educational information only</h2>
      <p>
        {brand.name} provides educational information to help you prepare for a conversation with your
        clinician. It is not medical advice, diagnosis or treatment. The site is not intended to
        diagnose or treat any disease.
      </p>

      <h2>We are not your doctor</h2>
      <p>
        Using this site or buying the kit does not create a doctor-patient relationship. Always talk to
        a qualified clinician about your symptoms and your health.
      </p>

      <h2>Don&apos;t change your treatment based on this site</h2>
      <p>
        Don&apos;t start, stop or change any medication or treatment based on anything you read here.
        Talk to your clinician first.
      </p>

      <h2>Pregnancy and breastfeeding</h2>
      <p>
        If you are pregnant, might be pregnant or are breastfeeding, discuss your results with your
        clinician before making any changes.
      </p>

      <h2>The limits of your results</h2>
      <ul>
        <li>Your results depend on what you entered and on published research, which has its own
          limits.</li>
        <li>Parts of the text are written by AI and can be wrong or incomplete.</li>
        <li>Any mention of a lab test is a topic to discuss with your clinician, not a recommendation to
          get or skip a test.</li>
      </ul>

      <h2>Not reviewed by the FDA</h2>
      <p>
        This site and its content have not been reviewed or cleared by the US Food and Drug
        Administration (FDA).
      </p>

      <h2>Contact</h2>
      <p>Questions about this disclaimer? Email {email}.</p>
    </LegalPage>
  );
}
