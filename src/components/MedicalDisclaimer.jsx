import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const MedicalDisclaimer = () => {
  const navigate = useNavigate()

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', minHeight: '100vh', padding: '2rem 0' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div style={{ marginBottom: '3rem' }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 500
              }}
            >
              ← Back to Home
            </button>
            <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '1rem', color: 'white' }}>
              Medical Disclaimer
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Important Information About Our Services
            </p>
          </div>

          {/* Content */}
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.95)', 
            borderRadius: '1rem', 
            padding: '3rem',
            color: '#1e293b',
            lineHeight: 1.8
          }}>
            
            <section style={{ marginBottom: '2.5rem', background: '#fef2f2', padding: '2rem', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#991b1b' }}>
                Not Medical Advice
              </h2>
              <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                The information and tools provided by Nexus Biomedical Intelligence are intended for informational, educational, and decision-support purposes only.
              </p>
              <p>You acknowledge and agree that:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Our Services do NOT provide medical diagnoses, treatment, or prescriptions.</li>
                <li>Our Services are NOT a substitute for professional medical advice or licensed clinician judgment.</li>
                <li>You should always consult qualified healthcare professionals for medical advice and treatment decisions.</li>
                <li>You should not disregard professional medical advice or delay seeking it because of information obtained from our Services.</li>
                <li>In case of a medical emergency, call emergency services immediately (e.g., 911 in the United States).</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                For Healthcare Professionals
              </h2>
              <p>
                If you are a healthcare professional using our platforms:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Our tools are designed to supplement, but NOT replace, your professional medical judgment.</li>
                <li>Clinical decisions remain your sole responsibility.</li>
                <li>You must independently verify any information or recommendations provided by our Services before applying them in a clinical setting.</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                No Warranties
              </h2>
              <p>
                While we strive to provide accurate and up-to-date information, medical knowledge evolves rapidly. We make no warranties or representations regarding the accuracy, completeness, or timeliness of the information provided through our Services. We are not responsible for any medical outcomes or decisions based on information from our platforms.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Contact Us
              </h2>
              <p>If you have questions about this disclaimer, please contact us:</p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1rem',
                borderLeft: '4px solid #00A8CC'
              }}>
                <p><strong>Email:</strong> <a href="mailto:support@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>support@nexusbiomedical.ai</a></p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MedicalDisclaimer
