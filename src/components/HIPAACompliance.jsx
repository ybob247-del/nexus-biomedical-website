import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const HIPAACompliance = () => {
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
              Security & Privacy
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              How We Protect Your Information
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
            
            {/* Important Notice */}
            <section style={{ marginBottom: '2.5rem', background: '#f0f9ff', padding: '2rem', borderRadius: '0.5rem', borderLeft: '4px solid #00A8CC' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Understanding HIPAA and Our Services
              </h2>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
                Nexus Biomedical Intelligence is not a HIPAA-covered entity.
              </p>
              <p>
                The Health Insurance Portability and Accountability Act (HIPAA) applies to three types of organizations:
              </p>
              <ol style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Healthcare Providers</strong> who transmit health information electronically in connection with certain transactions (such as billing)</li>
                <li><strong>Health Plans</strong> (insurance companies, HMOs, Medicare, Medicaid)</li>
                <li><strong>Healthcare Clearinghouses</strong> that process health information between providers and payers</li>
              </ol>
              <p style={{ marginTop: '1rem' }}>
                We do not fall into any of these categories. We are an <strong>educational technology platform</strong> providing health information and clinical decision support tools. We do not provide medical treatment, process insurance claims, or operate as a healthcare clearinghouse.
              </p>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>
                This means healthcare providers using our Services do not need a Business Associate Agreement (BAA) with us, and using our platforms does not create HIPAA liability for their practices.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Our Commitment to Security
              </h2>
              <p>
                While HIPAA does not apply to our Services, we take data security and privacy seriously. We implement industry-standard security measures to protect your information:
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Data Encryption
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Encryption in Transit
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>TLS/SSL Encryption:</strong> All data transmitted between your device and our servers is encrypted using industry-standard TLS (Transport Layer Security) protocols</li>
                <li><strong>HTTPS Everywhere:</strong> All pages and API endpoints use HTTPS to prevent interception of data</li>
                <li><strong>Secure Connections:</strong> We enforce secure connections and reject unencrypted requests</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Encryption at Rest
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Database Encryption:</strong> Your data is stored in encrypted databases</li>
                <li><strong>Secure Cloud Storage:</strong> We use enterprise-grade cloud providers with built-in encryption</li>
                <li><strong>Password Protection:</strong> Passwords are hashed using industry-standard algorithms (never stored in plain text)</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Access Controls
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                User Authentication
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Secure Login:</strong> Account access requires email verification and password authentication</li>
                <li><strong>Session Management:</strong> Automatic session timeouts to prevent unauthorized access</li>
                <li><strong>Password Requirements:</strong> Strong password policies to protect accounts</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Internal Access Controls
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Principle of Least Privilege:</strong> Team members have access only to data necessary for their roles</li>
                <li><strong>Audit Logging:</strong> We log access to systems for security monitoring</li>
                <li><strong>Regular Reviews:</strong> Periodic review of access permissions</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Application Security
              </h2>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Secure Development Practices:</strong> Following OWASP (Open Web Application Security Project) best practices</li>
                <li><strong>Input Validation:</strong> Protection against SQL injection, cross-site scripting (XSS), and other common attacks</li>
                <li><strong>Regular Updates:</strong> Keeping software dependencies and frameworks up to date with security patches</li>
                <li><strong>Vulnerability Scanning:</strong> Regular security assessments to identify and address potential vulnerabilities</li>
                <li><strong>Secure Code Reviews:</strong> Code is reviewed for security issues before deployment</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Infrastructure Security
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Cloud Infrastructure
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Enterprise Cloud Providers:</strong> Hosted on secure, reliable cloud infrastructure (Vercel, Neon)</li>
                <li><strong>Redundancy and Backup:</strong> Regular backups to prevent data loss</li>
                <li><strong>DDoS Protection:</strong> Protection against distributed denial-of-service attacks</li>
                <li><strong>Network Security:</strong> Firewalls and network segmentation to protect systems</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Monitoring and Incident Response
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Security Monitoring:</strong> Continuous monitoring for suspicious activity</li>
                <li><strong>Incident Response Plan:</strong> Procedures for responding to security incidents</li>
                <li><strong>Error Logging:</strong> Comprehensive logging for troubleshooting and security analysis</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Data Privacy Practices
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                What We Collect
              </h3>
              <p>We collect only information necessary to provide our Services:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Email address and account credentials</li>
                <li>Self-reported health information you voluntarily enter into assessment tools</li>
                <li>Medication names for interaction checking</li>
                <li>Assessment responses and results</li>
                <li>Technical information (IP address, browser type, device information)</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                What We DON'T Collect
              </h3>
              <p>We do not collect protected health information (PHI) or personally identifiable information (PII) such as:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Patient names or medical record numbers</li>
                <li>Social Security numbers</li>
                <li>Insurance policy numbers</li>
                <li>Medical records from healthcare providers</li>
                <li>Diagnostic codes or treatment records from clinical systems</li>
                <li>Electronic health record (EHR) data</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                How We Use Your Data
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Service Delivery:</strong> To provide personalized assessments and recommendations</li>
                <li><strong>Account Management:</strong> To maintain your account and provide customer support</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our platforms</li>
                <li><strong>Communication:</strong> To send assessment results and account-related notifications</li>
              </ul>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>
                We do not sell your personal health information to third parties.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Third-Party Services
              </h2>
              <p>We use carefully selected third-party service providers to help operate our Services:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Stripe:</strong> Payment processing (PCI DSS compliant)</li>
                <li><strong>Vercel:</strong> Web hosting and content delivery</li>
                <li><strong>Neon:</strong> Database hosting</li>
                <li><strong>OpenAI:</strong> AI model services for assessment generation</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                These providers are contractually obligated to protect your information and use it only for the purposes we specify. We share only the minimum information necessary for them to provide their services.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Your Rights and Controls
              </h2>
              <p>You have control over your information:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Access:</strong> Request a copy of your data at any time</li>
                <li><strong>Correction:</strong> Update or correct your information through your account settings</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data (subject to legal retention requirements)</li>
                <li><strong>Export:</strong> Download your assessment data in a portable format</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                To exercise these rights, contact us at <strong>support@nexusbiomedical.ai</strong>
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Limitations and Disclaimers
              </h2>
              <p style={{ fontStyle: 'italic' }}>
                While we implement strong security measures, no method of transmission or storage is 100% secure. We cannot guarantee absolute security against all possible threats.
              </p>
              <p style={{ marginTop: '1rem' }}>
                You are responsible for:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>Using strong, unique passwords</li>
                <li>Notifying us immediately of any unauthorized access</li>
                <li>Ensuring compliance with your own legal obligations when using our Services</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Compliance with Other Laws
              </h2>
              <p>While we are not subject to HIPAA, we comply with other applicable laws and regulations:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>GDPR:</strong> General Data Protection Regulation (for EU users)</li>
                <li><strong>CCPA:</strong> California Consumer Privacy Act (for California residents)</li>
                <li><strong>PCI DSS:</strong> Payment Card Industry Data Security Standard (through Stripe)</li>
                <li><strong>CAN-SPAM:</strong> Controlling the Assault of Non-Solicited Pornography And Marketing Act (for email communications)</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Questions About Security
              </h2>
              <p>
                If you have questions or concerns about our security practices, or if you need to report a security issue, please contact us:
              </p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1rem',
                borderLeft: '4px solid #00A8CC'
              }}>
                <p><strong>Email:</strong> <a href="mailto:support@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>support@nexusbiomedical.ai</a></p>
                <p><strong>Website:</strong> <a href="https://nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>nexusbiomedical.ai</a></p>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  For security-related issues, please include "SECURITY" in your email subject line.
                </p>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Additional Resources
              </h2>
              <p>For more information about how we handle your data:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><a href="/privacy" style={{ color: '#00A8CC', textDecoration: 'none' }}>Privacy Policy</a> - Complete details on data collection and use</li>
                <li><a href="/terms" style={{ color: '#00A8CC', textDecoration: 'none' }}>Terms of Service</a> - Legal terms governing use of our Services</li>
              </ul>
            </section>

            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f0fdf4', borderRadius: '0.5rem', borderLeft: '4px solid #22c55e' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>🔒 Our Commitment</p>
              <p style={{ fontSize: '0.9rem' }}>
                We are committed to continuously improving our security practices and protecting your information. This page is updated regularly to reflect our current security measures.
              </p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Last Updated: November 23, 2025
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HIPAACompliance
