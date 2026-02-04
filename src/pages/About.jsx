import React, { useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function About() {
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
            About Nexus Biomedical Intelligence
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            AI-powered healthcare intelligence for clinicians, patients, and organizations
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
            Our Mission
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1rem'
          }}>
            To empower healthcare professionals with intelligent, trustworthy AI tools that enhance clinical decision-making, improve patient safety, and reduce the burden of administrative complexity—without replacing the irreplaceable human element of care.
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
            Our Story
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1rem'
          }}>
            Nexus Biomedical Intelligence was born from a simple observation: healthcare professionals are drowning in data but starving for actionable insights. Every day, clinicians face impossible choices—balancing patient safety, regulatory compliance, and operational efficiency while navigating fragmented systems and information overload.
          </p>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1rem'
          }}>
            We believe AI should amplify human expertise, not replace it. Our platforms are designed by healthcare professionals, for healthcare professionals—combining cutting-edge artificial intelligence with deep domain knowledge to deliver decision support that's transparent, trustworthy, and truly useful.
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
            What We Do
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1.5rem'
          }}>
            We build specialized AI platforms that address the most critical pain points in healthcare:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'EndoGuard™',
                description: 'AI-powered hormone health and environmental wellness platform. Comprehensive EDC (Endocrine Disrupting Chemicals) exposure assessment with personalized recommendations for PCOS, thyroid health, perimenopause, and hormone balance.',
                isLive: true
              },
              {
                title: 'ElderWatch™',
                description: 'Geriatric care optimization and fall risk prevention',
                isLive: false
              },
              {
                title: 'PediCalc Pro™',
                description: 'Pediatric dosing calculations and safety checks',
                isLive: false
              },
              {
                title: 'ClinicalIQ™',
                description: 'Clinical trial design and protocol optimization',
                isLive: false
              },
              {
                title: 'ReguReady™',
                description: 'FDA compliance navigation and regulatory pathway optimization',
                isLive: false
              },
              {
                title: 'SkinScan Pro™',
                description: 'Dermatological assessment and triage support',
                isLive: false
              }
            ].filter(p => p.title !== 'RxGuard™').map((platform, index) => (
              <div key={index} style={{
                background: platform.isLive ? 'rgba(96, 165, 250, 0.15)' : 'rgba(96, 165, 250, 0.1)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: platform.isLive ? '2px solid rgba(96, 165, 250, 0.4)' : '1px solid rgba(96, 165, 250, 0.2)',
                position: 'relative'
              }}>
                {platform.isLive && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)'
                  }}>
                    ✨ LIVE NOW
                  </div>
                )}
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: platform.isLive ? '#60A5FA' : '#00A8CC',
                  marginBottom: '0.75rem',
                  paddingRight: platform.isLive ? '6rem' : '0'
                }}>
                  {platform.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#B8D4E8',
                  lineHeight: 1.6
                }}>
                  {platform.description}
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
            Our Values
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                title: 'Transparency',
                description: 'Every recommendation includes visible context and source data. No black boxes.'
              },
              {
                title: 'Safety First',
                description: 'Patient safety is non-negotiable. Our systems are designed to catch what humans might miss.'
              },
              {
                title: 'Clinician-Centric',
                description: 'We augment expertise, never replace it. You stay in control, always.'
              },
              {
                title: 'Privacy & Security',
                description: 'HIPAA-ready infrastructure. Your data is yours—we never sell, share, or train on it.'
              }
            ].map((value, index) => (
              <div key={index}>
                <h3 style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#00A8CC',
                  marginBottom: '0.75rem'
                }}>
                  {value.title}
                </h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#B8D4E8',
                  lineHeight: 1.6
                }}>
                  {value.description}
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
