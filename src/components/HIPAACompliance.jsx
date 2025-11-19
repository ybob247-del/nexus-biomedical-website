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
              HIPAA Compliance
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
              Our Commitment to Healthcare Data Security and Privacy
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
                HIPAA Compliance Overview
              </h2>
              <p>
                Nexus Biomedical Intelligence is fully committed to compliance with the Health Insurance Portability 
                and Accountability Act (HIPAA) of 1996 and its implementing regulations, including the Privacy Rule, 
                Security Rule, and Breach Notification Rule.
              </p>
              <p style={{ marginTop: '1rem' }}>
                As a provider of healthcare technology solutions that process Protected Health Information (PHI), 
                we understand the critical importance of maintaining the highest standards of data security, privacy, 
                and compliance.
              </p>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Business Associate Responsibilities
              </h2>
              <p>
                Nexus Biomedical Intelligence operates as a Business Associate under HIPAA. We enter into Business 
                Associate Agreements (BAAs) with all covered entities and other business associates before processing 
                any PHI.
              </p>
              <div style={{ 
                background: '#dbeafe', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1.5rem',
                borderLeft: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1e40af' }}>
                  Our BAA Commitments Include:
                </h3>
                <ul style={{ marginLeft: '1.5rem' }}>
                  <li>Use and disclose PHI only as permitted by the BAA and HIPAA</li>
                  <li>Implement appropriate safeguards to prevent unauthorized use or disclosure</li>
                  <li>Report any security incidents or breaches to covered entities</li>
                  <li>Ensure subcontractors comply with HIPAA requirements</li>
                  <li>Make PHI available to individuals as required by HIPAA</li>
                  <li>Return or destroy PHI upon termination of the BAA</li>
                </ul>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Technical Safeguards
              </h2>
              <p>
                We implement comprehensive technical safeguards to protect the confidentiality, integrity, and 
                availability of electronic Protected Health Information (ePHI):
              </p>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Encryption
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Data at Rest:</strong> AES-256 encryption for all stored ePHI</li>
                <li><strong>Data in Transit:</strong> TLS 1.3 encryption for all data transmissions</li>
                <li><strong>Database Encryption:</strong> Encrypted database storage with encrypted backups</li>
                <li><strong>End-to-End Encryption:</strong> For sensitive communications and file transfers</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Access Controls
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Unique User Identification:</strong> Each user has a unique identifier</li>
                <li><strong>Multi-Factor Authentication (MFA):</strong> Required for all user accounts</li>
                <li><strong>Role-Based Access Control (RBAC):</strong> Principle of least privilege</li>
                <li><strong>Automatic Logoff:</strong> Sessions timeout after periods of inactivity</li>
                <li><strong>Emergency Access Procedures:</strong> Documented procedures for emergency access</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Audit Controls
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Comprehensive Logging:</strong> All access to ePHI is logged and monitored</li>
                <li><strong>Audit Trail Protection:</strong> Logs are tamper-proof and encrypted</li>
                <li><strong>Regular Review:</strong> Audit logs reviewed regularly for suspicious activity</li>
                <li><strong>Retention:</strong> Audit logs retained for minimum of 6 years</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Integrity Controls
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Data Validation:</strong> Mechanisms to ensure data has not been altered</li>
                <li><strong>Checksums and Hashing:</strong> Verify data integrity during transmission</li>
                <li><strong>Version Control:</strong> Track changes to ePHI</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Administrative Safeguards
              </h2>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', color: '#00A8CC' }}>
                Security Management Process
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Risk Analysis:</strong> Annual comprehensive risk assessments</li>
                <li><strong>Risk Management:</strong> Implementation of security measures to reduce risks</li>
                <li><strong>Sanction Policy:</strong> Disciplinary actions for security violations</li>
                <li><strong>Information System Activity Review:</strong> Regular monitoring and review</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Workforce Security
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Background Checks:</strong> Conducted for all employees with PHI access</li>
                <li><strong>HIPAA Training:</strong> Mandatory training for all workforce members</li>
                <li><strong>Termination Procedures:</strong> Immediate access revocation upon termination</li>
                <li><strong>Confidentiality Agreements:</strong> Signed by all employees and contractors</li>
              </ul>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem', marginTop: '1.5rem', color: '#00A8CC' }}>
                Contingency Planning
              </h3>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Data Backup Plan:</strong> Automated daily backups with offsite storage</li>
                <li><strong>Disaster Recovery Plan:</strong> Documented procedures for system restoration</li>
                <li><strong>Emergency Mode Operation:</strong> Procedures for continuing operations during emergencies</li>
                <li><strong>Testing:</strong> Regular testing and revision of contingency plans</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Physical Safeguards
              </h2>
              <ul style={{ marginLeft: '2rem' }}>
                <li><strong>Facility Access Controls:</strong> Restricted access to data centers and server rooms</li>
                <li><strong>Workstation Security:</strong> Policies for workstation use and positioning</li>
                <li><strong>Device and Media Controls:</strong> Procedures for disposal and reuse of hardware</li>
                <li><strong>Secure Cloud Infrastructure:</strong> Enterprise-grade cloud providers with SOC 2 Type II compliance</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Privacy Rule Compliance
              </h2>
              <p>We comply with the HIPAA Privacy Rule by:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Using and disclosing PHI only as permitted by law and our BAAs</li>
                <li>Implementing minimum necessary standards for PHI use and disclosure</li>
                <li>Respecting individuals' rights to access, amend, and receive an accounting of disclosures</li>
                <li>Maintaining written policies and procedures regarding PHI</li>
                <li>Training workforce members on privacy practices</li>
                <li>Designating a Privacy Officer responsible for compliance</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Breach Notification Procedures
              </h2>
              <p>
                In the event of a breach of unsecured PHI, we follow strict breach notification procedures:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Discovery:</strong> Immediate investigation upon discovery of potential breach</li>
                <li><strong>Assessment:</strong> Risk assessment to determine if breach notification is required</li>
                <li><strong>Notification to Covered Entity:</strong> Within 60 days of discovery</li>
                <li><strong>Documentation:</strong> Comprehensive documentation of breach and response</li>
                <li><strong>Mitigation:</strong> Immediate steps to mitigate harmful effects</li>
                <li><strong>Prevention:</strong> Implementation of measures to prevent future breaches</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Third-Party Vendors and Subcontractors
              </h2>
              <p>
                All third-party vendors and subcontractors who may have access to PHI are required to:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li>Sign Business Associate Agreements</li>
                <li>Demonstrate HIPAA compliance</li>
                <li>Undergo security assessments</li>
                <li>Maintain appropriate security certifications (SOC 2, ISO 27001, etc.)</li>
                <li>Provide evidence of regular security audits</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Ongoing Compliance and Monitoring
              </h2>
              <div style={{ 
                background: '#f0fdf4', 
                padding: '1.5rem', 
                borderRadius: '0.5rem',
                borderLeft: '4px solid #10b981'
              }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#065f46' }}>
                  Our Continuous Compliance Program:
                </h3>
                <ul style={{ marginLeft: '1.5rem' }}>
                  <li>Annual HIPAA risk assessments</li>
                  <li>Quarterly security audits and penetration testing</li>
                  <li>Regular policy and procedure reviews and updates</li>
                  <li>Ongoing workforce training and awareness programs</li>
                  <li>24/7 security monitoring and incident response</li>
                  <li>Engagement with third-party security experts</li>
                  <li>Participation in industry security forums and working groups</li>
                </ul>
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Certifications and Attestations
              </h2>
              <p>Our infrastructure and security practices are designed to meet industry-leading standards. Our certification roadmap includes:</p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>SOC 2 Type II:</strong> Independent audits of security, availability, and confidentiality controls</li>
                <li><strong>HITRUST CSF:</strong> Healthcare-specific security framework compliance</li>
                <li><strong>ISO 27001:</strong> Information security management system certification</li>
                <li><strong>Cloud Infrastructure:</strong> Built on HIPAA-ready cloud providers (AWS/Azure/GCP) with SOC 2 Type II compliance</li>
              </ul>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                Patient Rights
              </h2>
              <p>
                We support covered entities in fulfilling patient rights under HIPAA, including:
              </p>
              <ul style={{ marginLeft: '2rem', marginTop: '0.75rem' }}>
                <li><strong>Right of Access:</strong> Patients can access their PHI within 30 days</li>
                <li><strong>Right to Amend:</strong> Patients can request amendments to their PHI</li>
                <li><strong>Right to an Accounting:</strong> Patients can receive an accounting of disclosures</li>
                <li><strong>Right to Request Restrictions:</strong> Patients can request restrictions on use and disclosure</li>
                <li><strong>Right to Confidential Communications:</strong> Patients can request alternative communication methods</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: '#0A1B3D' }}>
                HIPAA Compliance Contact
              </h2>
              <p>
                For questions about our HIPAA compliance program, to request a Business Associate Agreement, 
                or to report a security concern:
              </p>
              <div style={{ 
                background: '#f1f5f9', 
                padding: '1.5rem', 
                borderRadius: '0.5rem', 
                marginTop: '1rem',
                borderLeft: '4px solid #00A8CC'
              }}>
                <p><strong>Nexus Biomedical Intelligence</strong></p>
                <p><strong>Privacy Officer:</strong> Dr. Pamela Tebebi-Njoh</p>
                <p><strong>Security Officer:</strong> Chief Information Security Officer</p>
                <p>Email: <a href="mailto:compliance@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>compliance@nexusbiomedical.ai</a></p>
                <p>Privacy Email: <a href="mailto:privacy@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>privacy@nexusbiomedical.ai</a></p>
                <p>Security Email: <a href="mailto:security@nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>security@nexusbiomedical.ai</a></p>
                <p>Website: <a href="https://nexusbiomedical.ai" style={{ color: '#00A8CC', textDecoration: 'none' }}>nexusbiomedical.ai</a></p>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default HIPAACompliance
