import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const TermsOfService = () => {
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
              Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p>
                Welcome to Nexus Biomedical Intelligence. By accessing or using our healthcare AI platform and 
                services ("Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not 
                agree to these Terms, you may not access or use our Services.
              </p>
              <p style={{ marginTop: '1rem' }}>
                These Terms constitute a legally binding agreement between you (either an individual or an entity) 
                and Nexus Biomedical Intelligence ("Company," "we," "us," or "our").
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                2. Eligibility and Account Registration
              </h2>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                2.1 Eligibility
              </h3>
              <p>You must meet the following requirements to use our Services:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Be at least 18 years of age</li>
                <li>Be a licensed healthcare professional or authorized representative of a healthcare organization</li>
                <li>Have the legal authority to enter into this agreement</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                2.2 Account Registration
              </h3>
              <p>To access certain features, you must create an account. You agree to:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                3. Use of Services
              </h2>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                3.1 License Grant
              </h3>
              <p>
                Subject to your compliance with these Terms, we grant you a limited, non-exclusive, non-transferable, 
                revocable license to access and use our Services for your professional healthcare purposes.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                3.2 Acceptable Use
              </h3>
              <p>You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Use the Services for any unauthorized or illegal purpose</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Interfere with or disrupt the Services or servers</li>
                <li>Reverse engineer, decompile, or disassemble any part of the Services</li>
                <li>Remove, alter, or obscure any proprietary notices</li>
                <li>Use automated systems to access the Services without permission</li>
                <li>Share your account credentials with unauthorized parties</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                3.3 Clinical Decision Support
              </h3>
              <p style={{ 
                background: '#fef3c7', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                borderLeft: '4px solid #f59e0b',
                fontWeight: 600
              }}>
                <strong>IMPORTANT:</strong> Our Services provide clinical decision support tools and are intended 
                to supplement, not replace, the knowledge, experience, and professional judgment of healthcare 
                practitioners. All clinical decisions remain the sole responsibility of the treating healthcare 
                professional.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                4. Beta Access and Free Trial
              </h2>
              <p>
                During beta testing and free trial periods, the Services are provided "as is" for evaluation purposes. 
                We may modify, suspend, or discontinue beta features at any time without notice. Beta features may 
                contain bugs or errors and should not be used for critical clinical decisions.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                5. Fees and Payment
              </h2>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                5.1 Subscription Fees
              </h3>
              <p>
                Access to certain Services requires payment of subscription fees. All fees are exclusive of applicable 
                taxes unless otherwise stated. You agree to pay all fees according to the pricing and payment terms 
                presented to you at the time of purchase.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                5.2 Automatic Renewal
              </h3>
              <p>
                Subscriptions automatically renew at the end of each billing period unless you cancel before the 
                renewal date. You authorize us to charge your payment method for renewal fees.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                5.3 Refund Policy
              </h3>
              <p>
                Fees are non-refundable except as required by law or as explicitly stated in your subscription agreement. 
                We may offer refunds on a case-by-case basis at our sole discretion.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                6. Intellectual Property Rights
              </h2>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                6.1 Our Property
              </h3>
              <p>
                The Services, including all content, features, functionality, software, algorithms, and AI models, 
                are owned by Nexus Biomedical Intelligence and are protected by copyright, trademark, patent, and 
                other intellectual property laws.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                6.2 Your Data
              </h3>
              <p>
                You retain all rights to the data you input into our Services. By using our Services, you grant us 
                a limited license to process your data solely to provide the Services and improve our AI models 
                (using de-identified, aggregated data only).
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                7. Privacy and Data Protection
              </h2>
              <p>
                Your use of our Services is subject to our Privacy Policy, which is incorporated into these Terms 
                by reference. We are committed to HIPAA compliance and protecting the confidentiality and security 
                of Protected Health Information (PHI).
              </p>
              <p style={{ marginTop: '1rem' }}>
                Healthcare organizations using our Services must execute a Business Associate Agreement (BAA) with 
                us before processing any PHI.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                8. Disclaimers and Limitations of Liability
              </h2>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                8.1 No Medical Advice
              </h3>
              <p style={{ 
                background: '#fee2e2', 
                padding: '1rem', 
                borderRadius: '0.5rem', 
                borderLeft: '4px solid #dc2626',
                fontWeight: 600
              }}>
                <strong>DISCLAIMER:</strong> The Services do not provide medical advice, diagnosis, or treatment. 
                All information is for informational and educational purposes only. Always seek the advice of a 
                qualified healthcare provider with any questions regarding a medical condition.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                8.2 Service Availability
              </h3>
              <p>
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS 
                OR IMPLIED. We do not guarantee that the Services will be uninterrupted, error-free, or completely 
                secure.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                8.3 Limitation of Liability
              </h3>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEXUS BIOMEDICAL INTELLIGENCE SHALL NOT BE LIABLE FOR ANY 
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, 
                WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                9. Indemnification
              </h2>
              <p>
                You agree to indemnify, defend, and hold harmless Nexus Biomedical Intelligence and its officers, 
                directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising 
                out of or in any way connected with your access to or use of the Services, your violation of these 
                Terms, or your violation of any rights of another party.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                10. Termination
              </h2>
              <p>
                We may terminate or suspend your access to the Services immediately, without prior notice or liability, 
                for any reason, including breach of these Terms. Upon termination, your right to use the Services 
                will immediately cease.
              </p>
              <p style={{ marginTop: '1rem' }}>
                You may terminate your account at any time by contacting us. All provisions of these Terms that by 
                their nature should survive termination shall survive, including ownership provisions, warranty 
                disclaimers, and limitations of liability.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                11. Governing Law and Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the United States, 
                without regard to its conflict of law provisions. Any disputes arising from these Terms or your use 
                of the Services shall be resolved through binding arbitration in accordance with the American 
                Arbitration Association's rules.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                12. Changes to Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of material changes 
                by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use 
                of the Services after such modifications constitutes your acceptance of the updated Terms.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                13. Miscellaneous
              </h2>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and us</li>
                <li><strong>Severability:</strong> If any provision is found unenforceable, the remaining provisions will continue in effect</li>
                <li><strong>Waiver:</strong> No waiver of any term shall be deemed a further or continuing waiver</li>
                <li><strong>Assignment:</strong> You may not assign these Terms without our prior written consent</li>
                <li><strong>Force Majeure:</strong> We are not liable for delays or failures due to circumstances beyond our control</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                14. Contact Information
              </h2>
              <p>If you have questions about these Terms, please contact us:</p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1rem',
                borderLeft: '4px solid #00A8CC'
              }}>
                <p><strong>Nexus Biomedical Intelligence</strong></p>
                <p>Email: <a href="mailto:legal@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>legal@nexusbiomedical.ai</a></p>
                <p>Website: <a href="https://nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>nexusbiomedical.ai</a></p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService
