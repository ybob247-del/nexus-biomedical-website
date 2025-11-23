# HIPAA Safety FAQ for Clinicians

**Common Questions About Using Nexus Biomedical Intelligence Platforms in Your Practice**

---

## Understanding HIPAA and Our Platforms

### What is HIPAA and who does it apply to?

The Health Insurance Portability and Accountability Act (HIPAA) is a federal law that protects the privacy and security of protected health information (PHI). HIPAA applies to three types of organizations, known as "covered entities": healthcare providers who transmit health information electronically in connection with certain transactions (such as billing), health plans (insurance companies, HMOs, Medicare, Medicaid), and healthcare clearinghouses that process health information between providers and payers.

If you are a physician, nurse practitioner, physician assistant, or other healthcare provider who bills insurance electronically, you are likely a HIPAA-covered entity and must comply with HIPAA regulations when handling patient information.

### Is Nexus Biomedical Intelligence a HIPAA-covered entity?

No. Nexus Biomedical Intelligence is not a HIPAA-covered entity because we do not fall into any of the three categories defined by federal law. We do not provide medical treatment, diagnosis, or prescriptions. We are not a health insurance plan or payer. We do not process insurance claims or operate as a healthcare clearinghouse. We are an educational technology platform providing health information and clinical decision support tools.

### Do I need a Business Associate Agreement (BAA) to use your platforms?

No. Because we are not a HIPAA-covered entity and our platforms are designed to operate with pseudonymous data (not protected health information), you do not need a Business Associate Agreement with us. When you follow our recommended pseudonymous workflow, you are not transmitting PHI to our platform, which means no BAA is required.

This is a significant advantage because it eliminates administrative burden, legal complexity, and compliance costs associated with BAA management.

---

## Using Our Platforms Safely

### How can I use your platforms without violating HIPAA?

Follow our pseudonymous data entry guidelines. Use case identifiers or pseudonyms instead of real patient names, enter age ranges instead of exact dates of birth, and avoid including any of the 18 HIPAA identifiers in your data entries. By keeping patient information de-identified on our platform, you maintain HIPAA compliance while still benefiting from our clinical decision support tools.

Our platforms are specifically designed to support this workflow, making it easy for you to track cases and apply clinical insights without creating regulatory complications.

### What are the 18 HIPAA identifiers I should avoid?

HIPAA defines 18 specific identifiers that, when combined with health information, constitute protected health information (PHI). You should never enter these into our platforms:

1. Names (full name, last name, maiden name)
2. Geographic subdivisions smaller than a state (street address, city, county, ZIP code)
3. Dates directly related to an individual (birth date, admission date, discharge date, date of death)
4. Telephone numbers
5. Fax numbers
6. Email addresses
7. Social Security numbers
8. Medical record numbers
9. Health plan beneficiary numbers
10. Account numbers
11. Certificate/license numbers
12. Vehicle identifiers and serial numbers (license plate numbers)
13. Device identifiers and serial numbers
14. Web URLs
15. IP addresses
16. Biometric identifiers (fingerprints, voiceprints)
17. Full-face photographs and comparable images
18. Any other unique identifying number, characteristic, or code

By avoiding these identifiers and using our recommended pseudonymous approach, you ensure that the information on our platform cannot be used to identify specific individuals.

### Can I enter patient symptoms and medical history?

Yes, you can enter general symptom descriptions and medical history as long as they are not combined with HIPAA identifiers. For example, you can enter "irregular menstrual cycles, chronic pelvic pain, history of PCOS" along with a pseudonym like "Patient MK-001" and age range "30-35 years old." This provides clinically useful information for our assessment tools without creating PHI.

However, you should not copy and paste directly from electronic health records, as these often contain timestamps, provider names, facility names, and other identifying information that could inadvertently create PHI.

### Can I enter medication lists?

Yes, medication lists are safe to enter as long as they are not combined with HIPAA identifiers. You can enter generic or brand drug names along with dosages (e.g., "Warfarin 5mg daily, Metformin 1000mg twice daily") without creating PHI, provided you are using a pseudonym and age range rather than the patient's real name and date of birth.

This is particularly useful for our RxGuard™ platform, which analyzes potential drug interactions and safety concerns based on the medication list you provide.

---

## Liability and Compliance

### Will using your platforms create HIPAA liability for my practice?

No, not if you follow our pseudonymous workflow guidelines. Because you are not transmitting protected health information to our platform, you are not creating HIPAA liability related to our services. Your existing HIPAA obligations for your practice remain unchanged, but using our platforms does not add new compliance burdens.

However, you remain responsible for maintaining HIPAA compliance in your own practice, including how you document findings in official medical records and how you store the key linking pseudonyms to real patient identities.

### What if I accidentally enter identifying information?

If you realize you have entered a HIPAA identifier or other identifying information, you should delete that assessment and create a new one using the pseudonymous approach. Our platforms do not integrate with external systems, so the data remains isolated within your account. However, prevention is always better than correction, so we strongly recommend carefully reviewing your entries before submitting assessments.

If you have concerns about a potential privacy breach, consult your practice's privacy officer or legal counsel for guidance on whether breach notification or other actions are required under your specific circumstances.

### Am I responsible for keeping track of which pseudonyms correspond to which patients?

Yes. You should maintain a secure record in your practice that links pseudonyms to real patient identities. This record should be stored in accordance with your practice's HIPAA security policies, such as in an encrypted file or secure physical location with restricted access. This allows you to track cases over time and apply findings to the correct patients while maintaining complete anonymity on our platform.

Do not store this linking key on our platform or in any publicly accessible location.

### Do I need to document in the medical record that I used your platforms?

You should document your clinical decision-making process according to your standard practices. If our platform insights informed your decisions, you may note that you consulted clinical decision support tools, but you are not required to specify which tools or provide detailed platform outputs. Focus on documenting your clinical reasoning, the evidence supporting your decisions, and the recommendations you provided to the patient.

Remember that platform results are for informational and educational purposes only, and all clinical decisions remain your professional responsibility as a licensed healthcare provider.

---

## Patient Consent and Communication

### Do I need to get patient consent to use your platforms?

HIPAA does not require patient consent for treatment, payment, or healthcare operations, which includes using clinical decision support tools in the course of providing care. However, your practice may have its own policies regarding disclosure of third-party tools or services, and some states may have additional consent requirements beyond federal HIPAA rules.

We recommend reviewing your practice's privacy policies and consulting with your legal counsel to determine whether specific consent language is needed for your situation. Because our platforms operate with pseudonymous data, the privacy risks are minimal, but transparency with patients about your clinical workflow is always good practice.

### Can I share platform results directly with patients?

Yes, you can discuss findings with patients and provide them with general educational information from our platforms. However, any formal medical documentation should be created in your official electronic health record using standard clinical documentation practices. You may print or email assessment results to patients if you choose, but ensure that any such communications comply with your practice's policies and applicable privacy laws.

Patients may also create their own accounts and complete assessments independently, which can facilitate shared decision-making and patient engagement.

### What if a patient asks how their data is being used?

You can explain that you are using a clinical decision support tool to analyze symptoms, medication interactions, or health risks, and that the tool operates with de-identified information to protect their privacy. You can refer them to our Privacy Policy at nexusbiomedical.ai/privacy for detailed information about how we handle data, or direct them to create their own account if they want to explore the platforms independently.

Emphasize that their real name, date of birth, and other identifying information are not shared with the platform, which provides an extra layer of privacy protection beyond what is typically required by law.

---

## Technical and Security Questions

### How is my data protected on your platforms?

We implement industry-standard security measures including encryption in transit (TLS/SSL), encryption at rest for stored data, secure authentication and access controls, regular security audits and vulnerability assessments, and strict internal policies limiting employee access to user data. While we are not subject to HIPAA regulations, we follow security best practices that align with or exceed HIPAA security standards.

For detailed information about our security practices, see our Security & Privacy page at nexusbiomedical.ai/hipaa.

### Do you share data with third parties?

We do not sell user data to third parties for marketing purposes. We use carefully selected service providers to help operate our platforms (such as cloud hosting, payment processing, and AI model services), and these providers are contractually obligated to protect your information and use it only for the purposes we specify. We share only the minimum information necessary for them to provide their services.

For complete details, see our Privacy Policy at nexusbiomedical.ai/privacy.

### What happens to my data if I cancel my subscription?

If you cancel your subscription, you will continue to have access to your account and data until the end of your current billing period. After that, your account will be deactivated, but your data will be retained for a period of time in accordance with our data retention policies and legal obligations. You can request deletion of your data at any time by contacting support@nexusbiomedical.ai, and we will delete or anonymize your information within 90 days, except where we are required to retain it for legal, regulatory, or legitimate business purposes.

Because you are using pseudonymous data, the privacy risk associated with data retention is minimal, but we respect your right to request deletion if you choose to do so.

---

## State-Specific and International Considerations

### Do state privacy laws affect how I can use your platforms?

Some states have enacted health privacy laws that go beyond federal HIPAA requirements. For example, California has the California Consumer Privacy Act (CCPA) and the California Privacy Rights Act (CPRA), which provide additional privacy protections. While our pseudonymous approach minimizes regulatory risk, you should consult with legal counsel familiar with your state's requirements to ensure full compliance.

Our platforms are designed to support privacy-protective practices that should be compatible with most state laws, but ultimate compliance responsibility rests with your practice.

### Can I use your platforms if I practice outside the United States?

Our platforms are currently designed for use in the United States and operate under U.S. law. If you practice in another country, you should consult with legal counsel to determine whether our platforms comply with your country's health privacy regulations (such as GDPR in the European Union). The pseudonymous data model we recommend should be compatible with most international privacy frameworks, but specific requirements vary by jurisdiction.

We are exploring international expansion and may offer region-specific versions of our platforms in the future.

### What about GDPR compliance for EU patients?

The General Data Protection Regulation (GDPR) applies to the processing of personal data of individuals in the European Union. While our platforms are not currently marketed to EU residents, the pseudonymous approach we recommend aligns with GDPR principles of data minimization and privacy by design. If you treat EU patients and want to use our platforms, consult with legal counsel to ensure compliance with GDPR requirements, including obtaining appropriate consent and providing required disclosures.

---

## Clinical and Professional Questions

### Are your platforms FDA-approved medical devices?

No. Our platforms are not medical devices and are not FDA-approved or cleared. They are educational and informational tools designed to support clinical decision-making, not to diagnose, treat, or prevent disease. All clinical decisions remain the sole responsibility of licensed healthcare professionals, and our platforms should be used as one of many resources to inform your professional judgment.

### Can I rely solely on platform recommendations for clinical decisions?

No. Our platforms provide information and decision support based on current evidence and AI-driven analysis, but they are not a substitute for professional medical judgment. You should consider platform results along with your clinical assessment, patient preferences, current guidelines, and other relevant factors when making treatment decisions. Always apply your professional expertise and consider the individual circumstances of each patient.

Platform results are for informational and educational purposes only, and we are not responsible for medical outcomes or decisions based on information from our services.

### What if I disagree with a platform recommendation?

You are always free to exercise your professional judgment and make decisions that differ from platform recommendations. Our tools are designed to support, not replace, clinical decision-making. If you find that platform results do not align with your clinical assessment or current evidence, trust your expertise and document your reasoning in the medical record.

We welcome feedback on platform performance and recommendations, as this helps us continuously improve our tools. You can contact us at support@nexusbiomedical.ai with questions or concerns about specific assessments.

### How often are your platforms updated with new evidence?

We continuously monitor medical literature, clinical guidelines, and regulatory updates to ensure our platforms reflect current best practices. Major updates are implemented on a regular basis, and critical safety information is incorporated as soon as it becomes available. We are committed to providing evidence-based, up-to-date information to support high-quality patient care.

---

## Getting Help

### Who can I contact if I have questions?

For questions about using our platforms, privacy practices, or HIPAA compliance:

**Email:** support@nexusbiomedical.ai  
**Website:** nexusbiomedical.ai  
**Response time:** Within 24-48 hours for general inquiries

For urgent technical issues or security concerns, please include "URGENT" in your email subject line.

### Do you offer training for my staff?

Yes, we offer training resources to help you and your team use our platforms effectively and safely. This includes video tutorials, webinars, and written documentation. Contact us at support@nexusbiomedical.ai to discuss training options for your practice.

### Can I provide feedback or suggest improvements?

Absolutely! We value feedback from healthcare providers and continuously work to improve our platforms based on real-world use. Please contact us at support@nexusbiomedical.ai with suggestions, feature requests, or reports of any issues you encounter.

---

## Summary

Nexus Biomedical Intelligence platforms are designed to empower healthcare providers with cutting-edge clinical decision support while maintaining the highest standards of privacy and regulatory compliance. By following our pseudonymous workflow, you can confidently use our tools to enhance patient care without creating HIPAA complications or administrative burdens.

**Key Takeaways:**

- We are not a HIPAA-covered entity, so no BAA is required
- Use pseudonyms and age ranges instead of real names and exact dates of birth
- Avoid entering any of the 18 HIPAA identifiers
- Platform results are for informational purposes; clinical decisions remain your responsibility
- We implement strong security measures to protect your data
- Contact us anytime with questions or concerns

Thank you for choosing Nexus Biomedical Intelligence. We are committed to supporting your practice with innovative, privacy-protective technologies.

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2025  
**Author:** Nexus Biomedical Intelligence

For the most current version of this FAQ, visit nexusbiomedical.ai/docs
