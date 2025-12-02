import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function About() {
  const { t } = useTranslation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      <Header />
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '8rem 2rem 4rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          marginBottom: '4rem'
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60A5FA 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}>
            {t('about.title')}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            {t('about.subtitle')}
          </p>
        </div>

        {/* Mission Section */}
        <section style={{
          background: 'rgba(10, 27, 61, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '3rem',
          border: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#60A5FA',
            marginBottom: '1.5rem'
          }}>
            {t('about.mission')}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1rem'
          }}>
            {t('about.missionText')}
          </p>
        </section>

        {/* Our Story Section */}
        <section style={{
          background: 'rgba(10, 27, 61, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '3rem',
          border: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#60A5FA',
            marginBottom: '1.5rem'
          }}>
            {t('about.story')}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1rem'
          }}>
            {t('about.storyText1')}
          </p>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1rem'
          }}>
            {t('about.storyText2')}
          </p>
        </section>

        {/* What We Do Section */}
        <section style={{
          background: 'rgba(10, 27, 61, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '3rem',
          border: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#60A5FA',
            marginBottom: '1.5rem'
          }}>
            {t('about.whatWeDo')}
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1.5rem'
          }}>
            {t('about.whatWeDoText')}
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { title: 'RxGuard™', key: 'rxguard' },
              { title: 'ReguReady™', key: 'reguready' },
              { title: 'ClinicalIQ™', key: 'clinicaliq' },
              { title: 'ElderWatch™', key: 'elderwatch' },
              { title: 'PediCalc Pro™', key: 'pedicalc' },
              { title: 'SkinScan Pro™', key: 'skinscan' },
              { title: 'EndoGuard™', key: 'endoguard' }
            ].map((platform, index) => (
              <div key={index} style={{
                background: 'rgba(96, 165, 250, 0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(96, 165, 250, 0.2)'
              }}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#00A8CC',
                  marginBottom: '0.75rem'
                }}>
                  {platform.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#B8D4E8',
                  lineHeight: 1.6
                }}>
                  {t(`about.platforms.${platform.key}`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values Section */}
        <section style={{
          background: 'rgba(10, 27, 61, 0.6)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '3rem',
          marginBottom: '3rem',
          border: '1px solid rgba(96, 165, 250, 0.2)'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#60A5FA',
            marginBottom: '1.5rem'
          }}>
            {t('about.values')}
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { key: 'transparency' },
              { key: 'safety' },
              { key: 'clinician' },
              { key: 'privacy' }
            ].map((value, index) => (
              <div key={index}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#00A8CC',
                  marginBottom: '0.75rem'
                }}>
                  {t(`about.valuesItems.${value.key}.title`)}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#B8D4E8',
                  lineHeight: 1.6
                }}>
                  {t(`about.valuesItems.${value.key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  )
}
