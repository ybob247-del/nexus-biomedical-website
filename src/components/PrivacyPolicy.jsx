import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const PrivacyPolicy = () => {
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
              Privacy Policy
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Last Updated: November 17, 2024
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
                1. Introduction
              </h2>
              <p>
                Nexus Biomedical Intelligence ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when 
                you use our healthcare AI platform and services.
              </p>
              <p style={{ marginTop: '1rem' }}>
                By accessing or using our services, you agree to this Privacy Policy. If you do not agree with 
                the terms of this Privacy Policy, please do not access our services.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                2. Information We Collect
              </h2>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                2.1 Personal Information
              </h3>
              <p>We may collect the following types of personal information:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Name, email address, and contact information</li>
                <li>Professional credentials and healthcare provider information</li>
                <li>Account credentials and authentication data</li>
                <li>Billing and payment information</li>
                <li>Usage data and platform interactions</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                2.2 Protected Health Information (PHI)
              </h3>
              <p>
                When you use our clinical tools, we may process Protected Health Information (PHI) as defined 
                under HIPAA. We act as a Business Associate and handle all PHI in compliance with HIPAA regulations.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                2.3 Technical Information
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Access times and referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                3. How We Use Your Information
              </h2>
              <p>We use collected information for the following purposes:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Provide, operate, and maintain our healthcare AI services</li>
                <li>Process clinical data and generate medical insights</li>
                <li>Improve, personalize, and expand our services</li>
                <li>Communicate with you about updates, support, and marketing</li>
                <li>Process transactions and manage billing</li>
                <li>Ensure compliance with healthcare regulations</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Analyze usage patterns to improve platform performance</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                4. HIPAA Compliance
              </h2>
              <p>
                Nexus Biomedical Intelligence is committed to full compliance with the Health Insurance Portability 
                and Accountability Act (HIPAA) and its implementing regulations.
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>We execute Business Associate Agreements (BAAs) with covered entities</li>
                <li>All PHI is encrypted in transit and at rest using industry-standard encryption</li>
                <li>Access to PHI is restricted to authorized personnel only</li>
                <li>We maintain comprehensive audit logs of all PHI access</li>
                <li>Regular security assessments and risk analyses are conducted</li>
                <li>Staff receive ongoing HIPAA training and certification</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                5. Data Security
              </h2>
              <p>
                We implement administrative, technical, and physical security measures designed to protect your 
                information from unauthorized access, use, or disclosure:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>AES-256 encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Multi-factor authentication (MFA) for account access</li>
                <li>Regular security audits and penetration testing</li>
                <li>Secure cloud infrastructure with redundancy and backup</li>
                <li>Role-based access controls (RBAC)</li>
                <li>24/7 security monitoring and incident response</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                6. Data Sharing and Disclosure
              </h2>
              <p>We do not sell your personal information. We may share information in the following circumstances:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>With Your Consent:</strong> When you explicitly authorize us to share information</li>
                <li><strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our platform (under strict confidentiality agreements)</li>
                <li><strong>Legal Compliance:</strong> When required by law, regulation, or legal process</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                7. Data Retention
              </h2>
              <p>
                We retain your information for as long as necessary to provide our services and comply with legal 
                obligations. PHI is retained according to HIPAA requirements and applicable state laws, typically 
                for a minimum of 6 years from the date of creation or last use.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                8. Your Rights
              </h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your information (subject to legal requirements)</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-Out:</strong> Opt out of marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                To exercise these rights, please contact us at <strong>support@nexusbiomedical.ai</strong>
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                9. Cookies and Tracking Technologies
              </h2>
              <p>
                We use cookies and similar tracking technologies to enhance your experience. You can control 
                cookie preferences through your browser settings. Note that disabling cookies may limit 
                functionality of our services.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                10. Children's Privacy
              </h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect 
                personal information from children. If you become aware that a child has provided us with personal 
                information, please contact us immediately.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                11. International Data Transfers
              </h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of 
                residence. We ensure appropriate safeguards are in place for such transfers in compliance with 
                applicable data protection laws.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                12. Changes to This Privacy Policy
              </h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new Privacy Policy on this page and updating the "Last Updated" date. Your continued 
                use of our services after such modifications constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                13. Contact Us
              </h2>
              <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1rem',
                borderLeft: '4px solid #00A8CC'
              }}>
                <p><strong>Nexus Biomedical Intelligence</strong></p>
                <p>Email: <a href="mailto:support@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>support@nexusbiomedical.ai</a></p>
                <p>Privacy Officer: Compliance Team</p>
                <p>Website: <a href="https://nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>nexusbiomedical.ai</a></p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
