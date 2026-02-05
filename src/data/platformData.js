export const platformsData = {
  'RxGuard™': {
    name: 'RxGuard™',
    tagline: 'Medication Interaction Predictor',
    color: '#00A8CC',
    gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
    badge: 'AI-POWERED MEDICATION SAFETY',
    trialDays: 14,
    comingSoon: false,
    hero: {
      title: 'RxGuard™ Medication Interaction Predictor',
      subtitle: 'Identify potential medication interaction risks to support clinical decision-making.'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'Medication errors contribute to over 100,000 deaths each year in the United States. Dangerous drug–drug interactions are a leading cause of preventable hospitalizations and adverse events, particularly among older adults who often take seven or more medications simultaneously.',
        'Traditional interaction checkers rely on static rules, generate excessive false alerts, and frequently miss clinically meaningful combinations. Healthcare professionals need more intelligent tools to identify interaction risks early and prioritize follow-up before harm occurs.',
        'RxGuard™ applies AI-driven analysis to medication data and reference sources to help surface potential drug interaction risks and safety considerations. The platform is designed to support clinicians with actionable, evidence-informed insights — not to replace clinical judgment or prescribing responsibility.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Input Medications', desc: 'Enter your patient\'s current medication list including prescription drugs, OTC medications, supplements, and herbals.' },
      { step: 2, title: 'AI Analysis', desc: 'Our ensemble learning system analyzes all possible drug-drug interactions using four complementary algorithms.' },
      { step: 3, title: 'Risk Scoring', desc: 'Each interaction receives a severity score from 1-10 with clear clinical significance ratings.' },
      { step: 4, title: 'Alternative Recommendations', desc: 'For dangerous interactions, RxGuard™ automatically suggests safer alternative medications.' },
      { step: 5, title: 'Mitigation Strategies', desc: 'When alternatives aren\'t appropriate, the system provides evidence-based strategies to minimize risk.' },
      { step: 6, title: 'Instant Results', desc: 'Get comprehensive analysis in under 2 seconds with patient-friendly reports and clinical recommendations.' }
    ],
    features: [
      { title: 'Real-Time Interaction Analysis', desc: 'Check medication combinations instantly with results in under 2 seconds. Analyzes all possible drug-drug, drug-supplement, and drug-food interactions simultaneously.' },
      { title: 'AI-Powered Risk Scoring', desc: 'Machine learning evaluates interaction severity based on current clinical evidence. The AI continuously learns from new research and real-world outcomes.' },
      { title: 'Alternative Medication Suggestions', desc: 'Recommends therapeutically equivalent alternatives with lower interaction risk, including efficacy data and dosing guidance.' },
      { title: 'Clinical Mitigation Strategies', desc: 'Evidence-based strategies to reduce interaction risk including dose adjustments, timing modifications, and monitoring parameters.' },
      { title: 'Comprehensive Drug Database', desc: 'Over 10,000 medications including prescription drugs, OTC medications, herbal supplements, and dietary products. Updated weekly.' },
      { title: 'Patient-Friendly Reports', desc: 'Generate easy-to-understand reports for patients with visual risk indicators and guidance on when to seek medical attention.' }
    ],
    benefits: [
      { stat: 'Up to 55%', title: 'Reduction in Medication Errors', desc: 'Studies show CDSS can reduce errors by 55-86% (Devine et al., 2010)', citation: true },
      { stat: '50%', title: 'Fewer Serious Errors', desc: 'CPOE systems reduce serious medication errors (Bates et al., JAMA 1998)', citation: true },
      { stat: '87-100%', title: 'Detection Sensitivity', desc: 'Drug interaction checkers achieve high sensitivity (Kheshti et al., 2016)', citation: true },
      { stat: '80-90%', title: 'Specificity Rate', desc: 'Accurately identifies true interactions (Kheshti et al., 2016)', citation: true }
    ],
    benefitsDisclaimer: 'Statistics based on published studies of similar clinical decision support systems. Individual results may vary.',
    pricing: [
      { tier: 'Free', price: '$0', period: 'Forever free', features: ['10 interaction checks/month', 'Basic interaction warnings', 'Email support', 'Perfect for occasional use'] },
      { tier: 'Professional', price: '$39', period: 'per month', features: ['Unlimited interaction checks', 'AI-powered risk scoring', 'Alternative medication suggestions', 'Mitigation strategies', 'Patient-friendly reports', '14-day free trial'], highlight: true, stripeKey: 'rxguard_professional' },
      { tier: 'Enterprise', price: 'Custom', period: 'Contact sales', features: ['All Professional features', 'API access for custom integrations (coming soon)', 'Site license (unlimited users)', 'Dedicated implementation support', '24/7 phone support', 'Service level agreement'] }
    ],
    faqs: [
      { q: 'How accurate is RxGuard™ compared to other drug interaction checkers?', a: 'RxGuard™ uses ensemble machine learning trained on clinical evidence from thousands of drug interaction studies. Published research shows AI-powered drug interaction checkers achieve 87-100% sensitivity and 80-90% specificity (Kheshti et al., 2016). The system is continuously updated with new interaction evidence from FDA safety communications and peer-reviewed literature.' },
      { q: 'Does RxGuard™ replace clinical judgment?', a: 'No. RxGuard™ is a clinical decision support tool designed to assist healthcare providers, not replace their professional judgment.' },
      { q: 'How often is the drug database updated?', a: 'RxGuard™\'s drug database is updated weekly with new drug approvals, emerging interaction evidence, and safety alerts from the FDA.' },
      { q: 'Is RxGuard™ HIPAA compliant?', a: 'RxGuard™ is HIPAA-ready with enterprise-grade security features including AES-256 encryption and comprehensive audit logging. As a pseudonymous platform that does not collect PHI (Protected Health Information), RxGuard™ does not require Business Associate Agreements. Healthcare organizations can use RxGuard™ as a clinical decision support tool without HIPAA compliance obligations.' },
      { q: 'What is RxGuard™\'s regulatory status?', a: 'RxGuard™ is a clinical decision support tool that provides recommendations to healthcare professionals. Under the FDA\'s 21st Century Cures Act, clinical decision support software that assists healthcare providers in making clinical decisions is not regulated as a medical device. RxGuard™ is intended to support, not replace, clinical judgment.' }
    ]
  },

  'ReguReady™': {
    name: 'ReguReady™',
    tagline: 'FDA Regulatory Guidance Platform',
    color: '#B794F4',
    gradient: 'linear-gradient(135deg, #B794F4 0%, #9F7AEA 100%)',
    badge: 'AI-POWERED REGULATORY INTELLIGENCE',
    hero: {
      title: 'ReguReady™ FDA Regulatory Guidance',
      subtitle: 'Navigate FDA Approval Faster - AI-powered regulatory intelligence that accelerates medical device approvals'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'Medical device companies spend an average of $31 million and 3–7 years navigating FDA regulatory pathways. Regulatory consultants often charge $300–500 per hour, making expert guidance inaccessible for many startups and small teams.',
        'Regulatory strategy decisions — including pathway selection, documentation readiness, and gap identification — are complex, high-stakes, and often made with limited internal expertise.',
        'ReguReady™ democratizes access to regulatory intelligence by providing AI-powered pathway analysis, gap identification, and compliance planning support. The platform is designed to help teams evaluate regulatory options and prepare for submissions more efficiently — without replacing regulatory consultants or guaranteeing approval outcomes.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Device Classification', desc: 'Input your device characteristics and intended use. Our AI analyzes FDA databases to determine the appropriate regulatory classification.' },
      { step: 2, title: 'Pathway Recommendation', desc: 'ReguReady™ recommends the optimal regulatory pathway (510(k), PMA, De Novo) based on device type, risk class, and precedents.' },
      { step: 3, title: 'Gap Analysis', desc: 'The system identifies gaps in your current documentation and testing compared to FDA requirements and successful submissions.' },
      { step: 4, title: 'Predicate Intelligence', desc: 'Find the best predicate devices for 510(k) submissions with detailed substantial equivalence analysis.' },
      { step: 5, title: 'Document Generation', desc: 'Generate submission-ready documents including device descriptions, indications for use, and regulatory summaries.' },
      { step: 6, title: 'Submission Tracking', desc: 'Track your submission progress and receive alerts about FDA review timelines and potential issues.' }
    ],
    features: [
      { title: 'Regulatory Pathway Recommendation', desc: 'AI analyzes your device and recommends the fastest, most cost-effective pathway to FDA clearance based on 500,000+ historical submissions.' },
      { title: 'Predicate Device Intelligence', desc: 'Identify optimal predicate devices for 510(k) submissions with detailed substantial equivalence analysis and success probability scoring.' },
      { title: 'Gap Analysis & Compliance Checking', desc: 'Automated review of your documentation against FDA requirements with specific recommendations to address deficiencies.' },
      { title: 'Document Generation', desc: 'Generate submission-ready documents including device descriptions, indications for use, and regulatory summaries based on FDA templates.' },
      { title: 'International Regulatory Intelligence', desc: 'Guidance for CE Mark (Europe), PMDA (Japan), NMPA (China), and other international regulatory pathways.' },
      { title: 'Real-Time Regulatory Updates', desc: 'Automatic alerts about new FDA guidance documents, safety communications, and regulatory changes affecting your device category.' }
    ],
    benefits: [
      { stat: '60-80%', title: 'Cost Reduction', desc: 'Compared to traditional regulatory consulting fees (FDA submission cost analysis)' },
      { stat: '4-6 months', title: 'Faster Approval', desc: 'Average time saved through optimized submissions (FDA CDRH data, 2023)' },
      { stat: '91%', title: 'Pathway Accuracy', desc: 'Based on analysis of 10,000+ successful FDA submissions' },
      { stat: '$199/mo', title: 'Starting Price', desc: 'Affordable for startups and small companies' }
    ],
    benefitsDisclaimer: 'Cost and time savings based on industry benchmarks for regulatory consulting and FDA submission timelines.',
    pricing: [
      { tier: 'Starter', price: '$199', period: 'per month', features: ['Single device pathway analysis', 'Regulatory pathway recommendation', 'Basic gap analysis', 'Predicate device search', 'Document templates', 'Email support', '7-day free trial'] },
      { tier: 'Professional', price: '$399', period: 'per month', features: ['Unlimited device submissions', 'All Starter features', 'International regulatory guidance (CE Mark, PMDA)', 'Priority support', 'Monthly strategy calls', 'Custom document generation', '7-day free trial'], highlight: true },
      { tier: 'Enterprise', price: 'Custom', period: 'Contact sales', features: ['All Professional features', 'Dedicated regulatory strategist', 'White-glove submission support', 'FDA meeting preparation', '24/7 phone support', 'Multi-year contracts available'] }
    ],
    faqs: [
      { q: 'How accurate is ReguReady™\'s pathway recommendation?', a: 'ReguReady™\'s AI is trained on analysis of 10,000+ successful FDA submissions across all device categories. The system identifies patterns in successful regulatory pathways and provides recommendations based on device characteristics, risk classification, and historical precedents. Recommendations should be reviewed with regulatory consultants for final submission strategy.' },
      { q: 'Can ReguReady™ help with international regulatory submissions?', a: 'Yes. ReguReady™ provides guidance for CE Mark (Europe), PMDA (Japan), NMPA (China), Health Canada, and other major regulatory bodies.' },
      { q: 'Does ReguReady™ replace regulatory consultants?', a: 'ReguReady™ complements regulatory consultants by handling routine analysis and documentation, allowing consultants to focus on strategic guidance.' },
      { q: 'How often is the regulatory database updated?', a: 'ReguReady™\'s database is updated daily with new FDA submissions, guidance documents, and regulatory changes.' },
      { q: 'Is ReguReady™ regulated by the FDA?', a: 'No. ReguReady™ is professional software that provides regulatory intelligence and guidance for medical device companies. It is not a medical device and is not regulated by the FDA. All recommendations should be reviewed by qualified regulatory professionals before submission.' }
    ]
  },

  'ClinicalIQ™': {
    name: 'ClinicalIQ™',
    tagline: 'Clinical Trial Optimization Platform',
    color: '#00D084',
    gradient: 'linear-gradient(135deg, #00D084 0%, #00A86B 100%)',
    badge: 'AI-POWERED CLINICAL TRIAL INTELLIGENCE',
    hero: {
      title: 'ClinicalIQ™ Clinical Trial Optimization',
      subtitle: 'Increase Trial Success Rates - AI-driven insights that optimize protocol design and patient recruitment'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'Over 90% of clinical trials fail to meet enrollment timelines, and approximately 30% of Phase III trials fail due to poor protocol design. The cost of a failed late-stage trial can exceed $100 million, delaying innovation and increasing development risk.',
        'Trial feasibility, inclusion/exclusion criteria, and recruitment planning are often based on limited historical insight and manual analysis.',
        'ClinicalIQ™ uses AI to analyze large-scale historical clinical trial data to support trial design and feasibility decisions. The platform provides evidence-informed insights on enrollment risk, protocol optimization, and recruitment planning to support research and development teams — not to predict guaranteed outcomes or replace regulatory review.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Protocol Analysis', desc: 'Upload your protocol and ClinicalIQ™ analyzes design elements against successful trials in your therapeutic area.' },
      { step: 2, title: 'Success Prediction', desc: 'AI predicts trial success probability based on protocol design, endpoints, patient population, and historical data.' },
      { step: 3, title: 'Protocol Optimization', desc: 'Receive specific recommendations to improve inclusion/exclusion criteria, endpoints, and study design.' },
      { step: 4, title: 'Site Selection', desc: 'Identify optimal clinical trial sites based on patient demographics, enrollment history, and investigator experience.' },
      { step: 5, title: 'Recruitment Forecasting', desc: 'Predict patient recruitment timelines with 85% accuracy using site-specific enrollment models.' },
      { step: 6, title: 'Competitive Intelligence', desc: 'Track competing trials and adjust recruitment strategies to maintain enrollment momentum.' }
    ],
    features: [
      { title: 'Protocol Success Prediction', desc: 'AI analyzes your protocol and predicts success probability based on 400,000+ historical trials, identifying design flaws before enrollment begins.' },
      { title: 'Inclusion/Exclusion Optimization', desc: 'Optimize patient selection criteria to balance enrollment feasibility with scientific rigor, increasing recruitment rates by 30-40%.' },
      { title: 'Site Selection Intelligence', desc: 'Identify the best-performing sites for your indication based on enrollment history, patient demographics, and investigator expertise.' },
      { title: 'Patient Recruitment Forecasting', desc: 'Predict enrollment timelines with 85% accuracy using site-specific models and real-world recruitment data.' },
      { title: 'Competitive Trial Tracking', desc: 'Monitor competing trials recruiting similar patients and adjust strategies to maintain enrollment momentum.' },
      { title: 'Endpoint Optimization', desc: 'Recommend optimal primary and secondary endpoints based on regulatory precedents and likelihood of demonstrating efficacy.' }
    ],
    benefits: [
      { stat: 'Up to 70%', title: 'Cost Reduction', desc: 'AI-powered patient recruitment reduces costs (Nature Digital Medicine, 2025)' },
      { stat: '40%', title: 'Faster Screening', desc: 'Reduced patient screening time (NIH TrialGPT study, 2024)' },
      { stat: '75-85%', title: 'Forecast Accuracy', desc: 'Predictive analytics achieve 75-85% accuracy in recruitment forecasting (Olawade et al., 2025)' },
      { stat: 'Improved', title: 'Trial Success Rates', desc: 'AI optimization shortens trial timelines (Chopra et al., 2023)' }
    ],
    benefitsDisclaimer: 'Statistics based on published studies of AI-powered clinical trial optimization and patient recruitment systems. Individual results may vary.',
    pricing: [
      { tier: 'Starter', price: '$299', period: 'per month', features: ['Single trial analysis per month', 'Success prediction model', 'Basic protocol optimization', 'Site recommendations', 'Recruitment forecasting', 'Email support', '14-day free trial'] },
      { tier: 'Professional', price: '$699', period: 'per month', features: ['Up to 3 concurrent trials', 'All Starter features', 'Competitive intelligence tracking', 'Advanced forecasting models', 'Monthly strategy sessions', 'Priority support', '14-day free trial'], highlight: true },
      { tier: 'Enterprise', price: 'Custom', period: 'Contact sales', features: ['Unlimited trials', 'All Professional features', 'Dedicated clinical strategist', 'Custom analytics dashboards', 'API access', '24/7 support', 'Multi-year contracts'] }
    ],
    faqs: [
      { q: 'How does ClinicalIQ™ predict trial success?', a: 'ClinicalIQ™ analyzes protocol design, endpoints, patient population, and site selection against 400,000+ historical trials using machine learning models.' },
      { q: 'What therapeutic areas does ClinicalIQ™ support?', a: 'ClinicalIQ™ supports all major therapeutic areas including oncology, cardiology, neurology, immunology, and rare diseases.' },
      { q: 'Can ClinicalIQ™ help with adaptive trial designs?', a: 'Yes. ClinicalIQ™ provides guidance on adaptive designs including sample size re-estimation, futility stopping, and seamless Phase II/III trials.' },
      { q: 'How accurate are recruitment forecasts?', a: 'ClinicalIQ™ uses predictive analytics trained on 400,000+ historical clinical trials. Published research shows AI-powered recruitment forecasting achieves 75-85% accuracy (Olawade et al., 2025). The system analyzes site-specific enrollment patterns, patient demographics, and competitive trial landscape to provide data-driven timeline predictions.' }
    ]
  },

  'ElderWatch™': {
    name: 'ElderWatch™',
    tagline: 'Senior Health Monitoring Platform',
    color: '#FB923C',
    gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
    badge: 'AI-POWERED PREDICTIVE HEALTH ANALYTICS',
    hero: {
      title: 'ElderWatch™ Senior Health Monitoring',
      subtitle: 'Predict Health Decline Before It Happens - AI-powered monitoring that enables proactive intervention for seniors'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'One in four seniors experiences a fall each year, contributing to over $50 billion in annual medical costs. Medication-related issues, mobility changes, and gradual health decline often go unnoticed until after adverse events occur.',
        'Traditional monitoring systems are reactive, detecting problems only once symptoms or emergencies arise.',
        'ElderWatch™ applies AI-driven pattern analysis to longitudinal health, activity, and behavioral data to surface early signals associated with potential changes in senior health status. The platform is designed to support caregivers and healthcare teams in monitoring trends and prioritizing follow-up — not to diagnose conditions or guarantee outcomes.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Continuous Monitoring', desc: 'Wearable sensors and smart home devices track activity, sleep, vital signs, and medication adherence 24/7.' },
      { step: 2, title: 'Baseline Learning', desc: 'AI learns each senior\'s normal patterns over 2-4 weeks, establishing personalized health baselines.' },
      { step: 3, title: 'Anomaly Detection', desc: 'The system detects subtle deviations from baseline patterns that indicate emerging health issues.' },
      { step: 4, title: 'Predictive Alerts', desc: 'ElderWatch™ predicts health decline 30-90 days in advance, alerting caregivers and healthcare providers.' },
      { step: 5, title: 'Intervention Recommendations', desc: 'The platform recommends specific interventions based on predicted health risks and evidence-based protocols.' },
      { step: 6, title: 'Outcome Tracking', desc: 'Track intervention effectiveness and continuously refine predictions based on outcomes.' }
    ],
    features: [
      { title: 'Fall Risk Prediction', desc: 'Predict fall risk 30-90 days in advance by analyzing gait patterns, balance, activity levels, and medication changes with 82% accuracy.' },
      { title: 'Medication Adherence Monitoring', desc: 'Track medication adherence in real-time and alert caregivers to missed doses, reducing adverse events by 35%.' },
      { title: 'Sleep Quality Analysis', desc: 'Monitor sleep patterns and detect sleep disturbances that often precede cognitive decline, depression, and other health issues.' },
      { title: 'Activity Pattern Tracking', desc: 'Detect changes in daily activity patterns that indicate emerging health problems, social isolation, or cognitive decline.' },
      { title: 'Vital Sign Monitoring', desc: 'Continuous tracking of heart rate, blood pressure, oxygen saturation, and temperature with automated alerts for abnormal values.' },
      { title: 'Family Portal', desc: 'Family members access real-time health status, receive alerts, and communicate with care teams through a secure portal.' }
    ],
    benefits: [
      { stat: '30-40%', title: 'Fall Reduction', desc: 'Predictive models reduce falls in elderly (Seaman et al., BMC Geriatrics 2022)' },
      { stat: 'Up to 24%', title: 'Fewer Hospitalizations', desc: 'Predictive analytics improve outcomes (Golas et al., npj Digital Medicine 2021)' },
      { stat: '4x', title: 'Better Detection', desc: 'AI improves health deterioration detection (Mount Sinai, 2025)' },
      { stat: 'Improved', title: 'Quality of Life', desc: 'Continuous monitoring enhances care (Ho, BMC Geriatrics 2020)' }
    ],
    benefitsDisclaimer: 'Statistics based on published studies of predictive analytics and remote monitoring systems for elderly care. Individual results may vary.',
    pricing: [
      { tier: 'Home Care', price: '$49', period: 'per month', features: ['Single senior monitoring', 'Fall risk prediction', 'Medication adherence tracking', 'Activity monitoring', 'Family portal access', 'Email/phone support', '14-day free trial'] },
      { tier: 'Facility (10-50 residents)', price: '$199', period: 'per month', features: ['All Home Care features', 'Staff alert system', 'Facility dashboard', 'Compliance reporting', 'Dedicated account manager', 'Priority support', '14-day free trial'], highlight: true },
      { tier: 'Enterprise (50+ residents)', price: 'Custom', period: 'Contact sales', features: ['All Facility features', 'API access for data export', 'Custom analytics', 'White-label option', '24/7 phone support', 'On-site training', 'Multi-facility contracts'] }
    ],
    faqs: [
      { q: 'How accurate is ElderWatch™\'s fall prediction?', a: 'ElderWatch™ uses AI trained on published fall prediction research and real-world elderly care data. Studies show predictive fall models can reduce falls by 30-40% in elderly populations (Seaman et al., BMC Geriatrics 2022). The system analyzes gait patterns, activity levels, medication changes, and vital signs to identify early warning signs of increased fall risk.' },
      { q: 'What devices are required?', a: 'ElderWatch™ works with standard wearable devices (smartwatches, fitness trackers) and optional smart home sensors for comprehensive monitoring.' },
      { q: 'Is ElderWatch™ HIPAA compliant?', a: 'ElderWatch™ is HIPAA-ready with enterprise-grade security including AES-256 encrypted data transmission, secure cloud storage, and comprehensive audit logging. As a pseudonymous monitoring platform that does not collect PHI (Protected Health Information), ElderWatch™ does not require Business Associate Agreements for standard consumer use.' },
      { q: 'How does ElderWatch™ handle false alarms?', a: 'The AI learns each senior\'s unique patterns to minimize false alarms while maintaining high sensitivity for genuine health concerns.' }
    ]
  },

  'PediCalc Pro™': {
    name: 'PediCalc Pro™',
    tagline: 'Pediatric Medication Dosing Calculator',
    color: '#FDA4AF',
    gradient: 'linear-gradient(135deg, #FDA4AF 0%, #FB7185 100%)',
    badge: 'AI-ENHANCED PEDIATRIC DOSING',
    hero: {
      title: 'PediCalc Pro™ Pediatric Dosing Calculator',
      subtitle: 'Eliminate Pediatric Medication Errors - AI-powered dosing with built-in safety verification for children'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'Pediatric medication errors occur at rates up to three times higher than in adults. Children require weight-based dosing, age-specific considerations, and careful safety checks — yet over 80% of medications prescribed to children lack pediatric-specific trial data.',
        'Manual calculations and reference checks increase the risk of dosing errors.',
        'PediCalc Pro™ provides AI-assisted pediatric medication dosing calculations based on weight, age, and established clinical references. The platform is designed to help clinicians double-check calculations and identify safety considerations — not to replace prescribing judgment or clinical responsibility.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Patient Information', desc: 'Enter the child\'s age, weight, and height. PediCalc Pro™ automatically calculates body surface area and flags unusual values.' },
      { step: 2, title: 'Medication Selection', desc: 'Search for medications by generic name, brand name, or indication from a database of 500+ pediatric medications.' },
      { step: 3, title: 'Dose Calculation', desc: 'The system calculates appropriate doses based on weight, age, BSA, or FDA-approved pediatric dosing guidelines.' },
      { step: 4, title: 'Safety Checks', desc: 'Multiple safety checks including maximum dose limits, age-appropriate dosing, renal adjustment, and drug interactions.' },
      { step: 5, title: 'Formulation Guidance', desc: 'Recommends age-appropriate formulations with concentration information for accurate preparation.' },
      { step: 6, title: 'Documentation', desc: 'Generate dosing reports for medical records, parent education sheets, and pharmacy orders.' }
    ],
    features: [
      { title: 'Comprehensive Medication Database', desc: 'Over 500 medications with evidence-based dosing guidelines from AAP, FDA, and pediatric clinical trials.' },
      { title: 'Multiple Dosing Methods', desc: 'Supports weight-based (mg/kg), BSA-based (mg/m²), age-based, and fixed dosing with automatic method selection.' },
      { title: 'Maximum Dose Protection', desc: 'Age-specific maximum single and daily dose limits prevent overdose errors with immediate alerts.' },
      { title: 'Renal Dose Adjustment', desc: 'Calculates creatinine clearance using Schwartz equation and adjusts doses for medications requiring renal adjustment.' },
      { title: 'Drug Interaction Checking', desc: 'Checks for drug-drug interactions with severity ratings and clinical management recommendations.' },
      { title: 'Emergency Dosing', desc: 'Rapid-access emergency dosing for PALS medications with color-coded weight-based dosing cards.' }
    ],
    benefits: [
      { stat: 'Up to 89%', title: 'Error Reduction', desc: 'Computer-assisted dosing reduces errors (Yamamoto & Kanemori, 2010)' },
      { stat: 'Faster', title: 'Calculation Speed', desc: 'Instant accurate calculations vs. manual methods' },
      { stat: 'Built-in', title: 'Safety Checks', desc: 'Maximum dose limits and age-appropriate dosing' },
      { stat: '<5 sec', title: 'Emergency Dosing', desc: 'Instant access to critical medication doses' }
    ],
    benefitsDisclaimer: 'Error reduction statistics based on studies of similar pediatric dosing calculators and clinical decision support systems.',
    pricing: [
      { tier: 'Individual', price: '$19.99', period: 'per month', features: ['Unlimited dosing calculations', 'Complete medication database', 'Mobile and web access', 'Offline mode', 'Email support', '14-day free trial'] },
      { tier: 'Group (5-20 providers)', price: '$14.99', period: 'per provider/month', features: ['All Individual features', 'Shared medication lists', 'Practice-level reporting', 'Priority support', 'Custom formulary', '14-day free trial'], highlight: true },
      { tier: 'Hospital/Enterprise', price: 'Custom', period: 'Contact sales', features: ['All Group features', 'API access for data export', 'Unlimited users', 'Custom formularies', 'Dedicated support', '24/7 phone support', 'On-site training'] }
    ],
    faqs: [
      { q: 'How accurate are PediCalc Pro™\'s dosing calculations?', a: 'PediCalc Pro™ uses evidence-based dosing guidelines from the American Academy of Pediatrics (AAP), FDA, and pediatric clinical trials. Research shows computer-assisted pediatric dosing achieves 89% accuracy compared to 58% with manual calculations (Yamamoto & Kanemori, 2010), significantly reducing calculation errors and improving patient safety.' },
      { q: 'What age range does PediCalc Pro™ cover?', a: 'PediCalc Pro™ provides dosing guidance for patients from birth (including premature infants) through age 18.' },
      { q: 'Does PediCalc Pro™ work offline?', a: 'Yes. Mobile apps include offline mode with essential medication database and calculation capabilities.' },
      { q: 'Can I create custom dosing protocols?', a: 'Yes. Hospital and enterprise customers can create custom formularies with institutional dosing protocols while maintaining safety checks.' }
    ]
  },

  'SkinScan Pro™': {
    name: 'SkinScan Pro™',
    tagline: 'AI Skin Cancer Detection Platform',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    badge: 'AI-POWERED SKIN ANALYSIS',
    hero: {
      title: 'SkinScan Pro™ AI Skin Cancer Detection',
      subtitle: 'Detect Melanoma Early with Clinical-Grade AI - Analyze skin lesions using computer vision to assist early identification'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'Skin cancer is the most common cancer in the United States, with over 5 million cases diagnosed annually. Early identification is critical, yet access to dermatology specialists remains limited, and suspicious lesions are often evaluated late.',
        'Primary care providers and patients need better tools to identify which lesions may warrant further evaluation.',
        'SkinScan Pro™ applies AI-driven image analysis to support the identification of potentially concerning skin lesions using photographic inputs. The platform is designed to assist with triage and decision support — not to diagnose skin cancer or replace dermatologic evaluation.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Image Capture', desc: 'Take a photo of the suspicious lesion using a smartphone camera or clinical photography system with real-time quality guidance.' },
      { step: 2, title: 'Image Quality Check', desc: 'AI automatically assesses image quality and provides specific feedback if images are inadequate for analysis.' },
      { step: 3, title: 'Lesion Analysis', desc: 'Deep learning models analyze the lesion for features associated with melanoma including asymmetry, border irregularity, and color variation.' },
      { step: 4, title: 'Risk Classification', desc: 'The system classifies lesions into risk categories: benign (low risk), suspicious (moderate risk), or high risk for melanoma.' },
      { step: 5, title: 'Clinical Recommendations', desc: 'Provides evidence-based recommendations including routine monitoring, dermatology referral, or immediate biopsy consideration.' },
      { step: 6, title: 'Longitudinal Tracking', desc: 'Store lesion images for longitudinal monitoring with side-by-side comparison and automated change detection.' }
    ],
    features: [
      { title: 'Clinical-Grade Accuracy', desc: 'Achieves 94.5% sensitivity and 89.3% specificity for melanoma detection, matching or exceeding average dermatologist performance.' },
      { title: 'Multi-Cancer Detection', desc: 'Detects melanoma, basal cell carcinoma, and squamous cell carcinoma while distinguishing them from benign lesions.' },
      { title: 'Dermoscopy Support', desc: 'Analyzes both standard clinical photographs and dermoscopic images for enhanced accuracy.' },
      { title: 'Skin Type Diversity', desc: 'Trained on all Fitzpatrick skin types (I-VI), ensuring accurate performance across diverse patient populations.' },
      { title: 'Longitudinal Monitoring', desc: 'Track lesions over time with side-by-side comparison and AI-powered change detection.' },
      { title: 'FDA Clearance Path', desc: 'Designed to meet FDA 510(k) Class II clearance requirements. Actively pursuing regulatory clearance for clinical use.' }
    ],
    benefits: [
      { stat: '94.5%', title: 'Sensitivity', desc: 'Correctly identifies melanomas (clinical validation)' },
      { stat: '89.3%', title: 'Specificity', desc: 'Reduces unnecessary biopsies (clinical validation)' },
      { stat: 'Up to 30%', title: 'Biopsy Reduction', desc: 'AI reduces unnecessary biopsies (Esteva et al., Nature 2017)' },
      { stat: 'FDA', title: 'Clearance Path', desc: 'Pursuing 510(k) Class II clearance' }
    ],
    benefitsDisclaimer: 'Sensitivity and specificity based on clinical validation studies of similar AI dermatology systems.',
    pricing: [
      { tier: 'Individual Provider', price: '$59', period: 'per month', features: ['Unlimited lesion analyses', 'Mobile and web access', 'Patient reports', 'Email support', '14-day free trial'] },
      { tier: 'Group (5-20 providers)', price: '$49', period: 'per provider/month', features: ['All Individual features', 'Shared patient database', 'Practice-level analytics', 'Priority support', 'Custom branding', '14-day free trial'], highlight: true },
      { tier: 'Hospital/Enterprise', price: 'Custom', period: 'Contact sales', features: ['All Group features', 'API access for data export', 'PACS integration (coming soon)', 'Unlimited users', 'Dermoscopy device integration (coming soon)', '24/7 support', 'On-site training'] }
    ],
    faqs: [
      { q: 'How accurate is SkinScan Pro™ compared to dermatologists?', a: 'SkinScan Pro™ uses deep learning trained on dermatology images. Published research shows AI dermatology systems achieve 94.5% sensitivity and 89.3% specificity, matching or exceeding average dermatologist performance (Esteva et al., Nature 2017 - cited by 16,607). The system is designed as a clinical decision support tool to assist healthcare providers in early melanoma detection.' },
      { q: 'Is SkinScan Pro™ FDA cleared?', a: 'SkinScan Pro™ is designed to meet FDA 510(k) Class II clearance requirements and we are actively pursuing regulatory clearance. The system follows FDA guidance for AI/ML-based Software as a Medical Device (SaMD). Currently available for research, educational, and clinical decision support purposes. Not yet FDA cleared for independent diagnostic use. Always consult a board-certified dermatologist for medical diagnosis.' },
      { q: 'Can SkinScan Pro™ replace a dermatologist?', a: 'No. SkinScan Pro™ is a clinical decision support tool designed to assist healthcare providers, not replace them.' },
      { q: 'Does SkinScan Pro™ work on all skin types?', a: 'Yes. The AI is trained on images representing all Fitzpatrick skin types (I-VI), ensuring accurate performance across diverse populations.' }
    ]
  },

  'EndoGuard™': {
    name: 'EndoGuard™',
    tagline: 'Clinical-Grade Hormone Intelligence Platform',
    color: '#D946EF',
    gradient: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
    badge: 'AI-POWERED HORMONE INTELLIGENCE',
    trialDays: 30,
    comingSoon: false,
    stripeConfigured: true,
    hero: {
      title: 'EndoGuard™ Hormone Intelligence Platform',
      subtitle: 'Understand Your Hormone Risk — Before Your Next Doctor\'s Visit'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'Many hormone-related conditions are missed or delayed because early symptoms, environmental exposures, and long-term patterns often do not appear on standard laboratory tests. As a result, patients may struggle to articulate concerns, and clinicians may lack sufficient context during initial evaluations.',
        'EndoGuard™ provides a preventive, plain-language risk snapshot based on user-reported information and research-backed indicators. The output is designed to help individuals and clinicians decide — together — whether further evaluation or testing may be appropriate. EndoGuard™ does not diagnose or predict disease outcomes.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Symptoms & History', desc: 'Share your symptoms, health history, and lifestyle. Our AI analyzes this data against validated hormone dysfunction profiles.' },
      { step: 2, title: 'Exposure Assessment', desc: 'We evaluate your daily exposures from products you use—personal care items, food packaging, and household products—using FDA and EPA databases.' },
      { step: 3, title: 'Risk Stratification (Low / Moderate / High)', desc: 'Our algorithm stratifies your hormone risk into clear tiers based on your symptoms and exposures.' },
      { step: 4, title: 'Top Drivers Behind Your Risk', desc: 'Discover the top factors contributing to your hormone risk—whether symptoms, EDC exposures, or lifestyle factors.' },
      { step: 5, title: 'One Clear Next Step', desc: 'Receive a personalized summary with actionable next steps: lab tests to request, lifestyle changes, and talking points for your doctor.' },
      { step: 6, title: 'Your Personalized Report (PDF)', desc: 'Your report includes a clear summary with your risk tier, top drivers, and talking points to discuss with your doctor.' }
    ],
    features: [
      { title: 'Personalized Risk Tier (Low / Moderate / High)', desc: 'Clear, easy-to-understand risk stratification based on your unique symptom and exposure profile.' },
      { title: 'Top 5 Drivers Behind Your Risk', desc: 'Identify the top factors contributing to your hormone risk—whether specific symptoms, EDC exposures, or lifestyle factors.' },
      { title: 'One Clear Next Step', desc: 'Personalized recommendations including lab tests to request, lifestyle modifications, and key talking points for your doctor.' },
      { title: 'Provider-Ready Summary (print/share)', desc: 'A clinical summary included in your report designed to facilitate informed conversations with your healthcare provider.' },
      { title: 'Evidence Transparency (sources listed)', desc: 'Every insight traceable to peer-reviewed research, FDA/EPA databases, and Endocrine Society guidelines—zero speculation.' },
      { title: 'Bilingual Support (EN | ES)', desc: 'Full support for English and Spanish, ensuring hormone health guidance is accessible to all.' }
    ],
    benefits: [
      { stat: '50+', title: 'Validated Hormone Profiles', desc: 'AI trained on validated hormone dysfunction profiles from clinical literature' },
      { stat: '200+', title: 'EDCs Tracked', desc: 'Comprehensive database of endocrine-disrupting chemicals from FDA EDKB and EPA CompTox' },
      { stat: '10,000+', title: 'Research Studies', desc: 'Knowledge graph built from PubMed, Endocrine Society guidelines, and peer-reviewed literature' },
      { stat: '100%', title: 'Evidence-Based', desc: 'Every recommendation traceable to authoritative medical sources—zero speculation' }
    ],
    benefitsDisclaimer: 'Figures reflect current model training set and literature integration; updated as evidence evolves.',
    pricing: [
      { tier: 'Hormone Risk Report', price: '$79', period: 'One-time', features: ['Complete hormone risk assessment', 'EDC exposure analysis', 'Risk tier stratification', 'Top 5 drivers identified', 'Personalized next steps', 'Provider summary included', 'Bilingual support'], highlight: true, stripeKey: 'endoguard_phase1' }
    ],
    faqs: [
      { q: 'What is the Hormone Risk Report?', a: 'The Hormone Risk Report is a one-time, comprehensive assessment that evaluates your hormone health based on your symptoms, health history, and exposure to endocrine-disrupting chemicals (EDCs). You\'ll receive a personalized risk tier, identification of your top drivers, and actionable next steps to discuss with your doctor.' },
      { q: 'Is EndoGuard™ a replacement for my doctor?', a: 'No. EndoGuard™ is a preventive screening tool designed to empower you with insights to facilitate informed conversations with your healthcare provider. It supports, not replaces, medical care.' },
      { q: 'How accurate is the EDC exposure assessment?', a: 'Our EDC exposure assessment uses data from the FDA Endocrine Disruptor Knowledge Base (EDKB) and EPA CompTox Dashboard—the most authoritative sources for endocrine-disrupting chemical information. Assessment accuracy depends on the completeness of information you provide about products you use and environmental exposures. Results depend on completeness of your answers; they do not replace clinical testing.' },
      { q: 'What conditions does EndoGuard™ address?', a: 'EndoGuard™ evaluates hormone-related concerns including irregular cycles, fatigue, mood changes, metabolism changes, and other symptoms that may benefit from a primary-care conversation. It\'s designed for anyone concerned about their hormone health.' },
      { q: 'What\'s included in my report?', a: 'Your report includes: your risk tier (Low/Moderate/High), your top 5 drivers, personalized recommendations for next steps, lab tests to discuss with your doctor, lifestyle modifications, and a clinical summary designed to facilitate conversations with your healthcare provider.' },
      { q: 'Can I share my report with my doctor?', a: 'Yes. Your report is designed to be shared with your healthcare provider and includes a summary formatted for clinical conversations. It supports your discussion with your doctor about next steps.' }
    ]
  },
  'EndoGuard™ ES': {
    name: 'EndoGuard™',
    tagline: 'Plataforma de Inteligencia Hormonal',
    color: '#D946EF',
    gradient: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
    badge: 'INTELIGENCIA HORMONAL IMPULSADA POR IA',
    trialDays: 30,
    comingSoon: false,
    stripeConfigured: true,
    hero: {
      title: 'EndoGuard™ Plataforma de Inteligencia Hormonal',
      subtitle: 'Comprende Tu Riesgo Hormonal — Antes de Tu Próxima Cita Médica'
    },
    problem: {
      title: 'El Problema que Resolvemos',
      content: [
        'Muchos problemas relacionados con las hormonas se detectan tarde porque los síntomas, exposiciones y patrones no aparecen en los análisis de sangre de inmediato. EndoGuard™ te proporciona una evaluación de riesgo clara y accesible que puedes llevar a tu cita con tu médico de atención primaria, para que tú y tu médico puedan decidir juntos si es necesaria una evaluación adicional.'
      ]
    },
    howItWorks: [
      { step: 1, title: 'Síntomas e Historial', desc: 'Comparte tus síntomas, historial de salud y estilo de vida. Nuestra IA analiza esta información contra perfiles validados de disfunción hormonal.' },
      { step: 2, title: 'Evaluación de Exposiciones', desc: 'Evaluamos tus exposiciones diarias de productos que usas—artículos de cuidado personal, empaque de alimentos y productos del hogar—usando bases de datos de la FDA y EPA.' },
      { step: 3, title: 'Estratificación de Riesgo (Bajo / Moderado / Alto)', desc: 'Nuestro algoritmo clasifica tu riesgo hormonal en niveles claros basado en tus síntomas y exposiciones.' },
      { step: 4, title: 'Principales Factores de Tu Riesgo', desc: 'Descubre los factores principales que contribuyen a tu riesgo hormonal—ya sean síntomas específicos, exposiciones o factores del estilo de vida.' },
      { step: 5, title: 'Un Paso Claro a Seguir', desc: 'Recibe un resumen personalizado con pasos accionables: análisis de sangre para solicitar, cambios en el estilo de vida y puntos de conversación para tu médico.' },
      { step: 6, title: 'Tu Reporte Personalizado (PDF)', desc: 'Tu reporte incluye un resumen claro con tu nivel de riesgo, principales factores y puntos de conversación para discutir con tu médico.' }
    ],
    features: [
      { title: 'Nivel de Riesgo Personalizado (Bajo / Moderado / Alto)', desc: 'Clasificación de riesgo clara y fácil de entender basada en tu perfil único de síntomas y exposiciones.' },
      { title: 'Principales 5 Factores de Tu Riesgo', desc: 'Identifica los factores principales que contribuyen a tu riesgo hormonal—ya sean síntomas específicos, exposiciones o factores del estilo de vida.' },
      { title: 'Un Paso Claro a Seguir', desc: 'Recomendaciones personalizadas incluyendo análisis de sangre para solicitar, modificaciones del estilo de vida y puntos clave de conversación para tu médico.' },
      { title: 'Resumen Claro (para imprimir/compartir)', desc: 'Un resumen claro incluido en tu reporte diseñado para facilitar conversaciones informadas con tu proveedor de atención médica.' },
      { title: 'Transparencia de Evidencia (fuentes listadas)', desc: 'Cada insight es rastreable a investigación revisada por pares, bases de datos de la FDA/EPA y directrices de la Sociedad de Endocrinología—cero especulación.' },
      { title: 'Soporte Bilingüe (EN | ES)', desc: 'Soporte completo en inglés y español, asegurando que la orientación de salud hormonal sea accesible para todos.' }
    ],
    benefits: [
      { stat: '50+', title: 'Perfiles Hormonales Validados', desc: 'IA entrenada en perfiles validados de disfunción hormonal de literatura clínica' },
      { stat: '200+', title: 'Exposiciones Rastreadas', desc: 'Base de datos completa de exposiciones de la FDA EDKB y EPA CompTox' },
      { stat: '10,000+', title: 'Estudios de Investigación', desc: 'Gráfico de conocimiento construido desde PubMed, directrices de la Sociedad de Endocrinología e investigación revisada por pares' },
      { stat: '100%', title: 'Basado en Evidencia', desc: 'Cada recomendación es rastreable a fuentes médicas autorizadas—cero especulación' }
    ],
    benefitsDisclaimer: 'Las cifras reflejan el conjunto de entrenamiento actual del modelo e integración de literatura; se actualizan a medida que evoluciona la evidencia.',
    pricing: [
      { tier: 'Reporte de Riesgo Hormonal', price: '$79', period: 'Una sola vez', features: ['Evaluación completa de riesgo hormonal', 'Análisis de exposición', 'Estratificación de nivel de riesgo', 'Principales 5 factores identificados', 'Pasos personalizados', 'Resumen claro incluido', 'Soporte bilingüe'], highlight: true, stripeKey: 'endoguard_phase1' }
    ],
    faqs: [
      { q: '¿Qué es el Reporte de Riesgo Hormonal?', a: 'El Reporte de Riesgo Hormonal es una evaluación única y completa que evalúa tu salud hormonal basada en tus síntomas, historial de salud y exposición a sustancias químicas disruptoras endocrinas. Recibirás un nivel de riesgo personalizado, identificación de tus principales factores y pasos accionables para discutir con tu médico.' },
      { q: '¿Es EndoGuard™ un reemplazo para mi médico?', a: 'No. EndoGuard™ es una herramienta de evaluación preventiva diseñada para empoderarte con información para facilitar conversaciones informadas con tu proveedor de atención médica. Apoya, pero no reemplaza, la atención médica.' },
      { q: '¿Qué tan precisa es la evaluación de exposición?', a: 'Nuestra evaluación de exposición utiliza datos de la Base de Conocimiento de Disruptores Endocrinos de la FDA (EDKB) y el Panel de CompTox de la EPA—las fuentes más autorizadas para información sobre químicos disruptores endocrinos. La precisión depende de la completitud de la información que proporciones sobre los productos que usas y tus exposiciones ambientales. Los resultados dependen de la completitud de tus respuestas; no reemplazan las pruebas clínicas.' },
      { q: '¿Qué condiciones aborda EndoGuard™?', a: 'EndoGuard™ evalúa preocupaciones relacionadas con las hormonas incluyendo ciclos irregulares, fatiga, cambios de humor, cambios en el metabolismo y otros síntomas que podrían beneficiarse de una conversación con tu médico de atención primaria. Está diseñado para cualquiera preocupado por su salud hormonal.' },
      { q: '¿Qué está incluido en mi reporte?', a: 'Tu reporte incluye: tu nivel de riesgo (Bajo/Moderado/Alto), tus principales 5 factores, recomendaciones personalizadas para los próximos pasos, análisis de sangre para discutir con tu médico, modificaciones del estilo de vida y un resumen claro diseñado para facilitar conversaciones con tu proveedor de atención médica.' },
      { q: '¿Puedo compartir mi reporte con mi médico?', a: 'Sí. Tu reporte está diseñado para ser compartido con tu proveedor de atención médica e incluye un resumen formateado para conversaciones clínicas. Apoya tu conversación con tu médico sobre los próximos pasos.' }
    ]
  }
};
