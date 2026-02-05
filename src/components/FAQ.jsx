import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/faq.css'

const FAQ = () => {
  const { t } = useTranslation()
  const [openIndex, setOpenIndex] = useState(null)

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Build FAQ array from i18n translations
  const faqs = [
    {
      question: t('faq.q1.question'),
      answer: t('faq.q1.answer')
    },
    {
      question: t('faq.q2.question'),
      answer: t('faq.q2.answer')
    },
    {
      question: t('faq.q3.question'),
      answer: t('faq.q3.answer')
    },
    {
      question: t('faq.q4.question'),
      answer: t('faq.q4.answer')
    },
    {
      question: t('faq.q5.question'),
      answer: t('faq.q5.answer')
    },
    {
      question: t('faq.q6.question'),
      answer: t('faq.q6.answer')
    },
    {
      question: t('faq.q7.question'),
      answer: t('faq.q7.answer')
    },
    {
      question: t('faq.q8.question'),
      answer: t('faq.q8.answer')
    },
    {
      question: t('faq.q9.question'),
      answer: t('faq.q9.answer')
    },
    {
      question: t('faq.q10.question'),
      answer: t('faq.q10.answer')
    }
  ]

  // Generate FAQ schema markup
  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }

    // Create or update script tag for schema
    let scriptTag = document.getElementById('faq-schema')
    if (!scriptTag) {
      scriptTag = document.createElement('script')
      scriptTag.id = 'faq-schema'
      scriptTag.type = 'application/ld+json'
      document.head.appendChild(scriptTag)
    }
    scriptTag.textContent = JSON.stringify(schemaData)

    return () => {
      // Cleanup is optional - schema can persist
    }
  }, [faqs])

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">{t('faq.title')}</h2>
          <p className="faq-subtitle">{t('faq.subtitle')}</p>
        </div>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? 'active' : ''}`}
            >
              <button 
                className="faq-question"
                onClick={() => toggleQuestion(index)}
                aria-expanded={openIndex === index}
              >
                <span className="faq-question-text">{faq.question}</span>
                <svg 
                  className="faq-icon"
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              <div className={`faq-answer ${openIndex === index ? 'open' : ''}`}>
                <div className="faq-answer-content">
                  <p>{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-footer">
          <h3 className="faq-promise-title">{t('faq.promise.title')}</h3>
          <p className="faq-promise-text">
            {t('faq.promise.text')}
          </p>
          <div className="faq-cta-buttons">
            <a href="mailto:support@nexusbiomedical.ai" className="faq-cta-primary">
              {t('faq.cta.contactUs')}
            </a>
            <a href="#platforms" className="faq-cta-secondary">
              {t('faq.cta.explorePlatforms')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ
