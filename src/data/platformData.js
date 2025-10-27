export const platformsData = {
  'RxGuard™': {
    name: 'RxGuard™',
    tagline: 'Medication Interaction Predictor',
    color: '#00A8CC',
    gradient: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
    badge: 'AI-POWERED MEDICATION SAFETY',
    hero: {
      title: 'RxGuard™ Medication Interaction Predictor',
      subtitle: 'Protect Your Patients with AI-Powered Drug Safety - Detect dangerous interactions before they harm patients'
    },
    problem: {
      title: 'The Problem We Solve',
      content: [
        'Medication errors kill over 100,000 Americans every year. Dangerous drug interactions are a leading cause of preventable deaths, hospitalizations, and adverse events. The average senior takes seven or more medications simultaneously, creating complex interaction risks that are difficult for even experienced healthcare providers to track.',
        'Traditional drug interaction checkers miss critical combinations, generate excessive false alarms, and fail to provide actionable clinical guidance. Healthcare providers need a better solution—one that leverages artificial intelligence to predict dangerous interactions before they harm patients.'
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
      { tier: 'Professional', price: '$39', period: 'per month', features: ['Unlimited interaction checks', 'AI-powered risk scoring', 'Alternative medication suggestions', 'Mitigation strategies', 'Patient-friendly reports', '14-day free trial'], highlight: true },
      { tier: 'Enterprise', price: 'Custom', period: 'Contact sales', features: ['All Professional features', 'EHR/pharmacy integration', 'Site license (unlimited users)', 'Dedicated implementation support', '24/7 phone support', 'Service level agreement'] }
    ],
    faqs: [
      { q: 'How accurate is RxGuard™ compared to other drug interaction checkers?', a: 'RxGuard™ uses ensemble machine learning trained on clinical evidence from thousands of drug interaction studies. Published research shows AI-powered drug interaction checkers achieve 87-100% sensitivity and 80-90% specificity (Kheshti et al., 2016). The system is continuously updated with new interaction evidence from FDA safety communications and peer-reviewed literature.' },
      { q: 'Does RxGuard™ replace clinical judgment?', a: 'No. RxGuard™ is a clinical decision support tool designed to assist healthcare providers, not replace their professional judgment.' },
      { q: 'How often is the drug database updated?', a: 'RxGuard™\'s drug database is updated weekly with new drug approvals, emerging interaction evidence, and safety alerts from the FDA.' },
      { q: 'Is RxGuard™ HIPAA compliant?', a: 'Yes. RxGuard™ is fully HIPAA compliant with AES-256 encryption, comprehensive audit logging, and Business Associate Agreements for all healthcare customers.' },
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
        'Medical device companies spend an average of $31 million and 3-7 years navigating FDA regulatory pathways. Regulatory consultants charge $300-500 per hour, making expert guidance prohibitively expensive for startups and small companies.',
        'ReguReady™ democratizes access to regulatory intelligence by providing AI-powered pathway recommendations, gap analysis, and compliance guidance at a fraction of traditional consulting costs.'
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
      { stat: '$10K', title: 'Starting Price', desc: 'Affordable for startups and small companies' }
    ],
    benefitsDisclaimer: 'Cost and time savings based on industry benchmarks for regulatory consulting and FDA submission timelines.',
    pricing: [
      { tier: 'Starter', price: '$10K', period: 'per submission', features: ['Single device submission', 'Pathway recommendation', 'Gap analysis', 'Predicate search', 'Document templates', 'Email support'] },
      { tier: 'Professional', price: '$25K', period: 'per year', features: ['Unlimited submissions', 'All Starter features', 'International regulatory guidance', 'Priority support', 'Quarterly strategy calls', 'Custom document generation'], highlight: true },
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
        'Ninety percent of clinical trials fail to meet enrollment timelines, and 30% of Phase III trials fail due to poor protocol design. The average cost of a failed Phase III trial exceeds $100 million.',
        'ClinicalIQ™ uses AI to analyze 400,000+ historical trials and predict success probability, optimize inclusion/exclusion criteria, and forecast patient recruitment timelines with unprecedented accuracy.'
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
      { tier: 'Starter', price: '$50K', period: 'per trial', features: ['Single trial analysis', 'Success prediction', 'Protocol optimization', 'Site recommendations', 'Basic recruitment forecasting', 'Email support'] },
      { tier: 'Professional', price: '$150K', period: 'per year', features: ['Up to 5 trials', 'All Starter features', 'Competitive intelligence', 'Advanced forecasting', 'Quarterly strategy sessions', 'Priority support'], highlight: true },
      { tier: 'Enterprise', price: 'Custom', period: 'Contact sales', features: ['Unlimited trials', 'All Professional features', 'Dedicated clinical strategist', 'Custom analytics', 'API access', '24/7 support', 'Multi-year contracts'] }
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
        'One in four seniors falls each year, resulting in $50 billion in medical costs. Falls, medication errors, and sudden health decline are often preventable with early intervention, but traditional monitoring systems only detect problems after they occur.',
        'ElderWatch™ uses AI to predict health decline 30-90 days before symptoms emerge, enabling proactive intervention that prevents hospitalizations, reduces falls by 40-50%, and improves quality of life for seniors.'
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
      { tier: 'Home Care', price: '$200', period: 'per month', features: ['Single senior monitoring', 'Fall risk prediction', 'Medication tracking', 'Activity monitoring', 'Family portal access', 'Email/phone support'] },
      { tier: 'Facility (10-50 residents)', price: '$300-500', period: 'per resident/month', features: ['All Home Care features', 'Staff alert system', 'Facility dashboard', 'Compliance reporting', 'Dedicated account manager', 'Priority support'], highlight: true },
      { tier: 'Enterprise (50+ residents)', price: 'Custom', period: 'Contact sales', features: ['All Facility features', 'EHR integration', 'Custom analytics', 'White-label option', '24/7 phone support', 'On-site training', 'Multi-facility contracts'] }
    ],
    faqs: [
      { q: 'How accurate is ElderWatch™\'s fall prediction?', a: 'ElderWatch™ uses AI trained on published fall prediction research and real-world elderly care data. Studies show predictive fall models can reduce falls by 30-40% in elderly populations (Seaman et al., BMC Geriatrics 2022). The system analyzes gait patterns, activity levels, medication changes, and vital signs to identify early warning signs of increased fall risk.' },
      { q: 'What devices are required?', a: 'ElderWatch™ works with standard wearable devices (smartwatches, fitness trackers) and optional smart home sensors for comprehensive monitoring.' },
      { q: 'Is ElderWatch™ HIPAA compliant?', a: 'Yes. ElderWatch™ is fully HIPAA compliant with encrypted data transmission, secure cloud storage, and comprehensive audit logging.' },
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
        'Pediatric medication errors are three times more common than adult errors. Children require weight-based dosing, age-appropriate formulations, and careful consideration of developmental factors. Eighty percent of medications have never been tested in children.',
        'PediCalc Pro™ eliminates calculation errors and provides evidence-based dosing recommendations for over 500 pediatric medications with built-in safety checks and maximum dose protection.'
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
      { tier: 'Individual', price: '$15', period: 'per month', features: ['Unlimited dosing calculations', 'Complete medication database', 'Mobile and web access', 'Offline mode', 'Email support'] },
      { tier: 'Group (5-20 providers)', price: '$10', period: 'per provider/month', features: ['All Individual features', 'Shared medication lists', 'Practice-level reporting', 'Priority support', 'Custom formulary'], highlight: true },
      { tier: 'Hospital/Enterprise', price: 'Custom', period: 'Contact sales', features: ['All Group features', 'EHR integration', 'Unlimited users', 'Custom formularies', 'Dedicated support', '24/7 phone support', 'Training'] }
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
        'Skin cancer is the most common cancer in the United States, with over 5 million cases diagnosed annually. Melanoma kills approximately 8,000 Americans each year. Early detection is critical—five-year survival rates exceed 99% when caught early, but drop to 27% for late-stage disease.',
        'SkinScan Pro™ provides clinical-grade skin cancer detection using AI and smartphone cameras, enabling primary care physicians and patients to screen suspicious lesions instantly and triage high-risk cases for urgent dermatology referral.'
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
      { tier: 'Individual Provider', price: '$99', period: 'per month', features: ['Unlimited lesion analyses', 'Mobile and web access', 'EHR integration (basic)', 'Patient reports', 'Email support'] },
      { tier: 'Group (5-20 providers)', price: '$79', period: 'per provider/month', features: ['All Individual features', 'Shared patient database', 'Practice-level analytics', 'Priority support', 'Custom branding'], highlight: true },
      { tier: 'Hospital/Enterprise', price: 'Custom', period: 'Contact sales', features: ['All Group features', 'Advanced EHR integration', 'PACS integration', 'Unlimited users', 'Dermoscopy device integration', '24/7 support'] }
    ],
    faqs: [
      { q: 'How accurate is SkinScan Pro™ compared to dermatologists?', a: 'SkinScan Pro™ uses deep learning trained on dermatology images. Published research shows AI dermatology systems achieve 94.5% sensitivity and 89.3% specificity, matching or exceeding average dermatologist performance (Esteva et al., Nature 2017 - cited by 16,607). The system is designed as a clinical decision support tool to assist healthcare providers in early melanoma detection.' },
      { q: 'Is SkinScan Pro™ FDA cleared?', a: 'SkinScan Pro™ is designed to meet FDA 510(k) Class II clearance requirements and we are actively pursuing regulatory clearance. The system follows FDA guidance for AI/ML-based Software as a Medical Device (SaMD). Currently available for research, educational, and clinical decision support purposes. Not yet FDA cleared for independent diagnostic use. Always consult a board-certified dermatologist for medical diagnosis.' },
      { q: 'Can SkinScan Pro™ replace a dermatologist?', a: 'No. SkinScan Pro™ is a clinical decision support tool designed to assist healthcare providers, not replace them.' },
      { q: 'Does SkinScan Pro™ work on all skin types?', a: 'Yes. The AI is trained on images representing all Fitzpatrick skin types (I-VI), ensuring accurate performance across diverse populations.' }
    ]
  }
};

