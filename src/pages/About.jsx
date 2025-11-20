import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function About() {
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
            Transforming healthcare through AI-powered decision support that puts clinicians first
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
                title: 'RxGuard™',
                description: 'Real-time medication interaction detection and polypharmacy risk assessment'
              },
              {
                title: 'ReguReady™',
                description: 'FDA compliance navigation and regulatory pathway optimization'
              },
              {
                title: 'ClinicalIQ™',
                description: 'Clinical trial design and protocol optimization'
              },
              {
                title: 'ElderWatch™',
                description: 'Geriatric care optimization and fall risk prevention'
              },
              {
                title: 'PediCalc Pro™',
                description: 'Pediatric dosing calculations and safety checks'
              },
              {
                title: 'SkinScan Pro™',
                description: 'Dermatological assessment and triage support'
              },
              {
                title: 'EndoGuard™',
                description: 'Environmental health and hormone wellness platform with EDC exposure assessment'
              }
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

        {/* Beta Status Section */}
        <section style={{
          background: 'rgba(255, 193, 7, 0.1)',
          border: '2px solid #FFC107',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#FFC107',
            marginBottom: '1rem'
          }}>
            We're Currently in Beta
          </h2>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            lineHeight: 1.8,
            marginBottom: '1.5rem',
            maxWidth: '800px',
            margin: '0 auto 1.5rem'
          }}>
            We're working closely with early adopters to refine our platforms before full production launch. Interested in being part of our beta program?
          </p>
          <button
            onClick={() => window.location.href = '/platforms'}
            style={{
              background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
              color: 'white',
              border: 'none',
              padding: '1rem 2.5rem',
              borderRadius: '50px',
              fontSize: '1.125rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(96, 165, 250, 0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(96, 165, 250, 0.4)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(96, 165, 250, 0.3)'
            }}
          >
            Get Started
          </button>
        </section>
      </div>

      <Footer />
    </div>
  )
}
