import { useTranslation } from 'react-i18next';
import { buildAppointmentKit } from '../utils/appointmentKit';
import '../styles/appointment-kit.css';

/**
 * The Appointment Prep Kit on screen, for buyers who have unlocked it. Same
 * content as the PDF (both come from buildAppointmentKit), so what they see is
 * what they print.
 */
export default function AppointmentKitView({ results }) {
  const { i18n } = useTranslation();
  const kit = buildAppointmentKit(results, i18n.language);
  const c = kit.copy;

  return (
    <div className="nii-kit">
      <section className="nii-kit-card">
        <h2>{c.title}</h2>
        {kit.about.length > 0 && (
          <dl className="nii-kit-about">
            {kit.about.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        )}

        <h3>{c.noticing}</h3>
        {kit.symptomGroups.length ? (
          <div className="nii-kit-groups">
            {kit.symptomGroups.map((g) => (
              <div key={g.system} className="nii-kit-group">
                <h4>{g.title}</h4>
                <ul>
                  {g.items.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>{c.noSymptoms}</p>
        )}
      </section>

      {kit.raiseFirst.length > 0 && (
        <section className="nii-kit-card">
          <h3>{c.raiseFirst}</h3>
          <p className="nii-kit-intro">{c.raiseFirstIntro}</p>
          <ol className="nii-kit-ranked">
            {kit.raiseFirst.map((item) => (
              <li key={item.title}>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {kit.opener && (
        <section className="nii-kit-card">
          <h3>{c.opener}</h3>
          <p className="nii-kit-intro">{c.openerIntro}</p>
          <blockquote className="nii-kit-opener">{kit.opener}</blockquote>
        </section>
      )}

      <section className="nii-kit-card">
        <h3>{c.questions}</h3>
        <p className="nii-kit-intro">{c.questionsIntro}</p>
        <ul className="nii-kit-questions">
          {kit.questions.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ul>

        {kit.tests.length > 0 && (
          <>
            <h3>{c.tests}</h3>
            <p className="nii-kit-intro">{c.testsIntro}</p>
            <ul className="nii-kit-questions">
              {kit.tests.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      {kit.understanding.length > 0 && (
        <section className="nii-kit-card">
          <h3>{c.understanding}</h3>
          <p className="nii-kit-intro">{c.understandingIntro}</p>
          <div className="nii-kit-understanding">
            {kit.understanding.map((u) => (
              <article key={u.title}>
                <h4>{u.title}</h4>
                <p>{u.why}</p>
                {u.source && (
                  <a href={u.source.url} target="_blank" rel="noopener noreferrer">
                    {c.source}: {u.source.name}
                  </a>
                )}
                {u.more && (
                  <>
                    <br />
                    <a href={u.more.url} target="_blank" rel="noopener noreferrer">
                      {c.moreInfo}: {u.more.name}
                    </a>
                  </>
                )}
              </article>
            ))}
          </div>
          {kit.glossary.length > 0 && (
            <>
              <h3>{c.glossary}</h3>
              <dl className="nii-kit-listed">
                {kit.glossary.map((g) => (
                  <div key={g.term}>
                    <dt>{g.term}</dt>
                    <dd>{g.text}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </section>
      )}

      <section className="nii-kit-card">
        <h3>{c.bring}</h3>
        <ul>
          {c.bringItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>{c.rushed}</h3>
        <ul>
          {c.rushedItems.map((item) => (
            <li key={item}>&ldquo;{item}&rdquo;</li>
          ))}
        </ul>
        <div className="nii-kit-urgent">
          <h4>{c.urgent}</h4>
          <ul>
            {c.urgentItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="nii-kit-card">
        <h3>{c.exposures}</h3>
        {kit.exposures.length ? (
          <ul>
            {kit.exposures.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        ) : (
          <p>{c.noExposures}</p>
        )}

        <h3>{c.meds}</h3>
        <dl className="nii-kit-listed">
          {[
            [c.conditions, kit.listed.conditions],
            [c.medications, kit.listed.medications],
            [c.supplements, kit.listed.supplements],
          ].map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd className={v ? '' : 'nii-kit-none'}>{v || c.none}</dd>
            </div>
          ))}
        </dl>
        <p className="nii-kit-intro">{c.logOnPdf}</p>
      </section>
    </div>
  );
}
