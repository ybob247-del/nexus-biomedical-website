import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const PrivacyPolicy = () => {
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
              Privacy Policy
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Effective Date: November 23, 2025 | Last Updated: November 23, 2025
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
                Introduction
              </h2>
              <p>
                Nexus Biomedical Intelligence ("we," "our," or "us") operates AI-powered health information and clinical decision support platforms at nexusbiomedical.ai (the "Website" and "Services"). We are committed to protecting your privacy and being transparent about how we collect, use, and protect your information.
              </p>
              <p style={{ marginTop: '1rem' }}>
                This Privacy Policy explains what information we collect, how we use it, how we protect it, and your rights regarding your information. By using our Services, you agree to the practices described in this Privacy Policy.
              </p>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>
                Important: We are an educational technology platform providing health information and decision support tools. We are not healthcare providers, and we do not provide medical diagnosis, treatment, or advice. Always consult qualified healthcare professionals for medical decisions.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Information We Collect
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Account Information
              </h3>
              <p>When you create an account, we collect:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Email address</li>
                <li>Password (encrypted and securely stored)</li>
                <li>Name (optional)</li>
                <li>Professional credentials (for healthcare provider accounts, such as specialty or license type)</li>
                <li>Account preferences and settings</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Health Assessment Data
              </h3>
              <p>When you use our assessment tools, we collect:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Self-reported symptoms and health information</li>
                <li>Medication lists and drug interaction queries</li>
                <li>Assessment responses and quiz answers</li>
                <li>Risk scores and assessment results</li>
                <li>Usage history within the platforms</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Technical Information
              </h3>
              <p>We automatically collect:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device information (type, operating system)</li>
                <li>Pages visited and features used</li>
                <li>Date and time of access</li>
                <li>Referring website or source</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Payment Information
              </h3>
              <p>When you subscribe to premium services:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Payment information is processed securely by Stripe, our payment processor</li>
                <li>We do not store complete credit card numbers on our servers</li>
                <li>We receive only transaction confirmations and subscription status from Stripe</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                How We Use Your Information
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                To Provide Our Services
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Deliver personalized health assessments and risk analyses</li>
                <li>Generate reports and recommendations based on your inputs</li>
                <li>Maintain your account and provide customer support</li>
                <li>Process payments and manage subscriptions</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                To Improve Our Services
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Analyze usage patterns to enhance platform functionality</li>
                <li>Develop new features and assessment tools</li>
                <li>Conduct research to improve accuracy and effectiveness</li>
                <li>Test and optimize user experience</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                To Communicate With You
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Send assessment results and reports</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send account-related notifications (password resets, subscription updates)</li>
                <li>Share educational content and platform updates (with your consent)</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                To Ensure Security and Compliance
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Detect and prevent fraud or unauthorized access</li>
                <li>Enforce our Terms of Service</li>
                <li>Comply with legal obligations</li>
                <li>Protect the rights and safety of our users</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                How We Share Your Information
              </h2>
              <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                We do not sell your personal health information to third parties.
              </p>
              <p>We may share your information only in the following limited circumstances:</p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Service Providers
              </h3>
              <p>We share information with trusted third-party service providers who help us operate our Services, including:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Cloud hosting providers (secure data storage)</li>
                <li>Payment processors (Stripe for subscription billing)</li>
                <li>Email service providers (for transactional emails)</li>
                <li>Analytics providers (to understand platform usage)</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>
                These providers are contractually obligated to protect your information and use it only for the purposes we specify.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Legal Requirements
              </h3>
              <p>We may disclose information if required by law, such as:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>In response to valid legal process (subpoena, court order)</li>
                <li>To protect our rights, property, or safety</li>
                <li>To prevent fraud or illegal activity</li>
                <li>To comply with regulatory obligations</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Business Transfers
              </h3>
              <p>
                If we are involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change and any choices you may have.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                With Your Consent
              </h3>
              <p>
                We may share information for other purposes with your explicit consent.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem', background: '#f0f9ff', padding: '2rem', borderRadius: '0.5rem', borderLeft: '4px solid #00A8CC' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                HIPAA and Healthcare Privacy
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Understanding HIPAA
              </h3>
              <p>
                The Health Insurance Portability and Accountability Act (HIPAA) is a federal law that protects the privacy and security of medical information held by <strong>covered entities</strong>. Under HIPAA, covered entities are defined as:
              </p>
              <ol style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Healthcare Providers</strong> who transmit health information electronically in connection with certain transactions (such as billing)</li>
                <li><strong>Health Plans</strong> (insurance companies, HMOs, Medicare, Medicaid)</li>
                <li><strong>Healthcare Clearinghouses</strong> that process health information between providers and payers</li>
              </ol>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Our HIPAA Status
              </h3>
              <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1rem' }}>
                Nexus Biomedical Intelligence is not a HIPAA-covered entity.
              </p>
              <p>We do not fall into any of the three categories defined by HIPAA because:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>We do not provide medical treatment, diagnosis, or prescriptions</li>
                <li>We are not a health insurance plan or payer</li>
                <li>We do not process insurance claims or operate as a clearinghouse</li>
                <li>We do not transmit protected health information (PHI) on behalf of healthcare providers</li>
                <li>We do not access or integrate with electronic health records (EHRs) or medical record systems</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                What This Means for Healthcare Providers
              </h3>
              <p style={{ fontWeight: 600 }}>If you are a healthcare provider using our Services:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Using our platforms <strong>does not create HIPAA liability</strong> for your practice</li>
                <li>You <strong>do not need a Business Associate Agreement (BAA)</strong> with us</li>
                <li>Our Services operate independently of your patient records and do not access PHI from your practice</li>
                <li>We collect only information that users voluntarily enter directly into our assessment tools</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                <strong>Important:</strong> If you choose to enter patient information into our platforms, you are responsible for de-identifying that information and ensuring compliance with your own HIPAA obligations. We recommend using our tools for educational purposes or with anonymized/de-identified data only.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                What This Means for Individual Users
              </h3>
              <p>While HIPAA does not apply to our Services, we are committed to protecting your privacy through:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Industry-standard encryption</strong> for data transmission and storage</li>
                <li><strong>Secure access controls</strong> to prevent unauthorized access</li>
                <li><strong>Regular security audits</strong> and updates</li>
                <li><strong>Strict internal policies</strong> limiting employee access to your data</li>
                <li><strong>No sale of your personal health data</strong> to third parties for marketing purposes</li>
              </ul>

              <p style={{ marginTop: '1.5rem' }}>
                We collect only the information you voluntarily provide through our assessment tools. We do not collect protected health information (PHI) or personally identifiable information (PII) such as:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Patient names or medical record numbers</li>
                <li>Social Security numbers</li>
                <li>Insurance policy numbers</li>
                <li>Medical records from healthcare providers</li>
                <li>Diagnostic codes or treatment records from clinical systems</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Data Security
              </h2>
              <p>We implement appropriate technical and organizational measures to protect your information, including:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Encryption:</strong> All data transmitted between your device and our servers is encrypted using TLS/SSL protocols</li>
                <li><strong>Secure Storage:</strong> Data is stored on secure servers with encryption at rest</li>
                <li><strong>Access Controls:</strong> Strict authentication and authorization controls limit access to your data</li>
                <li><strong>Regular Audits:</strong> We conduct security assessments and vulnerability testing</li>
                <li><strong>Employee Training:</strong> Our team is trained on data protection and privacy best practices</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                However, no method of transmission or storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Your Privacy Rights
              </h2>
              <p>You have the following rights regarding your information:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Access:</strong> You can request a copy of the personal information we hold about you</li>
                <li><strong>Correction:</strong> You can update or correct inaccurate information through your account settings or by contacting us</li>
                <li><strong>Deletion:</strong> You can request deletion of your account and associated data (we may retain certain information as required by law or for legitimate business purposes)</li>
                <li><strong>Export:</strong> You can request a copy of your assessment data in a portable format</li>
                <li><strong>Opt-Out:</strong> You can opt out of marketing communications at any time by using the unsubscribe link in emails or updating your account preferences</li>
                <li><strong>Do Not Sell:</strong> We do not sell your personal information. If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA)</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                To exercise any of these rights, please contact us at <strong>support@nexusbiomedical.ai</strong>
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Data Retention
              </h2>
              <p>
                We retain your information for as long as your account is active or as needed to provide you Services. If you request deletion of your account, we will delete or anonymize your information within 90 days, except where we are required to retain it for legal, regulatory, or legitimate business purposes (such as resolving disputes or enforcing agreements).
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Children's Privacy
              </h2>
              <p>
                Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child under 18, we will take steps to delete that information promptly.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                International Users
              </h2>
              <p>
                Our Services are operated in the United States. If you access our Services from outside the United States, your information will be transferred to, stored, and processed in the United States. By using our Services, you consent to this transfer and processing.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Posting the updated Privacy Policy on our Website with a new "Last Updated" date</li>
                <li>Sending an email notification to your registered email address (for significant changes)</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                Your continued use of our Services after changes become effective constitutes your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Contact Us
              </h2>
              <p>If you have questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us:</p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1rem',
                borderLeft: '4px solid #00A8CC'
              }}>
                <p><strong>Email:</strong> <a href="mailto:support@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>support@nexusbiomedical.ai</a></p>
                <p><strong>Website:</strong> <a href="https://nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>nexusbiomedical.ai</a></p>
                <p style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  We will respond to your inquiry within 30 days.
                </p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
