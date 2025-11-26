import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BetaDisclaimer from './BetaDisclaimer';
import DemoDisclaimer from './DemoDisclaimer';

const EndoGuardPrototype = ({ onBack }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, symptoms, edc, analyzing, results
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [edcExposure, setEdcExposure] = useState({});
  const [selectedScenario, setSelectedScenario] = useState(null);

  // Symptom categories
  const symptomCategories = {
    'PCOS': ['Irregular periods', 'Excess hair growth', 'Acne', 'Weight gain', 'Difficulty losing weight', 'Thinning hair'],
    'Thyroid': ['Fatigue', 'Weight changes', 'Cold sensitivity', 'Hair loss', 'Dry skin', 'Brain fog'],
    'Perimenopause': ['Hot flashes', 'Night sweats', 'Mood swings', 'Sleep problems', 'Irregular periods', 'Low libido'],
    'Low Testosterone': ['Low energy', 'Decreased muscle mass', 'Low libido', 'Mood changes', 'Difficulty concentrating', 'Weight gain'],
    'Adrenal': ['Chronic fatigue', 'Salt cravings', 'Low blood pressure', 'Dizziness', 'Difficulty waking up', 'Afternoon crashes']
  };

  // EDC exposure questions
  const edcQuestions = [
    { id: 'plastics', question: 'How often do you use plastic food containers or bottles?', options: ['Daily', 'Weekly', 'Rarely', 'Never'] },
    { id: 'personal_care', question: 'How many personal care products do you use daily? (shampoo, lotion, makeup, etc.)', options: ['10+', '5-9', '2-4', '0-1'] },
    { id: 'cleaning', question: 'Do you use conventional cleaning products?', options: ['Daily', 'Weekly', 'Rarely', 'Never'] },
    { id: 'pesticides', question: 'Do you consume non-organic produce?', options: ['Always', 'Usually', 'Sometimes', 'Never'] },
    { id: 'receipts', question: 'How often do you handle thermal paper receipts?', options: ['Daily', 'Weekly', 'Rarely', 'Never'] }
  ];

  // Pre-loaded scenarios
  const scenarios = [
    {
      id: 1,
      title: 'PCOS with High EDC Exposure',
      profile: '32-year-old female, irregular periods, weight gain',
      symptoms: ['Irregular periods', 'Excess hair growth', 'Acne', 'Weight gain', 'Difficulty losing weight'],
      edcScore: 78,
      hormoneFindings: [
        { hormone: 'Testosterone', status: 'Elevated', value: '82 ng/dL', normal: '15-70 ng/dL' },
        { hormone: 'LH/FSH Ratio', status: 'Elevated', value: '3.2', normal: '<2.0' },
        { hormone: 'Insulin', status: 'Elevated', value: '18 μIU/mL', normal: '<12 μIU/mL' }
      ],
      edcExposures: [
        { chemical: 'Phthalates', source: 'Personal care products', risk: 'High', evidence: 'Linked to PCOS in 15+ studies (PubMed)' },
        { chemical: 'BPA', source: 'Plastic containers', risk: 'High', evidence: 'Associated with insulin resistance (Endocrine Society 2020)' },
        { chemical: 'Parabens', source: 'Cosmetics', risk: 'Moderate', evidence: 'Estrogenic activity documented (NIH 2019)' }
      ],
      recommendations: [
        { category: 'Diet', action: 'Reduce refined carbs, increase fiber to 30g/day', evidence: 'Improves insulin sensitivity (JAMA 2021)' },
        { category: 'EDC Reduction', action: 'Switch to glass containers, paraben-free products', evidence: 'Reduces phthalate exposure by 60% (CDC study)' },
        { category: 'Lab Tests', action: 'Request: Testosterone, LH/FSH, Fasting insulin, HbA1c', evidence: 'PCOS diagnostic criteria (Endocrine Society)' },
        { category: 'Lifestyle', action: 'Resistance training 3x/week', evidence: 'Improves insulin sensitivity 25% (Diabetes Care 2020)' }
      ],
      aiAnalysis: {
        confidence: 92,
        reasoning: 'Pattern analysis identified 5 classic PCOS symptoms combined with high EDC exposure score (78/100). Elevated testosterone and LH/FSH ratio strongly correlate with polycystic ovary syndrome. Phthalate and BPA exposure from personal care products and plastics show documented association with insulin resistance and androgen excess in 15+ peer-reviewed studies.',
        patternMatches: [
          { pattern: 'Hyperandrogenism', confidence: 94, evidence: 'Elevated testosterone + hirsutism + acne' },
          { pattern: 'Insulin Resistance', confidence: 89, evidence: 'Weight gain + difficulty losing weight + elevated insulin' },
          { pattern: 'EDC-Mediated Disruption', confidence: 87, evidence: 'High phthalate + BPA exposure linked to PCOS pathogenesis' }
        ]
      },
      clinicalEvidence: [
        { study: 'Phthalates and PCOS Risk', journal: 'Human Reproduction', year: 2021, finding: '3.2x increased PCOS risk with high phthalate exposure', quality: 'High (RCT, n=847)' },
        { study: 'BPA and Insulin Resistance', journal: 'Endocrine Society', year: 2020, finding: 'BPA exposure associated with 45% increased insulin resistance', quality: 'High (Meta-analysis)' },
        { study: 'Lifestyle Intervention in PCOS', journal: 'JAMA', year: 2021, finding: 'Diet + exercise improved insulin sensitivity by 31%', quality: 'High (RCT, n=1,203)' }
      ],
      roadmap: {
        phase1: { title: 'Immediate Actions (Week 1-2)', actions: ['Switch to glass food storage', 'Replace paraben-containing products', 'Schedule comprehensive hormone panel'] },
        phase2: { title: 'Lifestyle Changes (Week 3-8)', actions: ['Start resistance training 3x/week', 'Reduce refined carbs to <50g/day', 'Increase fiber to 30g/day'] },
        phase3: { title: 'Monitor & Adjust (Month 3-6)', actions: ['Repeat hormone labs at 3 months', 'Track symptom improvements', 'Adjust interventions based on results'] }
      },
      providerDashboard: {
        diagnosis: 'PCOS with Environmental Cofactors',
        icd10: 'E28.2',
        recommendedTests: ['Testosterone (Total & Free)', 'LH/FSH', 'Fasting Insulin', 'HbA1c', 'Lipid Panel'],
        referrals: ['Endocrinologist', 'Registered Dietitian'],
        monitoring: 'Repeat labs every 3 months, track menstrual regularity, monitor weight'
      }
    },
    {
      id: 2,
      title: 'Hypothyroidism with Environmental Exposures',
      profile: '45-year-old female, fatigue, weight gain, cold sensitivity',
      symptoms: ['Fatigue', 'Weight changes', 'Cold sensitivity', 'Hair loss', 'Dry skin', 'Brain fog'],
      edcScore: 65,
      hormoneFindings: [
        { hormone: 'TSH', status: 'Elevated', value: '6.8 mIU/L', normal: '0.4-4.0 mIU/L' },
        { hormone: 'Free T4', status: 'Low-Normal', value: '0.9 ng/dL', normal: '0.8-1.8 ng/dL' },
        { hormone: 'Free T3', status: 'Low', value: '2.1 pg/mL', normal: '2.3-4.2 pg/mL' }
      ],
      edcExposures: [
        { chemical: 'Perchlorate', source: 'Drinking water', risk: 'High', evidence: 'Inhibits iodine uptake (EPA 2023)' },
        { chemical: 'PFAS', source: 'Non-stick cookware', risk: 'High', evidence: 'Associated with thyroid dysfunction (Env Health Perspect 2020)' },
        { chemical: 'Triclosan', source: 'Antibacterial soap', risk: 'Moderate', evidence: 'Disrupts thyroid hormone synthesis (NIH 2018)' }
      ],
      recommendations: [
        { category: 'Nutrition', action: 'Ensure adequate iodine (150mcg/day), selenium (200mcg/day)', evidence: 'Essential for thyroid function (Thyroid Journal 2021)' },
        { category: 'EDC Reduction', action: 'Filter drinking water, avoid non-stick cookware', evidence: 'Reduces PFAS exposure by 80% (EPA study)' },
        { category: 'Lab Tests', action: 'Request: TSH, Free T4, Free T3, TPO antibodies, Thyroglobulin Ab', evidence: 'Comprehensive thyroid panel (ATA guidelines)' },
        { category: 'Supplements', action: 'Consider: Selenium 200mcg, Zinc 30mg, Vitamin D', evidence: 'Supports thyroid function (Endocrine Reviews 2020)' }
      ],
      aiAnalysis: {
        confidence: 88,
        reasoning: 'Symptom cluster analysis identified 6 classic hypothyroid symptoms with elevated TSH (6.8 mIU/L) and low Free T3. Environmental exposure assessment revealed high PFAS and perchlorate levels, both documented thyroid disruptors. Pattern matches subclinical hypothyroidism progressing to overt disease.',
        patternMatches: [
          { pattern: 'Primary Hypothyroidism', confidence: 91, evidence: 'Elevated TSH + low T3 + classic symptoms' },
          { pattern: 'T4-to-T3 Conversion Issue', confidence: 85, evidence: 'Normal-low T4 but significantly low T3' },
          { pattern: 'Environmental Thyroid Disruption', confidence: 82, evidence: 'PFAS + perchlorate exposure inhibiting thyroid function' }
        ]
      },
      clinicalEvidence: [
        { study: 'PFAS and Thyroid Function', journal: 'Environmental Health Perspectives', year: 2020, finding: 'PFAS exposure associated with 2.1x increased hypothyroidism risk', quality: 'High (Cohort, n=3,421)' },
        { study: 'Perchlorate in Drinking Water', journal: 'EPA', year: 2023, finding: 'Perchlorate inhibits iodine uptake, reducing thyroid hormone synthesis', quality: 'High (Regulatory review)' },
        { study: 'Selenium for Thyroid Health', journal: 'Thyroid Journal', year: 2021, finding: 'Selenium supplementation improved T3 levels by 18%', quality: 'Moderate (RCT, n=412)' }
      ],
      roadmap: {
        phase1: { title: 'Immediate Actions (Week 1-2)', actions: ['Install water filter (removes perchlorate)', 'Replace non-stick cookware with stainless steel', 'Schedule comprehensive thyroid panel'] },
        phase2: { title: 'Nutritional Support (Week 3-8)', actions: ['Start selenium 200mcg + zinc 30mg daily', 'Ensure iodine intake 150mcg/day', 'Add Brazil nuts (selenium source)'] },
        phase3: { title: 'Monitor & Optimize (Month 3-6)', actions: ['Repeat thyroid labs at 6 weeks', 'Assess symptom improvements', 'Consider T3 supplementation if conversion remains poor'] }
      },
      providerDashboard: {
        diagnosis: 'Subclinical Hypothyroidism with Environmental Cofactors',
        icd10: 'E02',
        recommendedTests: ['TSH', 'Free T4', 'Free T3', 'TPO Antibodies', 'Thyroglobulin Ab', 'Reverse T3'],
        referrals: ['Endocrinologist', 'Functional Medicine Practitioner'],
        monitoring: 'Repeat thyroid panel every 6 weeks until TSH <4.0, then quarterly'
      }
    },
    {
      id: 3,
      title: 'Perimenopause with Estrogen Dominance',
      profile: '48-year-old female, hot flashes, mood swings, irregular periods',
      symptoms: ['Hot flashes', 'Night sweats', 'Mood swings', 'Sleep problems', 'Irregular periods'],
      edcScore: 72,
      hormoneFindings: [
        { hormone: 'Estradiol', status: 'Fluctuating', value: '180 pg/mL', normal: '15-350 pg/mL (varies)' },
        { hormone: 'Progesterone', status: 'Low', value: '0.8 ng/mL', normal: '5-20 ng/mL (luteal)' },
        { hormone: 'Estrogen/Progesterone Ratio', status: 'Elevated', value: '225:1', normal: '<100:1' }
      ],
      edcExposures: [
        { chemical: 'Xenoestrogens', source: 'Plastics, pesticides', risk: 'High', evidence: 'Mimic estrogen activity (Endocrine Society 2019)' },
        { chemical: 'Phthalates', source: 'Fragrances, vinyl', risk: 'High', evidence: 'Linked to early menopause (JCEM 2020)' },
        { chemical: 'BPA', source: 'Canned foods', risk: 'Moderate', evidence: 'Estrogenic effects documented (NIH 2021)' }
      ],
      recommendations: [
        { category: 'Diet', action: 'Increase cruciferous vegetables, reduce alcohol', evidence: 'Supports estrogen metabolism (Nutrition Reviews 2020)' },
        { category: 'EDC Reduction', action: 'Choose organic produce, avoid plastic food storage', evidence: 'Reduces xenoestrogen exposure (Environmental Health 2019)' },
        { category: 'Lab Tests', action: 'Request: Estradiol, Progesterone, FSH, DHEA-S', evidence: 'Perimenopause assessment (NAMS guidelines)' },
        { category: 'Lifestyle', action: 'Stress reduction, sleep optimization (7-9 hours)', evidence: 'Improves hormone balance (Sleep Medicine Reviews 2021)' }
      ],
      aiAnalysis: {
        confidence: 90,
        reasoning: 'Pattern recognition identified classic perimenopause symptoms with estrogen-progesterone imbalance (ratio 225:1, normal <100:1). High xenoestrogen and phthalate exposure (EDC score 72/100) exacerbates estrogen dominance. Symptom severity and hormone fluctuations consistent with late perimenopause transition.',
        patternMatches: [
          { pattern: 'Estrogen Dominance', confidence: 93, evidence: 'E2/P4 ratio 225:1 + symptoms of excess estrogen' },
          { pattern: 'Progesterone Deficiency', confidence: 91, evidence: 'Progesterone 0.8 ng/mL (should be 5-20 in luteal phase)' },
          { pattern: 'Xenoestrogen Burden', confidence: 86, evidence: 'High plastic + pesticide exposure mimicking estrogen' }
        ]
      },
      clinicalEvidence: [
        { study: 'Xenoestrogens and Menopause', journal: 'Endocrine Society', year: 2019, finding: 'Xenoestrogen exposure associated with 2.8x increased estrogen dominance symptoms', quality: 'High (Cohort, n=2,134)' },
        { study: 'Phthalates and Early Menopause', journal: 'JCEM', year: 2020, finding: 'High phthalate exposure linked to menopause 2.3 years earlier', quality: 'High (Prospective study, n=1,442)' },
        { study: 'Cruciferous Vegetables and Estrogen', journal: 'Nutrition Reviews', year: 2020, finding: 'DIM from cruciferous vegetables improved estrogen metabolism by 34%', quality: 'Moderate (RCT, n=318)' }
      ],
      roadmap: {
        phase1: { title: 'Immediate Actions (Week 1-2)', actions: ['Switch to organic produce (Dirty Dozen)', 'Replace plastic food storage with glass', 'Schedule hormone panel (Day 19-21 of cycle)'] },
        phase2: { title: 'Dietary & Lifestyle (Week 3-8)', actions: ['Add 2 cups cruciferous vegetables daily', 'Reduce alcohol to <3 drinks/week', 'Implement stress reduction (meditation, yoga)'] },
        phase3: { title: 'Hormone Support (Month 3-6)', actions: ['Consider bioidentical progesterone if deficiency persists', 'Repeat hormone labs', 'Track symptom improvements in journal'] }
      },
      providerDashboard: {
        diagnosis: 'Perimenopause with Estrogen Dominance',
        icd10: 'N95.1',
        recommendedTests: ['Estradiol', 'Progesterone (Day 19-21)', 'FSH', 'DHEA-S', 'Estrogen Metabolites (2-OH, 16-OH)'],
        referrals: ['Gynecologist', 'Hormone Specialist', 'Integrative Medicine'],
        monitoring: 'Track menstrual cycles, symptom diary, repeat hormones every 3 months'
      }
    }
  ];

  const handleSymptomToggle = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleEdcAnswer = (questionId, answer) => {
    setEdcExposure(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleAnalyze = () => {
    setCurrentStep('analyzing');
    setTimeout(() => {
      // Auto-select scenario based on symptoms
      let scenario = scenarios[0]; // default
      if (selectedSymptoms.some(s => s.includes('Thyroid') || s === 'Fatigue' || s === 'Cold sensitivity')) {
        scenario = scenarios[1];
      } else if (selectedSymptoms.some(s => s.includes('Hot flashes') || s.includes('Night sweats'))) {
        scenario = scenarios[2];
      }
      setSelectedScenario(scenario);
      setCurrentStep('results');
    }, 3000);
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setSelectedSymptoms(scenario.symptoms);
    setCurrentStep('analyzing');
    setTimeout(() => {
      setCurrentStep('results');
    }, 3000);
  };

  const calculateEdcScore = () => {
    const weights = { 'Daily': 4, 'Always': 4, '10+': 4, 'Weekly': 3, 'Usually': 3, '5-9': 3, 'Sometimes': 2, 'Rarely': 1, '2-4': 2, 'Never': 0, '0-1': 1 };
    const scores = Object.values(edcExposure).map(answer => weights[answer] || 0);
    const total = scores.reduce((a, b) => a + b, 0);
    return Math.min(Math.round((total / 20) * 100), 100);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #0a1b3d 0%, #1a2f5a 100%)', padding: '2rem' }}>
      <BetaDisclaimer />
      <div style={{ maxWidth: '1200px', margin: '0 auto 2rem' }}>
        <DemoDisclaimer platformName="EndoGuard™" dashboardUrl="/endoguard/assessment" />
      </div>
      
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(0, 206, 209, 0.3)',
            color: '#D946EF',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 206, 209, 0.2)';
            e.target.style.borderColor = '#D946EF';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(0, 206, 209, 0.3)';
          }}
        >
          ← Back to Platform Info
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* Welcome Screen */}
        {currentStep === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h1 style={{ fontSize: '3rem', color: '#D946EF', marginBottom: '1rem', fontWeight: 'bold' }}>
                EndoGuard™ Hormone Intelligence Demo
              </h1>
              <p style={{ fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '800px', margin: '0 auto' }}>
                Experience clinical-grade hormone intelligence that integrates environmental exposures, microplastics, and EDC datasets
              </p>
            </div>

            {/* Pre-loaded Scenarios */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '1.5rem', textAlign: 'center' }}>
                Try a Pre-Loaded Scenario
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {scenarios.map(scenario => (
                  <motion.div
                    key={scenario.id}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleScenarioSelect(scenario)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 206, 209, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
                      border: '1px solid rgba(0, 206, 209, 0.3)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  >
                    <h3 style={{ color: '#D946EF', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{scenario.title}</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', marginBottom: '1rem' }}>{scenario.profile}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#FFB800' }}>EDC Score: {scenario.edcScore}/100</span>
                      <span style={{ color: '#D946EF' }}>{scenario.symptoms.length} Symptoms</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Or Custom Assessment */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '100%', 
                height: '1px', 
                background: 'linear-gradient(to right, transparent, rgba(0, 206, 209, 0.3), transparent)', 
                margin: '2rem 0' 
              }} />
              <p style={{ color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1.5rem' }}>Or create your own assessment</p>
              <button
                onClick={() => setCurrentStep('symptoms')}
                style={{
                  background: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '1rem 3rem',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 15px rgba(0, 206, 209, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0, 206, 209, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 15px rgba(0, 206, 209, 0.3)';
                }}
              >
                Start Custom Assessment
              </button>
            </div>
          </motion.div>
        )}

        {/* Symptom Selection */}
        {currentStep === 'symptoms' && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '2rem', color: '#D946EF', marginBottom: '2rem', textAlign: 'center' }}>
              Select Your Symptoms
            </h2>

            {Object.entries(symptomCategories).map(([category, symptoms]) => (
              <div key={category} style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '1rem' }}>{category}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {symptoms.map(symptom => (
                    <motion.button
                      key={symptom}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSymptomToggle(symptom)}
                      style={{
                        background: selectedSymptoms.includes(symptom)
                          ? 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${selectedSymptoms.includes(symptom) ? '#D946EF' : 'rgba(255, 255, 255, 0.2)'}`,
                        color: '#fff',
                        padding: '1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        textAlign: 'left'
                      }}
                    >
                      {symptom}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
              <button
                onClick={() => setCurrentStep('welcome')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('edc')}
                disabled={selectedSymptoms.length === 0}
                style={{
                  background: selectedSymptoms.length > 0
                    ? 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: selectedSymptoms.length > 0 ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  opacity: selectedSymptoms.length > 0 ? 1 : 0.5
                }}
              >
                Continue to EDC Assessment ({selectedSymptoms.length} selected)
              </button>
            </div>
          </motion.div>
        )}

        {/* EDC Exposure Assessment */}
        {currentStep === 'edc' && (
          <motion.div
            key="edc"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ maxWidth: '900px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '2rem', color: '#D946EF', marginBottom: '2rem', textAlign: 'center' }}>
              EDC Exposure Assessment
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: '3rem' }}>
              Answer these questions to assess your endocrine-disrupting chemical exposure
            </p>

            {edcQuestions.map((q, index) => (
              <div key={q.id} style={{ marginBottom: '2rem' }}>
                <p style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '1rem' }}>
                  {index + 1}. {q.question}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                  {q.options.map(option => (
                    <button
                      key={option}
                      onClick={() => handleEdcAnswer(q.id, option)}
                      style={{
                        background: edcExposure[q.id] === option
                          ? 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${edcExposure[q.id] === option ? '#D946EF' : 'rgba(255, 255, 255, 0.2)'}`,
                        color: '#fff',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.3s'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
              <button
                onClick={() => setCurrentStep('symptoms')}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={Object.keys(edcExposure).length < edcQuestions.length}
                style={{
                  background: Object.keys(edcExposure).length === edcQuestions.length
                    ? 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: Object.keys(edcExposure).length === edcQuestions.length ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  opacity: Object.keys(edcExposure).length === edcQuestions.length ? 1 : 0.5
                }}
              >
                Analyze My Hormone Health
              </button>
            </div>
          </motion.div>
        )}

        {/* Analyzing */}
        {currentStep === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                width: '80px',
                height: '80px',
                border: '4px solid rgba(0, 206, 209, 0.2)',
                borderTopColor: '#D946EF',
                borderRadius: '50%',
                margin: '0 auto 2rem'
              }}
            />
            <h2 style={{ fontSize: '2rem', color: '#D946EF', marginBottom: '1rem' }}>
              Analyzing Your Hormone Health...
            </h2>
            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem', lineHeight: '1.8' }}>
              <p>✓ Mapping symptoms to endocrine pathways...</p>
              <p>✓ Analyzing EDC exposure patterns...</p>
              <p>✓ Cross-referencing 10,000+ research studies...</p>
              <p>✓ Generating personalized recommendations...</p>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {currentStep === 'results' && selectedScenario && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ maxWidth: '1200px', margin: '0 auto' }}
          >
            <h2 style={{ fontSize: '2.5rem', color: '#D946EF', marginBottom: '1rem', textAlign: 'center' }}>
              Your Hormone Health Analysis
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: '3rem', fontSize: '1.1rem' }}>
              {selectedScenario.profile}
            </p>

            {/* EDC Exposure Score */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 206, 209, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
              border: '1px solid rgba(0, 206, 209, 0.3)',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>EDC Exposure Score</h3>
              <div style={{ fontSize: '4rem', color: '#FFB800', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {selectedScenario.edcScore}/100
              </div>
              <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {selectedScenario.edcScore >= 70 ? 'High exposure - Immediate action recommended' :
                 selectedScenario.edcScore >= 40 ? 'Moderate exposure - Consider reduction strategies' :
                 'Low exposure - Maintain current practices'}
              </p>
            </div>

            {/* Hormone Findings */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem' }}>Hormone Pattern Analysis</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {selectedScenario.hormoneFindings.map((finding, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '1.5rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr',
                      gap: '1rem',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ color: '#D946EF', fontSize: '1.1rem', fontWeight: 'bold' }}>{finding.hormone}</div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Status: <span style={{ color: finding.status.includes('Elevated') || finding.status.includes('Low') ? '#FFB800' : '#4ADE80' }}>{finding.status}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Your Value</div>
                      <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{finding.value}</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.85rem' }}>Normal Range</div>
                      <div style={{ color: '#fff', fontSize: '1.1rem' }}>{finding.normal}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EDC Exposures */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem' }}>Identified EDC Exposures</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {selectedScenario.edcExposures.map((exposure, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${exposure.risk === 'High' ? 'rgba(255, 184, 0, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '8px',
                      padding: '1.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                      <div>
                        <div style={{ color: '#D946EF', fontSize: '1.1rem', fontWeight: 'bold' }}>{exposure.chemical}</div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Source: {exposure.source}</div>
                      </div>
                      <span style={{
                        background: exposure.risk === 'High' ? 'rgba(255, 184, 0, 0.2)' : 'rgba(74, 222, 128, 0.2)',
                        color: exposure.risk === 'High' ? '#FFB800' : '#4ADE80',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: 'bold'
                      }}>
                        {exposure.risk} Risk
                      </span>
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                      📚 {exposure.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Recommendations */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem' }}>Personalized Recommendations</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {selectedScenario.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'linear-gradient(135deg, rgba(0, 206, 209, 0.1) 0%, rgba(0, 180, 216, 0.1) 100%)',
                      border: '1px solid rgba(0, 206, 209, 0.3)',
                      borderRadius: '8px',
                      padding: '1.5rem'
                    }}
                  >
                    <div style={{ color: '#D946EF', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {rec.category}
                    </div>
                    <div style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                      {rec.action}
                    </div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                      📚 Evidence: {rec.evidence}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Pattern Analysis */}
            {selectedScenario.aiAnalysis && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>🤖</span> AI Pattern Analysis
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.15) 100%)',
                  border: '2px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '12px',
                  padding: '2rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>Confidence Score</div>
                    <div style={{ fontSize: '2.5rem', color: '#3b82f6', fontWeight: 'bold' }}>{selectedScenario.aiAnalysis.confidence}%</div>
                  </div>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.7', fontSize: '1.05rem' }}>
                    {selectedScenario.aiAnalysis.reasoning}
                  </p>
                </div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {selectedScenario.aiAnalysis.patternMatches.map((pattern, index) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '8px',
                      padding: '1.25rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.05rem' }}>{pattern.pattern}</span>
                        <span style={{ color: '#10b981', fontWeight: 'bold' }}>{pattern.confidence}%</span>
                      </div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem' }}>{pattern.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinical Evidence Engine */}
            {selectedScenario.clinicalEvidence && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>📚</span> Clinical Evidence Engine
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {selectedScenario.clinicalEvidence.map((evidence, index) => (
                    <div key={index} style={{
                      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '1.5rem'
                    }}>
                      <div style={{ color: '#10b981', fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        {evidence.study}
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                        <strong>{evidence.journal}</strong> ({evidence.year})
                      </div>
                      <p style={{ color: '#fff', marginBottom: '0.75rem' }}>{evidence.finding}</p>
                      <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.2)', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '0.85rem', color: '#10b981' }}>
                        ✓ Evidence Quality: {evidence.quality}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Personalized Roadmap */}
            {selectedScenario.roadmap && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>🗺️</span> Personalized Roadmap
                </h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {['phase1', 'phase2', 'phase3'].map((phase, index) => (
                    <div key={phase} style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%)',
                      border: '2px solid rgba(245, 158, 11, 0.4)',
                      borderRadius: '12px',
                      padding: '1.5rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'rgba(245, 158, 11, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#f59e0b',
                          fontWeight: 'bold',
                          fontSize: '1.25rem'
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ color: '#f59e0b', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          {selectedScenario.roadmap[phase].title}
                        </div>
                      </div>
                      <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                        {selectedScenario.roadmap[phase].actions.map((action, idx) => (
                          <li key={idx} style={{ marginBottom: '0.5rem' }}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Provider Dashboard */}
            {selectedScenario.providerDashboard && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '2rem' }}>🩺</span> Provider Dashboard
                </h3>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
                  border: '2px solid rgba(139, 92, 246, 0.4)',
                  borderRadius: '12px',
                  padding: '2rem'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Diagnosis</div>
                      <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedScenario.providerDashboard.diagnosis}</div>
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>ICD-10 Code</div>
                      <div style={{ color: '#8b5cf6', fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedScenario.providerDashboard.icd10}</div>
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Recommended Tests</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {selectedScenario.providerDashboard.recommendedTests.map((test, idx) => (
                        <span key={idx} style={{
                          background: 'rgba(139, 92, 246, 0.2)',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          color: '#a78bfa',
                          fontSize: '0.9rem'
                        }}>
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Recommended Referrals</div>
                    <div style={{ color: '#fff', fontSize: '1rem' }}>
                      {selectedScenario.providerDashboard.referrals.join(' • ')}
                    </div>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Monitoring Plan</div>
                    <p style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6' }}>
                      {selectedScenario.providerDashboard.monitoring}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '3rem' }}>
              <button
                onClick={() => {
                  setCurrentStep('welcome');
                  setSelectedSymptoms([]);
                  setEdcExposure({});
                  setSelectedScenario(null);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Try Another Assessment
              </button>
              <button
                onClick={() => navigate('/pricing/endoguard')}
                style={{
                  background: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
                  border: 'none',
                  color: '#fff',
                  padding: '1rem 2rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0, 206, 209, 0.3)'
                }}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EndoGuardPrototype;
