import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function WhoBenefits() {
  const { t } = useTranslation()

  const beneficiaries = [
    {
      icon: '🏥',
      titleKey: 'whoBenefits.smallClinics.title',
      descKey: 'whoBenefits.smallClinics.description',
      benefitKeys: ['whoBenefits.smallClinics.benefit1', 'whoBenefits.smallClinics.benefit2', 'whoBenefits.smallClinics.benefit3']
    },
    {
      icon: '🏢',
      titleKey: 'whoBenefits.hospitals.title',
      descKey: 'whoBenefits.hospitals.description',
      benefitKeys: ['whoBenefits.hospitals.benefit1', 'whoBenefits.hospitals.benefit2', 'whoBenefits.hospitals.benefit3']
    },
    {
      icon: '🛡️',
      titleKey: 'whoBenefits.insurance.title',
      descKey: 'whoBenefits.insurance.description',
      benefitKeys: ['whoBenefits.insurance.benefit1', 'whoBenefits.insurance.benefit2', 'whoBenefits.insurance.benefit3']
    },
    {
      icon: '🔬',
      titleKey: 'whoBenefits.medicalDevice.title',
      descKey: 'whoBenefits.medicalDevice.description',
      benefitKeys: ['whoBenefits.medicalDevice.benefit1', 'whoBenefits.medicalDevice.benefit2', 'whoBenefits.medicalDevice.benefit3']
    },
    {
      icon: '💊',
      titleKey: 'whoBenefits.pharma.title',
      descKey: 'whoBenefits.pharma.description',
      benefitKeys: ['whoBenefits.pharma.benefit1', 'whoBenefits.pharma.benefit2', 'whoBenefits.pharma.benefit3']
    },
    {
      icon: '📊',
      titleKey: 'whoBenefits.cro.title',
      descKey: 'whoBenefits.cro.description',
      benefitKeys: ['whoBenefits.cro.benefit1', 'whoBenefits.cro.benefit2', 'whoBenefits.cro.benefit3']
    },
    {
      icon: '🏡',
      titleKey: 'whoBenefits.longTermCare.title',
      descKey: 'whoBenefits.longTermCare.description',
      benefitKeys: ['whoBenefits.longTermCare.benefit1', 'whoBenefits.longTermCare.benefit2', 'whoBenefits.longTermCare.benefit3']
    },
    {
      icon: '📱',
      titleKey: 'whoBenefits.telemedicine.title',
      descKey: 'whoBenefits.telemedicine.description',
      benefitKeys: ['whoBenefits.telemedicine.benefit1', 'whoBenefits.telemedicine.benefit2', 'whoBenefits.telemedicine.benefit3']
    },
    {
      icon: '🧘',
      titleKey: 'whoBenefits.individuals.title',
      descKey: 'whoBenefits.individuals.description',
      benefitKeys: ['whoBenefits.individuals.benefit1', 'whoBenefits.individuals.benefit2', 'whoBenefits.individuals.benefit3']
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
            {t('whoBenefits.title', 'Who Benefits from Nexus?')}
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#B8D4E8',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.8
          }}>
            {t('whoBenefits.subtitle', 'Our AI-powered platforms serve diverse stakeholders across the healthcare ecosystem')}
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
                {t(beneficiary.titleKey)}
              </h3>

              {/* Description */}
              <p style={{
                fontSize: '1rem',
                color: '#FFFFFF',
                lineHeight: 1.7,
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {t(beneficiary.descKey)}
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
                  {t('whoBenefits.keyBenefits', 'Key Benefits:')}
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {beneficiary.benefitKeys.map((benefitKey, i) => (
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
                      {t(benefitKey)}
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
            {t('whoBenefits.cta', 'Ready to see how Nexus can transform your organization?')}
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
            {t('whoBenefits.getStarted', 'Get Started')}
          </button>
        </div>
      </div>
    </section>
  )
}
