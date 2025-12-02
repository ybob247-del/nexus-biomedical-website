import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../styles/faq.css'

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null)

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = t('faq.questions', { returnObjects: true });

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
              {t('faq.promise.contactUs')}
            </a>
            <a href="#platforms" className="faq-cta-secondary">
              {t('faq.promise.explorePlatforms')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ

