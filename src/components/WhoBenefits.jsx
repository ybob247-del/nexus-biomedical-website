import React from 'react'
import { motion } from 'framer-motion'

export default function WhoBenefits() {
  const beneficiaries = [
    {
      icon: '🏥',
      title: 'Small Clinics & Private Practices',
      description: 'Access enterprise-grade clinical decision support without enterprise costs. Reduce medical errors, streamline workflows, and compete with larger systems.',
      benefits: ['Affordable AI tools', 'Reduced liability risk', 'Better patient outcomes']
    },
    {
      icon: '🏢',
      title: 'Hospitals & Health Systems',
      description: 'Scale clinical excellence across all departments. Standardize care protocols, reduce adverse events, and improve quality metrics while cutting administrative burden.',
      benefits: ['System-wide standardization', 'Quality metric improvement', 'Cost reduction']
    },
    {
      icon: '🛡️',
      title: 'Insurance Companies & Payers',
      description: 'Reduce claims costs through proactive risk identification. Prevent adverse drug events, hospital readmissions, and medication errors before they happen.',
      benefits: ['Lower claims costs', 'Risk prevention', 'Member safety']
    },
    {
      icon: '🔬',
      title: 'Medical Device Manufacturers',
      description: 'Navigate FDA pathways faster with ReguReady™. Reduce regulatory delays, optimize compliance strategies, and accelerate time-to-market.',
      benefits: ['Faster FDA approval', 'Compliance optimization', 'Reduced regulatory costs']
    },
    {
      icon: '💊',
      title: 'Pharmaceutical Companies',
      description: 'Optimize clinical trial design and drug safety monitoring. Identify interaction risks early, improve trial enrollment, and strengthen post-market surveillance.',
      benefits: ['Better trial design', 'Drug safety insights', 'Faster development']
    },
    {
      icon: '📊',
      title: 'Clinical Research Organizations',
      description: 'Design better trials with ClinicalIQ™. Improve protocol feasibility, optimize patient selection, and reduce trial failures through AI-powered insights.',
      benefits: ['Protocol optimization', 'Patient recruitment', 'Trial success rates']
    },
    {
      icon: '🏡',
      title: 'Long-Term Care Facilities',
      description: 'Protect vulnerable populations with ElderWatch™. Prevent falls, optimize geriatric medication management, and improve quality of life for residents.',
      benefits: ['Fall prevention', 'Medication safety', 'Quality improvement']
    },
    {
      icon: '📱',
      title: 'Telemedicine Providers',
      description: 'Deliver safer remote care with real-time clinical decision support. Screen for drug interactions, assess pediatric dosing, and triage dermatological concerns confidently.',
      benefits: ['Remote safety checks', 'Confident prescribing', 'Better triage']
    }
  ]

  return (
    <section id="who-benefits" style={{
      padding: '6rem 2rem',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #60A5FA 0%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}>
            Who Benefits from Nexus?
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            Our AI-powered platforms serve diverse stakeholders across the healthcare ecosystem
          </p>
        </div>

        {/* Beneficiary Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}>
          {beneficiaries.map((beneficiary, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                background: 'rgba(10, 27, 61, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(96, 165, 250, 0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              whileHover={{
                scale: 1.02,
                borderColor: 'rgba(96, 165, 250, 0.5)',
                boxShadow: '0 10px 40px rgba(96, 165, 250, 0.2)'
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {beneficiary.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#60A5FA',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {beneficiary.title}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '1rem',
                color: '#FFFFFF',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {beneficiary.description}
              </p>

              {/* Benefits List */}
              <div style={{
                borderTop: '1px solid rgba(96, 165, 250, 0.2)',
                paddingTop: '1rem'
              }}>
                <p style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#00A8CC',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Key Benefits:
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {beneficiary.benefits.map((benefit, i) => (
                    <li key={i} style={{
                      fontSize: '0.95rem',
                      color: '#B8D4E8',
                      marginBottom: '0.5rem',
                      paddingLeft: '1.5rem',
                      position: 'relative'
                    }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#00A8CC'
                      }}>✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <div style={{
          textAlign: 'center',
          marginTop: '4rem'
        }}>
          <p style={{
            fontSize: '1.125rem',
            color: '#FFFFFF',
            marginBottom: '2rem'
          }}>
            Ready to see how Nexus can transform your organization?
          </p>
          <button
            onClick={() => window.location.href = '/beta-signup'}
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
            Request Beta Access
          </button>
        </div>
      </div>
    </section>
  )
}
