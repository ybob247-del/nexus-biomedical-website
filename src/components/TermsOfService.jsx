import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const TermsOfService = () => {
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
              Terms of Service
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
            
            {/* Medical Disclaimer - Moved to top for prominence */}
            <section style={{ marginBottom: '2.5rem', background: '#fef2f2', padding: '2rem', borderRadius: '0.5rem', borderLeft: '4px solid #ef4444' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#991b1b' }}>
                ⚕️ Important Medical Disclaimer
              </h2>
              <p style={{ fontWeight: 600, marginBottom: '1rem' }}>
                Our Services are intended for informational and educational purposes only.
              </p>
              <p>You acknowledge and agree that:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Our Services provide educational information and decision support, NOT medical diagnoses or treatment</li>
                <li>You should always consult qualified healthcare professionals for medical advice</li>
                <li>You should not disregard professional medical advice or delay seeking it because of information from our Services</li>
                <li>In case of medical emergency, call emergency services immediately (911 in the United States)</li>
                <li>Our Services supplement, but do NOT replace, professional medical judgment</li>
                <li>Clinical decisions remain the sole responsibility of licensed healthcare professionals</li>
                <li>We are not responsible for any medical outcomes or decisions based on information from our Services</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using the services provided by Nexus Biomedical Intelligence ("we," "our," or "us"), including our website at nexusbiomedical.ai and associated platforms (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use our Services.
              </p>
              <p style={{ marginTop: '1rem' }}>
                These Terms constitute a legally binding agreement between you and Nexus Biomedical Intelligence.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                2. Description of Services
              </h2>
              <p>Nexus Biomedical Intelligence provides AI-powered health information and clinical decision support platforms, including:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>RxGuard™</strong> - Medication interaction analysis and drug safety information</li>
                <li><strong>EndoGuard™</strong> - Hormone health assessment and environmental exposure evaluation</li>
                <li><strong>Additional platforms</strong> - ElderWatch™, PediCalc Pro™, ClinicalIQ™, ReguReady™, SkinScan Pro™ (coming soon)</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Nature of Our Services
              </h3>
              <p><strong>Our Services ARE:</strong></p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Educational and informational tools</li>
                <li>Clinical decision support resources</li>
                <li>Health risk assessment platforms</li>
                <li>Evidence-based information resources</li>
              </ul>

              <p style={{ marginTop: '1rem' }}><strong>Our Services are NOT:</strong></p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Medical devices (not FDA-approved or cleared)</li>
                <li>Diagnostic tools (we do not diagnose medical conditions)</li>
                <li>Treatment platforms (we do not prescribe medications or provide treatment)</li>
                <li>Medical record systems (we do not collect or store medical records)</li>
                <li>Substitutes for professional medical advice, diagnosis, or treatment</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                3. User Eligibility
              </h2>
              <p>
                You must be at least 18 years of age to use our Services. By using our Services, you represent and warrant that you meet this age requirement.
              </p>
              <p style={{ marginTop: '1rem' }}>
                Healthcare professionals using our Services must maintain appropriate professional licenses and comply with their respective licensing board requirements and applicable laws and regulations.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                4. Account Registration
              </h2>
              <p>To access certain features of our Services, you must create an account. You agree to:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Keep your password secure and confidential</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Not share your account credentials with others</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                We reserve the right to suspend or terminate accounts that violate these Terms or are inactive for extended periods.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                5. Subscription and Payment Terms
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Subscription Plans
              </h3>
              <p>Our Services are offered on a subscription basis. Pricing and plan details are available on our website and may be updated from time to time.</p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Billing
              </h3>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Subscriptions are billed monthly in advance</li>
                <li>Payment is processed securely through Stripe, our third-party payment processor</li>
                <li>You authorize us to charge your payment method for all fees incurred</li>
                <li>All fees are in U.S. dollars unless otherwise stated</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Automatic Renewal
              </h3>
              <p>
                Your subscription will automatically renew at the end of each billing period unless you cancel before the renewal date. You will be charged the then-current subscription fee.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Cancellation
              </h3>
              <p>
                You may cancel your subscription at any time through your account settings or by contacting us at support@nexusbiomedical.ai. Cancellation takes effect at the end of your current billing period. You will continue to have access to the Services until the end of the paid period.
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Refunds
              </h3>
              <p>
                We do not provide refunds for partial subscription periods. If you cancel your subscription, you will not be charged for subsequent billing periods, but you will not receive a refund for the current period.
              </p>
              <p style={{ marginTop: '0.75rem' }}>
                Exceptions may be made at our sole discretion in cases of technical issues that prevent you from accessing the Services.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                6. Acceptable Use
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Permitted Uses
              </h3>
              <p>You may use our Services to:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Access health information and educational resources</li>
                <li>Perform health risk assessments</li>
                <li>Analyze medication interactions and safety information</li>
                <li>Support clinical decision-making processes</li>
                <li>Track your assessment history</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Prohibited Uses
              </h3>
              <p>You may NOT use our Services to:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Violate any applicable laws, regulations, or third-party rights</li>
                <li>Infringe on intellectual property rights</li>
                <li>Transmit malware, viruses, or other harmful code</li>
                <li>Attempt to gain unauthorized access to our systems or networks</li>
                <li>Reverse engineer, decompile, or disassemble our software</li>
                <li>Use automated tools to scrape, extract, or collect data from our Services</li>
                <li>Impersonate others or provide false information</li>
                <li>Share your account credentials with others</li>
                <li>Use the Services for any unlawful, fraudulent, or malicious purpose</li>
                <li>Interfere with or disrupt the operation of our Services</li>
              </ul>
              <p style={{ marginTop: '1rem', fontWeight: 600 }}>
                Violation of these prohibited uses may result in immediate termination of your account and access to our Services.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem', background: '#f0f9ff', padding: '2rem', borderRadius: '0.5rem', borderLeft: '4px solid #00A8CC' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                7. HIPAA and Healthcare Privacy
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Understanding HIPAA
              </h3>
              <p>
                The Health Insurance Portability and Accountability Act (HIPAA) is a federal law that protects the privacy and security of medical information held by <strong>covered entities</strong>, which are defined as:
              </p>
              <ol style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Healthcare Providers</strong> who transmit health information electronically in connection with certain transactions</li>
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
                Implications for Healthcare Providers
              </h3>
              <p style={{ fontWeight: 600 }}>If you are a healthcare provider:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Using our Services <strong>does not create HIPAA liability</strong> for your practice</li>
                <li>You <strong>do not need a Business Associate Agreement (BAA)</strong> with us</li>
                <li>Our Services operate independently of your patient records and do not access PHI from your practice</li>
                <li>If you choose to enter patient information into our platforms, you are responsible for de-identifying that information and ensuring compliance with your own HIPAA obligations</li>
              </ul>
              <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
                <strong>We recommend using our tools for educational purposes or with anonymized/de-identified data only.</strong>
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Data We Collect
              </h3>
              <p>We collect only information that users voluntarily provide through our assessment tools, including:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Email address and account information</li>
                <li>Self-reported symptoms and health information</li>
                <li>Medication names entered for interaction checking</li>
                <li>Assessment responses and results</li>
              </ul>

              <p style={{ marginTop: '1rem' }}>We do NOT collect:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Patient names or medical record numbers</li>
                <li>Social Security numbers</li>
                <li>Insurance policy numbers</li>
                <li>Medical records from healthcare providers</li>
                <li>Diagnostic codes or treatment records from clinical systems</li>
              </ul>

              <p style={{ marginTop: '1rem' }}>
                For complete details, see our Privacy Policy at <a href="/privacy" style={{ color: '#00A8CC', textDecoration: 'none' }}>nexusbiomedical.ai/privacy</a>
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                8. Intellectual Property
              </h2>
              <p>
                All content, features, and functionality of our Services, including but not limited to text, graphics, logos, algorithms, software, and databases, are owned by Nexus Biomedical Intelligence and are protected by copyright, trademark, patent, and other intellectual property laws.
              </p>
              <p style={{ marginTop: '1rem' }}>
                You are granted a limited, non-exclusive, non-transferable, revocable license to access and use our Services for their intended purpose in accordance with these Terms. You may not:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Copy, modify, distribute, or create derivative works based on our Services</li>
                <li>Sell, lease, or sublicense any part of our Services</li>
                <li>Remove, alter, or obscure any copyright, trademark, or other proprietary notices</li>
                <li>Use our Services to develop competing products or services</li>
                <li>Frame or mirror any part of our Services without our prior written consent</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                9. Disclaimers and Limitations of Liability
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                No Warranties
              </h3>
              <p style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                To the maximum extent permitted by law, our Services are provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied.
              </p>
              <p style={{ marginTop: '1rem' }}>We do not warrant that:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Our Services will be uninterrupted, secure, or error-free</li>
                <li>The results obtained from our Services will be accurate or reliable</li>
                <li>Any errors or defects will be corrected</li>
                <li>Our Services will meet your specific requirements</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Limitation of Liability
              </h3>
              <p style={{ textTransform: 'uppercase', fontWeight: 600 }}>
                To the maximum extent permitted by law, Nexus Biomedical Intelligence shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Loss of profits, revenue, data, or business opportunities</li>
                <li>Personal injury or property damage</li>
                <li>Medical outcomes or decisions based on information from our Services</li>
                <li>Errors, inaccuracies, or omissions in content</li>
                <li>Unauthorized access to or use of your data</li>
                <li>Interruption or cessation of our Services</li>
              </ul>
              <p style={{ marginTop: '1rem', textTransform: 'uppercase', fontWeight: 600 }}>
                Our total liability to you for all claims arising from or related to our Services shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                10. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your access to our Services at any time, with or without cause, with or without notice, including but not limited to:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Violation of these Terms</li>
                <li>Fraudulent, illegal, or abusive activity</li>
                <li>Non-payment of subscription fees</li>
                <li>Prolonged inactivity</li>
                <li>Conduct that harms or could harm us, our users, or third parties</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                Upon termination, your right to access and use our Services will immediately cease. We may delete your account and data, subject to our data retention policies and legal obligations.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                11. Changes to These Terms
              </h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of material changes by:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Posting the updated Terms on our website with a new "Last Updated" date</li>
                <li>Sending an email notification to your registered email address (for significant changes)</li>
                <li>Displaying a prominent notice on our Services</li>
              </ul>
              <p style={{ marginTop: '1rem' }}>
                Your continued use of our Services after such modifications constitutes your acceptance of the updated Terms. If you do not agree to the modified Terms, you must stop using our Services and cancel your account.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                12. Contact Information
              </h2>
              <p>For questions, concerns, or notices regarding these Terms:</p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1rem',
                borderLeft: '4px solid #00A8CC'
              }}>
                <p><strong>Email:</strong> <a href="mailto:support@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>support@nexusbiomedical.ai</a></p>
                <p><strong>Website:</strong> <a href="https://nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>nexusbiomedical.ai</a></p>
              </div>
            </section>

            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#fef3c7', borderRadius: '0.5rem', borderLeft: '4px solid #f59e0b' }}>
              <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>⚖️ Legal Review Recommended</p>
              <p style={{ fontSize: '0.9rem' }}>
                These Terms of Service should be reviewed by a qualified attorney before publication to ensure compliance with applicable laws in your jurisdiction.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TermsOfService
