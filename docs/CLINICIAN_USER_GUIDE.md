# Clinician User Guide

**For Healthcare Providers Using Nexus Biomedical Intelligence Platforms**

---

## Overview

Nexus Biomedical Intelligence platforms (RxGuard™, EndoGuard™, and others) are designed to support clinical decision-making while maintaining patient privacy and avoiding HIPAA complications. This guide explains how healthcare providers can safely use these tools in their practice without creating regulatory burdens or compliance obligations.

---

## Understanding Our Privacy-First Design

Our platforms use a **pseudonymous data model** that allows clinicians to leverage powerful AI-driven assessments without collecting protected health information (PHI) or personally identifiable information (PII). This design means you can use our tools without needing a Business Associate Agreement (BAA) and without creating HIPAA liability for your practice.

The key principle is simple: **never enter information that could directly identify a specific patient**. Instead, use general identifiers and anonymized data that still allow you to track cases and apply clinical insights.

---

## The Pseudonymous Workflow

### Step 1: Create a Patient Identifier

Instead of using the patient's real name, create a pseudonym or case identifier that is meaningful to you but does not reveal the patient's identity to anyone else.

**Safe identifier examples:**

| Type | Example | Why It Works |
|------|---------|--------------|
| Initials + Number | "JS-001" or "Patient JS" | Meaningful to you, not identifiable to others |
| Case Number | "Case 2024-045" | Tracks your internal records without names |
| Generic Label | "Patient A" or "Endo Case 12" | Simple and completely anonymous |
| Custom Code | "Blue-23" or "Theta-7" | Your own coding system |

**Unsafe identifiers to AVOID:**

- Full names ("Jane Smith")
- Medical record numbers (MRN)
- Social Security numbers
- Insurance policy numbers
- Addresses or phone numbers

### Step 2: Enter Demographic Information

Use **age ranges** instead of exact dates of birth, and provide only the demographic information necessary for the assessment.

**Safe demographic data:**

| Field | Safe Approach | Example |
|-------|---------------|---------|
| Age | Use 5-year ranges | "45-50 years old" or "Age 35-40" |
| Gender | General categories | "Female", "Male", "Non-binary" |
| Ethnicity | Broad categories | "Hispanic/Latino", "Asian", "White" |
| Location | General region only | "Southwest US" or "Urban area" |

**What to avoid:**

- Exact date of birth (e.g., "March 15, 1985")
- Specific city or street address
- Workplace name or specific employer
- Any unique identifying details

### Step 3: Enter Clinical Information

You can enter self-reported symptoms, medication lists, and assessment responses as long as they do not include identifying information.

**Safe clinical data:**

- Current medications by generic or brand name
- Symptom descriptions ("irregular periods", "joint pain")
- Medical history in general terms ("history of hypertension")
- Laboratory values without patient identifiers
- Assessment responses to platform questions

**What to avoid:**

- Notes copied directly from electronic health records (EHR)
- Physician names or facility names
- Appointment dates or visit records
- Insurance billing codes
- Any data that links back to identifiable records

### Step 4: Review Results and Apply to Care

The platform will generate risk assessments, medication interaction warnings, or clinical recommendations based on the information provided. You can use these insights to inform your clinical decision-making, discuss options with your patient, and document findings in your official medical records using your standard documentation practices.

**Important:** The platform results are for informational and educational purposes only. All clinical decisions remain your professional responsibility as a licensed healthcare provider.

---

## Use Case Examples

### Example 1: Medication Interaction Check (RxGuard™)

**Scenario:** You have a patient taking multiple medications and want to check for potential interactions.

**Safe workflow:**

1. Create identifier: "Patient MK-2024"
2. Enter age range: "60-65 years old"
3. Enter medication list:
   - Warfarin 5mg daily
   - Metformin 1000mg twice daily
   - Atorvastatin 40mg daily
   - Aspirin 81mg daily
4. Run RxGuard analysis
5. Review interaction warnings and recommendations
6. Discuss findings with patient
7. Document in official EHR using patient's real identity

**Result:** You get valuable drug interaction insights without creating HIPAA obligations or needing a BAA.

### Example 2: Hormone Health Assessment (EndoGuard™)

**Scenario:** A patient presents with symptoms suggestive of endometriosis and you want to assess risk factors.

**Safe workflow:**

1. Create identifier: "Endo-Case-47"
2. Enter demographics: "Female, Age 30-35, Hispanic"
3. Complete EndoGuard assessment with patient's self-reported symptoms:
   - Pelvic pain severity and timing
   - Menstrual cycle characteristics
   - Environmental exposure history
   - Family history (general terms)
4. Review risk analysis and recommendations
5. Use insights to guide diagnostic workup and treatment planning
6. Document in official EHR with patient's real information

**Result:** You receive evidence-based risk stratification and clinical guidance while maintaining patient privacy and avoiding regulatory complications.

---

## HIPAA Compliance and Legal Considerations

### Why This Approach is HIPAA-Safe

Nexus Biomedical Intelligence is **not a HIPAA-covered entity** because we do not provide medical treatment, operate as a health plan, or function as a healthcare clearinghouse. When you use our platforms with pseudonymous data, you are not transmitting protected health information (PHI) to a third party, which means:

- **No Business Associate Agreement (BAA) required** between your practice and Nexus Biomedical Intelligence
- **No HIPAA liability created** by using our platforms
- **No breach notification obligations** related to our services
- **No additional compliance burden** for your practice

### Your Responsibilities

While our platforms are designed to minimize regulatory burden, you remain responsible for:

1. **Maintaining patient confidentiality** in your own records and documentation
2. **Ensuring pseudonyms cannot be reverse-engineered** to identify specific patients by unauthorized parties
3. **Following your own HIPAA obligations** when documenting findings in official medical records
4. **Using clinical judgment** and not relying solely on platform recommendations for medical decisions
5. **Obtaining appropriate informed consent** from patients as required by your practice policies and applicable laws

### Best Practices for Compliance

To maintain the highest standards of privacy and compliance, we recommend:

- **Keep a separate key** linking pseudonyms to real patient identities in a secure location within your practice (not on our platform)
- **Train staff** on the pseudonymous workflow to ensure consistency
- **Review your practice's privacy policies** to ensure they cover use of third-party decision support tools
- **Document your clinical reasoning** in official medical records, not just platform results
- **Consult your legal counsel** if you have questions about specific use cases or state-specific regulations

---

## Frequently Asked Questions

### Can I use real patient names if I get their consent?

We strongly recommend against using real patient names, even with consent. The pseudonymous approach protects both you and your patients by eliminating HIPAA complications entirely. There is no clinical benefit to using real names, and doing so creates unnecessary regulatory risk.

### What if I need to track the same patient over multiple visits?

Use the same pseudonym or case identifier for that patient across all visits. Keep a secure record in your practice linking the pseudonym to the patient's real identity. This allows you to track longitudinal data while maintaining privacy on our platform.

### Can I share platform results directly with patients?

Yes, you can discuss findings with patients and provide them with general educational information from the platform. However, any formal medical documentation should be created in your official EHR using standard clinical documentation practices.

### What if I accidentally enter identifying information?

If you realize you have entered PHI or PII, you can delete the assessment and create a new one using the pseudonymous approach. Our platforms do not integrate with external systems, so the data remains isolated within your account. However, prevention is always better than correction, so please follow the guidelines carefully.

### Do I need to document that I used these platforms in my medical records?

You should document your clinical decision-making process according to your standard practices. If platform insights informed your decisions, you may note that you consulted clinical decision support tools, but you are not required to specify which tools or provide detailed platform outputs. Focus on documenting your clinical reasoning and the evidence supporting your decisions.

### Can I use the platform for research or quality improvement projects?

Yes, the pseudonymous data model makes our platforms well-suited for research and quality improvement initiatives. However, you should consult your institutional review board (IRB) or ethics committee for guidance on specific projects, as additional protections or approvals may be required depending on the nature of your work.

### What if my state has additional privacy laws beyond HIPAA?

Some states have enacted additional health privacy laws that may apply to your practice. While our pseudonymous approach minimizes regulatory risk, you should consult with legal counsel familiar with your state's requirements to ensure full compliance. Our platforms are designed to support privacy-protective practices, but ultimate compliance responsibility rests with your practice.

---

## Technical Support and Training

### Getting Help

If you have questions about using our platforms or need assistance with the pseudonymous workflow:

- **Email:** support@nexusbiomedical.ai
- **Website:** nexusbiomedical.ai
- **Response time:** Within 24-48 hours for general inquiries

### Training Resources

We offer additional resources to help you and your team use our platforms effectively:

- **Video tutorials** demonstrating the pseudonymous workflow (coming soon)
- **Webinars** for healthcare providers on clinical applications and privacy best practices (coming soon)
- **Case studies** showing real-world examples of safe platform use (coming soon)

---

## Conclusion

Nexus Biomedical Intelligence platforms empower you to leverage cutting-edge AI-driven clinical decision support while maintaining the highest standards of patient privacy and regulatory compliance. By following the pseudonymous workflow outlined in this guide, you can confidently use our tools to enhance patient care without creating HIPAA complications or administrative burdens for your practice.

We are committed to supporting healthcare providers with innovative, privacy-protective technologies that make clinical practice safer and more efficient. Thank you for choosing Nexus Biomedical Intelligence.

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2025  
**Author:** Nexus Biomedical Intelligence

For the most current version of this guide, visit nexusbiomedical.ai/docs
