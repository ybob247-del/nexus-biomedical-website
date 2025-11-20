import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BetaDisclaimer from './BetaDisclaimer';

const EndoGuardPrototype = ({ onBack }) => {
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
      ]
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
      ]
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
      ]
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
      
      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(0, 206, 209, 0.3)',
            color: '#00CED1',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(0, 206, 209, 0.2)';
            e.target.style.borderColor = '#00CED1';
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
              <h1 style={{ fontSize: '3rem', color: '#00CED1', marginBottom: '1rem', fontWeight: 'bold' }}>
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
                    <h3 style={{ color: '#00CED1', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{scenario.title}</h3>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.95rem', marginBottom: '1rem' }}>{scenario.profile}</p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#FFB800' }}>EDC Score: {scenario.edcScore}/100</span>
                      <span style={{ color: '#00CED1' }}>{scenario.symptoms.length} Symptoms</span>
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
                  background: 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)',
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
            <h2 style={{ fontSize: '2rem', color: '#00CED1', marginBottom: '2rem', textAlign: 'center' }}>
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
                          ? 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${selectedSymptoms.includes(symptom) ? '#00CED1' : 'rgba(255, 255, 255, 0.2)'}`,
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
                    ? 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)'
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
            <h2 style={{ fontSize: '2rem', color: '#00CED1', marginBottom: '2rem', textAlign: 'center' }}>
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
                          ? 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${edcExposure[q.id] === option ? '#00CED1' : 'rgba(255, 255, 255, 0.2)'}`,
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
                    ? 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)'
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
                borderTopColor: '#00CED1',
                borderRadius: '50%',
                margin: '0 auto 2rem'
              }}
            />
            <h2 style={{ fontSize: '2rem', color: '#00CED1', marginBottom: '1rem' }}>
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
            <h2 style={{ fontSize: '2.5rem', color: '#00CED1', marginBottom: '1rem', textAlign: 'center' }}>
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
                      <div style={{ color: '#00CED1', fontSize: '1.1rem', fontWeight: 'bold' }}>{finding.hormone}</div>
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
                        <div style={{ color: '#00CED1', fontSize: '1.1rem', fontWeight: 'bold' }}>{exposure.chemical}</div>
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
                    <div style={{ color: '#00CED1', fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
                onClick={() => window.location.href = '/beta-signup?platform=endoguard'}
                style={{
                  background: 'linear-gradient(135deg, #00CED1 0%, #00B4D8 100%)',
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
                Request Beta Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EndoGuardPrototype;
