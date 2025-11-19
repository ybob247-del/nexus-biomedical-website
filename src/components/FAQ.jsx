import { useState } from 'react'
import '../styles/faq.css'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "Will AI replace doctors, pharmacists, or clinicians?",
      answer: "No. AI can't replace clinical judgment, empathy, or human experience—and it shouldn't. Nexus platforms are designed to amplify professionals, not replace them. Our systems automate repetitive checks, cross-reference thousands of data points instantly, and surface insights—but the final decision always belongs to you."
    },
    {
      question: "What if the AI gets it wrong—who's responsible?",
      answer: "You are always in control. Nexus tools are decision support systems, not decision makers. They flag potential issues and recommend actions, but every recommendation includes visible context, source data, and your ability to override or verify it. Our goal is to make you faster and safer, not to take control away."
    },
    {
      question: "How do I know my patient data is safe?",
      answer: "We take data security and compliance as seriously as you do. All Nexus platforms are built HIPAA-ready with end-to-end encryption and operate within secure, isolated environments. We never sell, share, or train on your private data. You retain full ownership and control—always."
    },
    {
      question: "I'm not tech-savvy. Will this make my job harder?",
      answer: "Absolutely not. Our design philosophy is \"clarity over complexity.\" Every interface is intuitive, clean, and built with clinical workflows in mind. If you can use your EHR, you can use Nexus. Most users master our platforms within a few hours—not weeks."
    },
    {
      question: "What if leadership uses AI to cut staff?",
      answer: "Nexus tools are built to reduce burnout, not replace people. Teams that use AI effectively experience fewer medication errors, lower liability, and higher retention. AI creates breathing room for humans to do what they do best—think, listen, and care."
    },
    {
      question: "How transparent is the AI? Can I see how it reaches conclusions?",
      answer: "Yes. Every decision in Nexus comes with an explanation layer. You'll see which data sources, evidence levels, and logic paths were used. No \"black boxes.\" Just transparent, verifiable reasoning you can trust and audit."
    },
    {
      question: "What about regulatory approval—are these systems cleared?",
      answer: "Nexus operates under the framework of Clinical Decision Support (CDS) tools—meaning we empower clinicians without automating clinical judgment. Our ReguReady™ platform helps streamline compliance, and every Nexus module is designed with FDA, ISO, and CE standards in mind."
    },
    {
      question: "How does Nexus integrate with existing systems?",
      answer: "Seamlessly. Nexus connects to leading EHR, pharmacy, and laboratory platforms through secure APIs and FHIR-based interoperability. Whether you use Epic, Cerner, or custom software, integration is fast, secure, and IT-approved."
    },
    {
      question: "Is AI expensive to implement?",
      answer: "It doesn't have to be. Nexus was built to democratize access to healthcare innovation—not gatekeep it. Our tiered pricing model ranges from small-practice subscriptions to enterprise packages, so clinics of any size can start safely and scale sustainably."
    },
    {
      question: "What happens to empathy when machines enter healthcare?",
      answer: "Empathy grows. When technology handles the repetitive tasks, clinicians can spend more time with their patients—listening, connecting, and caring. AI should never replace compassion; it should give you the time and clarity to express it fully."
    }
  ]

  return (
    <section className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Honest Answers to Hard Questions</h2>
          <p className="faq-subtitle">Because real change starts with real conversations.</p>
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
          <h3 className="faq-promise-title">Our Promise</h3>
          <p className="faq-promise-text">
            Nexus Biomedical Intelligence exists to make healthcare safer, simpler, and more human.
            <br />
            We believe transparency builds trust—and trust saves lives.
          </p>
          <div className="faq-cta-buttons">
            <a href="mailto:support@nexusbiomedical.ai" className="faq-cta-primary">
              Contact Us
            </a>
            <a href="#platforms" className="faq-cta-secondary">
              Explore Platforms
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ

