import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const HIPAACompliance = () => {
  const navigate = useNavigate()

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
              Security & Compliance
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Building HIPAA-Ready Infrastructure for Healthcare AI
            </p>
          </div>

          {/* Early Access Notice */}
          <div style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', 
            borderRadius: '1rem', 
            padding: '2rem',
            marginBottom: '2rem',
            color: 'white'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              🚀 Early Access Program
            </h2>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6 }}>
              Nexus Biomedical Intelligence is currently in <strong>Early Access</strong> as we work toward full HIPAA compliance certification. 
              Founding members are helping us refine our security workflows and compliance processes before public launch.
            </p>
            <p style={{ fontSize: '1rem', marginTop: '1rem', opacity: 0.9 }}>
              <strong>Important:</strong> During Early Access, our platforms are for demonstration and evaluation purposes only. 
              Do not enter real Protected Health Information (PHI) or Personally Identifiable Information (PII).
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
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Our Commitment to HIPAA Compliance
              </h2>
              <p>
                Nexus Biomedical Intelligence is building <strong>HIPAA-ready infrastructure</strong> designed to meet the requirements 
                of the Health Insurance Portability and Accountability Act (HIPAA) of 1996, including the Privacy Rule, 
                Security Rule, and Breach Notification Rule.
              </p>
              <p style={{ marginTop: '1rem' }}>
                As we develop healthcare AI solutions that will eventually process Protected Health Information (PHI), 
                we are implementing security and privacy controls from day one, following industry best practices and 
                preparing for formal compliance certification.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Current Security Measures
              </h2>
              <p>
                Our Early Access platforms are built on enterprise-grade security infrastructure:
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Data Encryption
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Data in Transit:</strong> TLS 1.3 encryption for all data transmissions</li>
                <li><strong>HTTPS Everywhere:</strong> All connections secured with SSL/TLS certificates</li>
                <li><strong>Secure Cloud Infrastructure:</strong> Hosted on enterprise-grade cloud providers (Vercel, Neon)</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Access Controls
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Authentication:</strong> Secure user authentication system</li>
                <li><strong>Session Management:</strong> Automatic session timeouts for security</li>
                <li><strong>Role-Based Access:</strong> Principle of least privilege in development</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Application Security
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Secure Development:</strong> Following OWASP security best practices</li>
                <li><strong>Input Validation:</strong> Protection against injection attacks</li>
                <li><strong>Regular Updates:</strong> Keeping dependencies and frameworks current</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Compliance Roadmap
              </h2>
              <p>
                As we prepare for full HIPAA compliance, we are actively working on:
              </p>
              <div style={{ 
                background: '#f0f9ff', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1.5rem',
                borderLeft: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1e40af' }}>
                  Planned Compliance Milestones:
                </h3>
                <ul style={{ marginLeft: '1.5rem' }}>
                  <li><strong>Risk Assessment:</strong> Comprehensive security risk analysis</li>
                  <li><strong>Technical Safeguards:</strong> AES-256 encryption at rest, advanced audit logging</li>
                  <li><strong>Administrative Safeguards:</strong> HIPAA training, policies & procedures documentation</li>
                  <li><strong>Physical Safeguards:</strong> Secure facility access controls with cloud providers</li>
                  <li><strong>BAA Preparation:</strong> Business Associate Agreement templates and workflows</li>
                  <li><strong>Third-Party Audits:</strong> SOC 2 Type II certification pursuit</li>
                  <li><strong>Breach Response:</strong> Incident response and breach notification procedures</li>
                </ul>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Early Access Guidelines
              </h2>
              <div style={{ 
                background: '#fef3c7', 
                padding: '1.5rem', 
                borderRadius: '0.5rem',
                borderLeft: '4px solid #f59e0b'
              }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#92400e' }}>
                🚀 Early Access Program Guidelines
              </h3>
              <p style={{ marginBottom: '0.75rem' }}>
                Thank you for helping us build the future of healthcare AI! As an Early Access member, you're part of our journey toward full HIPAA compliance. Here's how to make the most of your experience:
              </p>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li><strong>Test with Sample Data:</strong> Please use fictional, anonymized test scenarios to explore platform capabilities</li>
                <li><strong>Explore & Evaluate:</strong> Try different features, workflows, and use cases to help us refine the experience</li>
                <li><strong>Share Your Feedback:</strong> Your insights are invaluable as we prepare for production launch</li>
                <li><strong>Stay Tuned:</strong> We're actively working toward full compliance certification for real-world clinical use</li>
              </ul>
              <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', fontStyle: 'italic' }}>
                Note: During Early Access, please avoid entering actual Protected Health Information (PHI) or Personally Identifiable Information (PII) as we complete our compliance certification process.
              </p>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Privacy Commitment
              </h2>
              <p>
                Even during Early Access, we take privacy seriously:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>We collect only the minimum data necessary for platform functionality</li>
                <li>We do not sell or share user data with third parties</li>
                <li>We implement industry-standard security practices</li>
                <li>We are transparent about our data handling practices</li>
                <li>We provide clear privacy policies and terms of service</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Infrastructure Partners
              </h2>
              <p>
                We leverage enterprise-grade infrastructure providers who maintain their own compliance certifications:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Vercel:</strong> SOC 2 Type II certified hosting and deployment platform</li>
                <li><strong>Neon:</strong> Serverless Postgres with enterprise security features</li>
                <li><strong>SendGrid:</strong> Email delivery with compliance-ready infrastructure</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#64748b' }}>
                Note: While our infrastructure partners maintain compliance certifications, Nexus Biomedical Intelligence 
                is actively working toward our own independent HIPAA compliance certification.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Timeline to Full Compliance
              </h2>
              <p>
                We are committed to achieving full HIPAA compliance before processing any real Protected Health Information. 
                Our target timeline includes:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Q1 2026:</strong> Complete technical safeguards implementation</li>
                <li><strong>Q2 2026:</strong> Third-party security audit and SOC 2 Type II certification</li>
                <li><strong>Q3 2026:</strong> HIPAA compliance certification and BAA readiness</li>
                <li><strong>Q4 2026:</strong> Full production launch with PHI processing capabilities</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#64748b' }}>
                Timeline subject to change based on audit results and regulatory requirements.
              </p>
            </section>

            <section style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Questions or Concerns?
              </h2>
              <p>
                If you have questions about our security practices, compliance roadmap, or Early Access program, 
                please contact us:
              </p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1.5rem'
              }}>
                <p style={{ margin: 0 }}>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:support@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>
                    support@nexusbiomedical.ai
                  </a>
                </p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                  We typically respond within 1-2 business days
                </p>
              </div>
            </section>

            <div style={{ 
              background: '#f0fdf4', 
              padding: '1.5rem', 
              borderRadius: '0.5rem',
              borderLeft: '4px solid #22c55e',
              marginTop: '2rem'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#166534' }}>
                <strong>Last Updated:</strong> November 18, 2025<br />
                <strong>Status:</strong> Early Access Program - Actively pursuing HIPAA compliance certification
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HIPAACompliance
