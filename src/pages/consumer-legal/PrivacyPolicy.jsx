import { useTranslation } from 'react-i18next';
import brand from '../../config/brand';
import LegalPage from './LegalPage';

/**
 * Privacy policy for the consumer brand.
 *
 * Written to match how the site actually works: answers are processed but not
 * stored, some answers go to OpenAI, payments go through Stripe, no accounts,
 * no analytics, and email only for people who join the Kit list. If any of that
 * changes, change this page.
 * English and Spanish live side by side so they stay in sync.
 */
export default function PrivacyPolicy() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('es') ? 'es' : 'en';

  const email = <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a>;
  const price = brand.offer.priceLabel;

  if (lang === 'es') {
    return (
      <LegalPage
        title="Política de privacidad"
        updated="Última actualización: 16 de septiembre de 2026"
      >
        <div className="nii-legal-callout">
          <h2>En pocas palabras</h2>
          <ul>
            <li>No guardamos tus respuestas ni tus resultados. Los calculamos y te los devolvemos.</li>
            <li>Algunas respuestas se envían a OpenAI para redactar partes de tu resumen. Tus condiciones, medicamentos y suplementos escritos a mano no se envían.</li>
            <li>No hay cuentas, suscripciones, cookies publicitarias ni herramientas de analítica. Solo recibes nuestros correos si te suscribes.</li>
            <li>Si compras, Stripe procesa el pago. Nosotros nunca vemos el número completo de tu tarjeta.</li>
            <li>No vendemos tu información ni la usamos para publicidad.</li>
          </ul>
        </div>

        <h2>Quiénes somos</h2>
        <p>
          {brand.name} ({brand.domain}) es una marca de {brand.legalName}, una empresa de Texas,
          Estados Unidos. En esta política, &quot;nosotros&quot; se refiere a {brand.legalName}.
          Puedes escribirnos a {email}. Es nuestra única vía de contacto.
        </p>

        <h2>Qué hace este sitio</h2>
        <p>
          Respondes un cuestionario gratuito y te mostramos un resumen gratis. Con un pago único de{' '}
          {price} USD (el &quot;Kit de preparación para tu consulta&quot;) desbloqueas los resultados
          completos en tu navegador y un PDF para imprimir y llevar a tu médico. Es una herramienta
          educativa. No diagnostica ni trata ninguna enfermedad.
        </p>

        <h2>Qué información usamos y para qué</h2>
        <p><strong>Tus respuestas al cuestionario.</strong> Incluyen edad, sexo biológico, estatura,
          peso, estado menstrual, síntomas y desde cuándo los tienes, cómo calificas tu alimentación,
          ejercicio, sueño y estrés, preguntas sobre exposiciones cotidianas (como uso de plásticos,
          alimentos procesados, fuente de agua y exposiciones en el trabajo) y, si quieres, texto libre
          sobre condiciones existentes, medicamentos y suplementos.
        </p>
        <ul>
          <li>Se envían a nuestro servidor (alojado en Vercel, en EE. UU.) solo para calcular tus
            resultados, que luego regresan a tu navegador.</li>
          <li><strong>No guardamos tus respuestas ni tus resultados en ninguna base de datos.</strong></li>
          <li>Para redactar partes del resumen, el servidor puede enviar a nuestro proveedor de IA,
            OpenAI (EE. UU.), tu edad, sexo biológico, la lista de síntomas, tus calificaciones de estilo
            de vida y un puntaje general de exposición. <strong>No enviamos a OpenAI el texto libre sobre
            condiciones, medicamentos o suplementos.</strong></li>
        </ul>
        <p><strong>Registros técnicos.</strong> Nuestro proveedor de hosting guarda registros técnicos
          estándar de cada solicitud (como dirección IP, tipo de navegador, hora y mensajes de error)
          por un tiempo limitado, por seguridad y para resolver problemas.
        </p>
        <p><strong>Datos de compra.</strong> Si compras el kit, escribes tu correo electrónico en nuestro
          sitio y lo pasamos a Stripe, y luego escribes tus datos de pago en la página de pago de Stripe.
          No guardamos tu correo en nuestro servidor. Stripe lo usa para enviarte el recibo y confirmar
          la compra. Nunca vemos ni guardamos el número completo de tu tarjeta. Stripe
          conserva un registro de la compra (correo, monto y fecha), que podemos ver en nuestra cuenta
          de Stripe y que conservamos según lo exijan las normas fiscales y contables.
        </p>
        <p><strong>Correos que nos envías.</strong> Si escribes a soporte, tu mensaje se gestiona en
          nuestro correo de Google Workspace. El botón &quot;Reportar un problema&quot; solo abre un
          correo en tu propia aplicación: no guarda nada en este sitio ni toma capturas de pantalla.
          Por favor, no incluyas datos de salud en tus correos.
        </p>
        <p><strong>Nuestra lista de correos (opcional).</strong> Si te suscribes (por ejemplo, para
          recibir un registro de síntomas gratis), guardamos tu correo, tu nombre si lo das, el
          idioma que elegiste y la página donde te suscribiste, para enviarte esos correos. Usamos
          Kit (EE. UU.) para enviarlos; Kit puede registrar si abres un correo o haces clic en un
          enlace. Tus respuestas a la evaluación nunca se agregan a esta lista. Puedes darte de baja
          en cualquier momento con el enlace al final de cada correo, y pedirnos que borremos tus
          datos.
        </p>

        <h2>Información guardada en tu navegador</h2>
        <p>No usamos cookies publicitarias, Google Analytics ni ninguna otra herramienta de rastreo o
          analítica. Solo guardamos en tu propio navegador:</p>
        <ul>
          <li>Tu preferencia de idioma (una cookie y almacenamiento local, unos 30 días).</li>
          <li>Una nota de que ya completaste la visita guiada.</li>
          <li>Tus respuestas y resultados, de forma temporal, por hasta 24 horas, para que no se pierdan al ir y
            volver de Stripe ni si recargas la página. Se borran automáticamente la próxima vez que
            abras el sitio después de esas 24 horas, o cuando borres los datos de este sitio en tu
            navegador.</li>
        </ul>
        <p>Las fuentes tipográficas se cargan desde Google Fonts, que recibe tu dirección IP como parte
          de la entrega de esos archivos.</p>

        <h2>Tu PDF</h2>
        <p>
          El PDF se genera por completo en tu navegador. No guardamos una copia, así que descárgalo o
          imprímelo. Si lo pierdes, tendrías que volver a hacer la evaluación. También puedes
          escribirnos sobre tu compra.
        </p>

        <h2>Con quién compartimos información</h2>
        <p>Solo con los proveedores que hacen funcionar el sitio:</p>
        <ul>
          <li><strong>Vercel</strong>: hosting.</li>
          <li><strong>OpenAI</strong>: redacción de texto con IA.</li>
          <li><strong>Stripe</strong>: pagos y recibos.</li>
          <li><strong>Kit</strong>: nuestra lista de correos, solo si te suscribes.</li>
          <li><strong>Google</strong>: correo de Google Workspace y Google Fonts.</li>
        </ul>
        <p>
          No vendemos tu información personal, no la compartimos para publicidad y no usamos tu
          información de salud para publicidad. Podríamos divulgar información si la ley nos obliga.
        </p>

        <h2>El texto escrito con IA</h2>
        <p>El texto redactado por IA puede ser incorrecto o estar incompleto. Revísalo con tu médico.</p>

        <h2>Datos de salud del consumidor</h2>
        <p>
          Tus respuestas son &quot;datos de salud del consumidor&quot; según leyes como la My Health My
          Data Act de Washington y leyes similares de Nevada y Connecticut. Cuando decides enviar tus
          respuestas para obtener resultados, das tu consentimiento para el uso descrito aquí: calcular
          tus resultados y enviar parte de ellas a nuestro proveedor de IA. Si no quieres, simplemente
          no envíes el cuestionario. Puedes dejarlo en cualquier momento.
        </p>
        <p>
          Suscribirte a correos sobre salud hormonal también puede revelar un interés de salud. Por
          eso tratamos nuestra lista de correos con el mismo cuidado: solo la usamos para enviarte los
          correos que pediste, nunca la vendemos ni la compartimos para publicidad, y puedes retirar
          tu consentimiento dándote de baja.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes pedirnos acceso a tu información, pedir que la borremos o retirar tu consentimiento.
          Como no guardamos tus respuestas, por lo general lo único que tenemos es el registro de
          compra en Stripe, los correos que nos hayas enviado y, si te suscribiste, tus datos en nuestra lista de correos. Escríbenos a {email}. Respondemos
          en un plazo de 45 días.
        </p>
        <p>
          Si rechazamos tu solicitud, puedes apelar respondiendo a nuestro correo con la palabra
          &quot;Apelación&quot; (o &quot;Appeal&quot;) en el asunto.
        </p>
        <p>
          <strong>California:</strong> no vendemos ni compartimos información personal, y tienes los
          mismos derechos descritos arriba.
        </p>
        <p>
          <strong>Unión Europea y Reino Unido:</strong> usamos tus datos de salud con base en tu
          consentimiento, y los datos de compra para cumplir el contrato de compra. Tu información se
          procesa en Estados Unidos. También tienes derecho a presentar una queja ante la autoridad de
          protección de datos de tu país.
        </p>

        <h2>Menores de edad</h2>
        <p>
          Este sitio es para personas adultas de 18 años o más y no está dirigido a menores. Si nos
          enteramos de que un menor nos envió información por correo, la borramos.
        </p>

        <h2>Seguridad</h2>
        <p>
          La información viaja cifrada mediante HTTPS y guardamos lo mínimo posible. Aun así, ningún
          método es 100 % seguro.
        </p>

        <h2>Cambios a esta política</h2>
        <p>
          Si cambiamos esta política, publicaremos la nueva versión aquí con una fecha actualizada. Si
          el cambio es importante, lo destacaremos en el sitio y, si estás en nuestra lista de correos,
          también te avisaremos por email.
        </p>

        <h2>Contacto</h2>
        <p>¿Preguntas? Escríbenos a {email}.</p>
      </LegalPage>
    );
  }

  return (
    <LegalPage title="Privacy Policy" updated="Last updated September 16, 2026">
      <div className="nii-legal-callout">
        <h2>The short version</h2>
        <ul>
          <li>We don&apos;t store your answers or results. We calculate them and send them back to you.</li>
          <li>Some answers go to OpenAI to write parts of your summary. Anything you type about conditions, medications or supplements does not.</li>
          <li>No accounts, subscriptions, advertising cookies or analytics. You only get our emails if you sign up for them.</li>
          <li>If you buy, Stripe handles the payment. We never see your full card number.</li>
          <li>We don&apos;t sell your information or use it for advertising.</li>
        </ul>
      </div>

      <h2>Who we are</h2>
      <p>
        {brand.name} ({brand.domain}) is a brand of {brand.legalName}, a business based in Texas,
        USA. In this policy, &quot;we&quot; and &quot;us&quot; mean {brand.legalName}. You can reach us
        at {email}. Email is the only way to contact us.
      </p>

      <h2>What this site does</h2>
      <p>
        You answer a free questionnaire and see a free summary. A one-time purchase of {price} USD (the
        &quot;Appointment Prep Kit&quot;) unlocks your full results in your browser and a printable PDF to
        bring to your doctor. It is an educational tool. It does not diagnose or treat anything.
      </p>

      <h2>What we use, and why</h2>
      <p><strong>Your questionnaire answers.</strong> These include age, biological sex, height,
        weight, menstrual status, symptoms and how long you&apos;ve had them, ratings for diet,
        exercise, sleep and stress, everyday exposure questions (such as plastics use, processed food,
        water source and work exposures), and optional free text about existing conditions,
        medications and supplements.
      </p>
      <ul>
        <li>They are sent to our server (hosted on Vercel, in the US) only to calculate your results,
          which are then returned to your browser.</li>
        <li><strong>We do not store your answers or results in any database.</strong></li>
        <li>To write parts of your summary, the server may send our AI provider, OpenAI (US), your age,
          biological sex, symptom list, lifestyle ratings and an overall exposure score.{' '}
          <strong>Your free-text conditions, medications and supplements are not sent to OpenAI.</strong></li>
      </ul>
      <p><strong>Technical logs.</strong> Our hosting provider keeps standard technical request logs
        (such as IP address, browser type, time of request and error messages) for a limited time, for
        security and troubleshooting.
      </p>
      <p><strong>Purchase details.</strong> If you buy the kit, you enter your email on our site, which
        passes it to Stripe, and then enter your payment details on Stripe&apos;s checkout page. We
        don&apos;t store your email on our server. Stripe uses it to send your receipt and confirm the
        purchase. We never see or store your full card number. Stripe keeps a record of the
        purchase (email, amount and date), which we can see in our Stripe account and keep as required
        for tax and accounting.
      </p>
      <p><strong>Emails you send us.</strong> If you email support, your message is handled in our
        Google Workspace email. The &quot;Report a problem&quot; button only opens an email in your own
        mail app: it saves nothing on this site and takes no screenshots. Please don&apos;t include
        health details in emails to us.
      </p>
      <p><strong>Our email list (optional).</strong> If you sign up (for example, to get a free
        symptom tracker), we keep your email, your name if you give it, the language you chose and the
        page you signed up on, so we can send you those emails. We use Kit (US) to send them; Kit may
        record whether you open an email or click a link. Your assessment answers are never added to
        this list. You can unsubscribe anytime with the link at the bottom of every email, and ask us
        to delete your details.
      </p>

      <h2>What&apos;s stored in your browser</h2>
      <p>We don&apos;t use advertising cookies, Google Analytics or any other tracking or analytics.
        We only keep these in your own browser:</p>
      <ul>
        <li>Your language preference (a cookie and local storage, about 30 days).</li>
        <li>A note that you finished the guided tour.</li>
        <li>Your answers and results, temporarily, for up to 24 hours, so they survive the trip to Stripe and a
          page refresh. They are deleted automatically the next time you open the site after 24 hours,
          or whenever you clear this site&apos;s data in your browser.</li>
      </ul>
      <p>Fonts load from Google Fonts, which receives your IP address as part of delivering the font
        files.</p>

      <h2>Your PDF</h2>
      <p>
        Your PDF is created entirely in your browser. We don&apos;t keep a copy, so save or print it.
        If you lose it, you would need to retake the assessment. You can also email us about your
        purchase.
      </p>

      <h2>Who we share information with</h2>
      <p>Only the service providers that run the site:</p>
      <ul>
        <li><strong>Vercel</strong>: hosting.</li>
        <li><strong>OpenAI</strong>: AI-written text.</li>
        <li><strong>Stripe</strong>: payments and receipts.</li>
        <li><strong>Kit</strong>: our email list, only if you sign up.</li>
        <li><strong>Google</strong>: Google Workspace email and Google Fonts.</li>
      </ul>
      <p>
        We do not sell your personal information, do not share it for advertising, and do not use your
        health information for advertising. We may disclose information if the law requires it.
      </p>

      <h2>About AI-written text</h2>
      <p>AI-written text can be wrong or incomplete. Check it with your clinician.</p>

      <h2>Consumer health data</h2>
      <p>
        Your answers are &quot;consumer health data&quot; under laws such as Washington&apos;s My Health
        My Data Act and similar laws in Nevada and Connecticut. When you choose to submit your answers
        to get results, you consent to the use described here: calculating your results and sending
        some answers to our AI provider. If you don&apos;t want that, don&apos;t submit the
        questionnaire. You can stop at any time.
      </p>
      <p>
        Signing up for emails about hormone health can also suggest a health interest. So we treat our
        email list with the same care: we use it only to send the emails you asked for, never sell it or
        share it for advertising, and you can withdraw consent by unsubscribing.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to access your information, ask us to delete it, or withdraw your consent. Because
        we don&apos;t store your answers, the only things we usually have are the Stripe purchase record, any emails you sent us and, if you signed up, your details on our email list. Email {email}. We respond within 45 days.
      </p>
      <p>
        If we deny your request, you can appeal by replying to our decision email with
        &quot;Appeal&quot; in the subject line.
      </p>
      <p>
        <strong>California:</strong> we do not sell or share personal information, and you have the same
        rights described above.
      </p>
      <p>
        <strong>EU and UK:</strong> we use your health data based on your consent, and your purchase
        details to fulfil the purchase contract. Your information is processed in the United States.
        You also have the right to complain to your local data protection authority.
      </p>

      <h2>Children</h2>
      <p>
        This site is for adults 18 and older and is not directed at children. If we learn that a minor
        sent us information by email, we delete it.
      </p>

      <h2>Security</h2>
      <p>
        Information is encrypted in transit with HTTPS, and we keep as little as we can. Still, no
        method is 100% secure.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy, we will post the new version here with a new date. If the change is
        material, we will highlight it on the site and, if you are on our email list, email you about
        it.
      </p>

      <h2>Contact</h2>
      <p>Questions? Email {email}.</p>
    </LegalPage>
  );
}
