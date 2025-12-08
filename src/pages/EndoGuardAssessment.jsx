import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
// import TrialGate from '../components/TrialGate'; // Removed for hybrid freemium model
import FDADisclaimer from '../components/FDADisclaimer';
import TrialExpirationBanner from '../components/TrialExpirationBanner';
import UsageStatsDashboard from '../components/UsageStatsDashboard';
import { useAnalytics } from '../hooks/useAnalytics';
import BackToHomeButton from '../components/BackToHomeButton';
import LanguageToggle from '../components/LanguageToggle';
import OnboardingTour from '../components/OnboardingTour';
import { endoGuardAssessmentTour } from '../config/tours';
import '../styles/endoguard-assessment.css';
import '../styles/tour.css';
import EndoGuardResults from '../components/EndoGuardResults';

const API_BASE = '/api/endoguard';

export default function EndoGuardAssessment() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useTranslation();
  const { trackAction } = useAnalytics('endoguard');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Demographics
    age: '',
    biologicalSex: '',
    menstrualStatus: '',
    
    // Symptoms
    symptoms: [],
    symptomDuration: '',
    
    // Lifestyle
    dietQuality: '',
    exerciseFrequency: '',
    sleepQuality: '',
    stressLevel: 5,
    
    // Exposure Assessment
    plasticUseFrequency: '',
    processedFoodFrequency: '',
    personalCareProducts: [],
    householdProducts: [],
    occupationalExposure: false,
    waterSource: '',
    
    // Health History
    existingConditions: '',
    medications: '',
    supplements: ''
  });

  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Hybrid freemium model - allow unauthenticated access
  // Users will be prompted to sign up when viewing results
  // (Authentication check removed to enable try-before-signup flow)

  // Symptom options organized by hormone system
  // Filter symptoms based on biological sex - use useMemo to recalculate when biologicalSex changes
  const symptomOptions = useMemo(() => {
    const baseSymptoms = {
      thyroid: [
        t('endoguard.steps.symptoms.thyroid.weightChange'),
        t('endoguard.steps.symptoms.thyroid.fatigue'),
        t('endoguard.steps.symptoms.thyroid.hairLoss'),
        t('endoguard.steps.symptoms.thyroid.coldIntolerance'),
        t('endoguard.steps.symptoms.thyroid.drySkin'),
        t('endoguard.steps.symptoms.thyroid.brainFog')
      ],
      reproductive: {
        female: [
          t('endoguard.steps.symptoms.reproductive.female.irregularCycles'),
          t('endoguard.steps.symptoms.reproductive.female.heavyPeriods'),
          t('endoguard.steps.symptoms.reproductive.female.pms'),
          t('endoguard.steps.symptoms.reproductive.female.lowLibido'),
          t('endoguard.steps.symptoms.reproductive.female.fertility'),
          t('endoguard.steps.symptoms.reproductive.female.hotFlashes'),
          t('endoguard.steps.symptoms.reproductive.female.vaginalDryness'),
          t('endoguard.steps.symptoms.reproductive.female.breastTenderness')
        ],
        male: [
          t('endoguard.steps.symptoms.reproductive.male.lowLibido'),
          t('endoguard.steps.symptoms.reproductive.male.erectileDysfunction'),
          t('endoguard.steps.symptoms.reproductive.male.fertility'),
          t('endoguard.steps.symptoms.reproductive.male.muscleLoss'),
          t('endoguard.steps.symptoms.reproductive.male.gynecomastia'),
          t('endoguard.steps.symptoms.reproductive.male.testicularAtrophy')
        ],
        other: [
          t('endoguard.steps.symptoms.reproductive.other.lowLibido'),
          t('endoguard.steps.symptoms.reproductive.other.fertility'),
          t('endoguard.steps.symptoms.reproductive.other.hotFlashes')
        ]
      },
      adrenal: [
        t('endoguard.steps.symptoms.adrenal.stress'),
        t('endoguard.steps.symptoms.adrenal.wakingDifficulty'),
        t('endoguard.steps.symptoms.adrenal.energyCrashes'),
        t('endoguard.steps.symptoms.adrenal.saltCravings'),
        t('endoguard.steps.symptoms.adrenal.stressHandling'),
        t('endoguard.steps.symptoms.adrenal.moodSwings')
      ],
      metabolic: [
        t('endoguard.steps.symptoms.metabolic.bloodSugar'),
        t('endoguard.steps.symptoms.metabolic.bellyFat'),
        t('endoguard.steps.symptoms.metabolic.sugarCravings'),
        t('endoguard.steps.symptoms.metabolic.weightLoss'),
        t('endoguard.steps.symptoms.metabolic.insulinResistance'),
        formData.biologicalSex === 'female' ? t('endoguard.steps.symptoms.metabolic.pcos') : null
      ].filter(Boolean)
    };

    // Get gender-specific reproductive symptoms
    const reproductiveSymptoms = formData.biologicalSex 
      ? baseSymptoms.reproductive[formData.biologicalSex] || baseSymptoms.reproductive.other
      : baseSymptoms.reproductive.other;

    return {
      thyroid: baseSymptoms.thyroid,
      reproductive: reproductiveSymptoms,
      adrenal: baseSymptoms.adrenal,
      metabolic: baseSymptoms.metabolic
    };
  }, [formData.biologicalSex, t]); // Recalculate when biologicalSex or language changes

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const nextStep = () => {
    setStep(prev => Math.min(prev + 1, 6));
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  // Calculate symptom severity automatically using comprehensive assessment data
  const calculateSymptomSeverity = () => {
    let totalScore = 0;
    let maxScore = 0;
    
    // 1. Symptom Count & Severity (40% weight)
    const symptomCount = formData.symptoms?.length || 0;
    const symptomScore = Math.min(40, symptomCount * 4); // Max 10 symptoms = 40 points
    totalScore += symptomScore;
    maxScore += 40;
    
    // 2. Symptom Duration (20% weight)
    const durationScores = {
      'less_than_month': 4,
      '1_3_months': 8,
      '3_6_months': 12,
      '6_12_months': 16,
      '1_2_years': 18,
      'over_2_years': 20
    };
    totalScore += durationScores[formData.symptomDuration] || 0;
    maxScore += 20;
    
    // 3. Stress Level (15% weight)
    const stressScore = (formData.stressLevel || 5) * 1.5;
    totalScore += stressScore;
    maxScore += 15;
    
    // 4. Lifestyle Factors (15% weight)
    const lifestyleScores = {
      dietQuality: { 'poor': 5, 'fair': 3, 'good': 1, 'excellent': 0 },
      exerciseFrequency: { 'rarely': 4, 'occasional': 2, 'regular': 1, 'daily': 0 },
      sleepQuality: { 'poor': 6, 'fair': 3, 'good': 1, 'excellent': 0 }
    };
    const dietScore = lifestyleScores.dietQuality[formData.dietQuality] || 0;
    const exerciseScore = lifestyleScores.exerciseFrequency[formData.exerciseFrequency] || 0;
    const sleepScore = lifestyleScores.sleepQuality[formData.sleepQuality] || 0;
    totalScore += dietScore + exerciseScore + sleepScore;
    maxScore += 15;
    
    // 5. EDC Exposure (10% weight)
    const edcScores = {
      plasticUseFrequency: { 'high': 4, 'moderate': 2, 'low': 1, 'minimal': 0 },
      processedFoodFrequency: { 'daily': 3, 'several_times_week': 2, 'occasionally': 1, 'rarely': 0 },
      waterSource: { 'tap_unfiltered': 3, 'bottled': 2, 'tap_filtered': 1, 'well': 1, 'ro_filtered': 0 }
    };
    const plasticScore = edcScores.plasticUseFrequency[formData.plasticUseFrequency] || 0;
    const foodScore = edcScores.processedFoodFrequency[formData.processedFoodFrequency] || 0;
    const waterScore = edcScores.waterSource[formData.waterSource] || 0;
    const occupationalExposure = formData.occupationalExposure ? 3 : 0;
    totalScore += plasticScore + foodScore + waterScore + occupationalExposure;
    maxScore += 10;
    
    // Calculate final severity (1-10 scale)
    const percentage = (totalScore / maxScore) * 100;
    const severity = Math.ceil((percentage / 100) * 10);
    
    return Math.min(10, Math.max(1, severity));
  };

  const submitAssessment = async () => {
    setIsAnalyzing(true);
    
    try {
      // Calculate severity automatically
      const calculatedSeverity = calculateSymptomSeverity();
      const assessmentData = {
        ...formData,
        symptomSeverity: calculatedSeverity
      };
      
      const response = await fetch(`${API_BASE}/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(assessmentData)
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.assessment);
        setStep(7); // Results step
        trackAction('complete_assessment', { 
          age: formData.age,
          biologicalSex: formData.biologicalSex,
          symptomCount: formData.symptoms?.length || 0,
          riskLevel: data.assessment?.riskLevel || 'unknown'
        });
      }
    } catch (error) {
      console.error('Assessment error:', error);
      alert('Failed to complete assessment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
      <>
      <OnboardingTour 
        tourId={endoGuardAssessmentTour.tourId}
        steps={endoGuardAssessmentTour.steps}
        autoStart={step === 1}
      />
      <BackToHomeButton />
      {user && <TrialExpirationBanner platform="endoguard" />}
      <div className="endoguard-assessment">
      <div className="assessment-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>{t('endoguard.assessment.title')}</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <LanguageToggle />
            {user && (
            <button
              onClick={() => navigate('/my-assessments')}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              {t('endoguard.assessment.myAssessments')}
            </button>
            )}
          </div>
        </div>
        <p>{t('endoguard.assessment.description')}</p>
        <div style={{
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          marginTop: '1rem',
          marginBottom: '1rem',
          textAlign: 'center',
          border: '2px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {t('endoguard.assessment.freeAssessmentBanner')}
          </div>
          <div style={{ fontSize: '0.95rem', opacity: 0.95 }}>
            {t('endoguard.assessment.freeAssessmentDetails')}
          </div>
        </div>
        <div data-tour="disclaimer">
          <FDADisclaimer />
        </div>
      </div>

      {/* Usage Statistics Dashboard */}
      {user && <UsageStatsDashboard platform="endoguard" />}

      <div className="assessment-header">
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
        <div className="step-indicator" data-tour="step-indicator">
          {t('endoguard.assessment.stepIndicator', { current: step, total: 6 })}
        </div>
      </div>

      <div className="assessment-content">
        {/* Step 1: Demographics */}
        {step === 1 && (
          <div className="step-section">
            <h2>{t('endoguard.steps.demographics.title')}</h2>
            
            <div className="form-group">
              <label>{t('endoguard.steps.demographics.age')}</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder={t('endoguard.steps.demographics.agePlaceholder')}
                min="18"
                max="100"
                data-tour="age-input"
              />
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.demographics.biologicalSex')}</label>
              <select
                value={formData.biologicalSex}
                onChange={(e) => handleInputChange('biologicalSex', e.target.value)}
              >
                <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                <option value="female">{t('endoguard.steps.demographics.female')}</option>
                <option value="male">{t('endoguard.steps.demographics.male')}</option>
                <option value="other">{t('endoguard.steps.demographics.other')}</option>
              </select>
            </div>

            {formData.biologicalSex === 'female' && (
              <div className="form-group">
                <label>{t('endoguard.steps.demographics.menstrualStatus')}</label>
                <select
                  value={formData.menstrualStatus}
                  onChange={(e) => handleInputChange('menstrualStatus', e.target.value)}
                >
                  <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                  <option value="regular">{t('endoguard.steps.demographics.menstrualOptions.regular')}</option>
                  <option value="irregular">{t('endoguard.steps.demographics.menstrualOptions.irregular')}</option>
                  <option value="perimenopause">{t('endoguard.steps.demographics.menstrualOptions.perimenopause')}</option>
                  <option value="menopause">{t('endoguard.steps.demographics.menstrualOptions.menopause')}</option>
                  <option value="postmenopause">{t('endoguard.steps.demographics.menstrualOptions.postmenopause')}</option>
                  <option value="pregnant">{t('endoguard.steps.demographics.menstrualOptions.pregnant')}</option>
                  <option value="breastfeeding">{t('endoguard.steps.demographics.menstrualOptions.breastfeeding')}</option>
                </select>
              </div>
            )}

            <button onClick={nextStep} className="next-btn" data-tour="next-button">
              {t('common.next')}
            </button>
          </div>
        )}

        {/* Step 2: Symptoms */}
        {step === 2 && (
          <div className="step-section">
            <h2>{t('endoguard.steps.symptoms.title')}</h2>
            <p>{t('endoguard.steps.symptoms.description')}</p>

            {Object.entries(symptomOptions).map(([system, symptoms]) => (
              symptoms.length > 0 && (
                <div key={system} className="symptom-category">
                  <h3>{t(`endoguard.steps.symptoms.systems.${system}`)}</h3>
                  <div className="checkbox-grid">
                    {symptoms.map(symptom => (
                      <label key={symptom} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.symptoms.includes(symptom)}
                          onChange={() => handleArrayToggle('symptoms', symptom)}
                        />
                        <span>{symptom}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )
            ))}

            {formData.symptoms.length > 0 && (
              <>
                <div className="form-group">
                  <label>{t('endoguard.steps.symptoms.duration')}</label>
                  <select
                    value={formData.symptomDuration}
                    onChange={(e) => handleInputChange('symptomDuration', e.target.value)}
                  >
                    <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                    <option value="less_than_month">{t('endoguard.steps.symptoms.durationOptions.lessThanMonth')}</option>
                    <option value="1_3_months">{t('endoguard.steps.symptoms.durationOptions.oneToThree')}</option>
                    <option value="3_6_months">{t('endoguard.steps.symptoms.durationOptions.threeToSix')}</option>
                    <option value="6_12_months">{t('endoguard.steps.symptoms.durationOptions.sixToTwelve')}</option>
                    <option value="1_2_years">{t('endoguard.steps.symptoms.durationOptions.oneToTwo')}</option>
                    <option value="over_2_years">{t('endoguard.steps.symptoms.durationOptions.overTwo')}</option>
                  </select>
                </div>
              </>
            )}

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">{t('common.previous')}</button>
              <button onClick={nextStep} className="next-btn">{t('common.next')}</button>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && (
          <div className="step-section">
            <h2>{t('endoguard.steps.lifestyle.title')}</h2>

            <div className="form-group">
              <label>{t('endoguard.steps.lifestyle.dietQuality')}</label>
              <select
                value={formData.dietQuality}
                onChange={(e) => handleInputChange('dietQuality', e.target.value)}
              >
                <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                <option value="excellent">{t('endoguard.steps.lifestyle.dietOptions.excellent')}</option>
                <option value="good">{t('endoguard.steps.lifestyle.dietOptions.good')}</option>
                <option value="fair">{t('endoguard.steps.lifestyle.dietOptions.fair')}</option>
                <option value="poor">{t('endoguard.steps.lifestyle.dietOptions.poor')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.lifestyle.exerciseFrequency')}</label>
              <select
                value={formData.exerciseFrequency}
                onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
              >
                <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                <option value="daily">{t('endoguard.steps.lifestyle.exerciseOptions.daily')}</option>
                <option value="regular">{t('endoguard.steps.lifestyle.exerciseOptions.regular')}</option>
                <option value="occasional">{t('endoguard.steps.lifestyle.exerciseOptions.occasional')}</option>
                <option value="rarely">{t('endoguard.steps.lifestyle.exerciseOptions.rarely')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.lifestyle.sleepQuality')}</label>
              <select
                value={formData.sleepQuality}
                onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
              >
                <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                <option value="excellent">{t('endoguard.steps.lifestyle.sleepOptions.excellent')}</option>
                <option value="good">{t('endoguard.steps.lifestyle.sleepOptions.good')}</option>
                <option value="fair">{t('endoguard.steps.lifestyle.sleepOptions.fair')}</option>
                <option value="poor">{t('endoguard.steps.lifestyle.sleepOptions.poor')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.lifestyle.stressLevel')}</label>
              <p className="field-guidance">{t('endoguard.steps.lifestyle.stressGuidance')}</p>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.stressLevel}
                onChange={(e) => handleInputChange('stressLevel', parseInt(e.target.value))}
              />
              <div className="range-value">{formData.stressLevel}</div>
            </div>

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">{t('common.previous')}</button>
              <button onClick={nextStep} className="next-btn">{t('common.next')}</button>
            </div>
          </div>
        )}

        {/* Step 4: EDC Exposure */}
        {step === 4 && (
          <div className="step-section">
            <h2>{t('endoguard.steps.exposure.title')}</h2>
            <p>{t('endoguard.steps.exposure.description')}</p>

            <div className="form-group">
              <label>{t('endoguard.steps.exposure.plasticUse')}</label>
              <select
                value={formData.plasticUseFrequency}
                onChange={(e) => handleInputChange('plasticUseFrequency', e.target.value)}
              >
                <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                <option value="high">{t('endoguard.steps.exposure.plasticOptions.high')}</option>
                <option value="moderate">{t('endoguard.steps.exposure.plasticOptions.moderate')}</option>
                <option value="low">{t('endoguard.steps.exposure.plasticOptions.low')}</option>
                <option value="minimal">{t('endoguard.steps.exposure.plasticOptions.minimal')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.exposure.processedFood')}</label>
              <select
                value={formData.processedFoodFrequency}
                onChange={(e) => handleInputChange('processedFoodFrequency', e.target.value)}
              >
                <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                <option value="daily">{t('endoguard.steps.exposure.processedOptions.daily')}</option>
                <option value="several_times_week">{t('endoguard.steps.exposure.processedOptions.several')}</option>
                <option value="occasionally">{t('endoguard.steps.exposure.processedOptions.occasionally')}</option>
                <option value="rarely">{t('endoguard.steps.exposure.processedOptions.rarely')}</option>
              </select>
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.exposure.waterSource')}</label>
              <select
                value={formData.waterSource}
                onChange={(e) => handleInputChange('waterSource', e.target.value)}
              >
                <option value="">{t('endoguard.steps.demographics.selectOption')}</option>
                <option value="tap_unfiltered">{t('endoguard.steps.exposure.waterOptions.tapUnfiltered')}</option>
                <option value="tap_filtered">{t('endoguard.steps.exposure.waterOptions.tapFiltered')}</option>
                <option value="bottled">{t('endoguard.steps.exposure.waterOptions.bottled')}</option>
                <option value="well">{t('endoguard.steps.exposure.waterOptions.well')}</option>
                <option value="reverse_osmosis">{t('endoguard.steps.exposure.waterOptions.roFiltered')}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.occupationalExposure}
                  onChange={(e) => handleInputChange('occupationalExposure', e.target.checked)}
                />
                <span>{t('endoguard.steps.exposure.occupational')}</span>
              </label>
            </div>

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">{t('common.previous')}</button>
              <button onClick={nextStep} className="next-btn">{t('common.next')}</button>
            </div>
          </div>
        )}

        {/* Step 5: Health History */}
        {step === 5 && (
          <div className="step-section">
            <h2>{t('endoguard.steps.health.title')}</h2>

            <div className="form-group">
              <label>{t('endoguard.steps.health.conditions')}</label>
              <textarea
                value={formData.existingConditions}
                onChange={(e) => handleInputChange('existingConditions', e.target.value)}
                placeholder={t('endoguard.steps.health.conditionsPlaceholder')}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.health.medications')}</label>
              <textarea
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                placeholder={t('endoguard.steps.health.medicationsPlaceholder')}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>{t('endoguard.steps.health.supplements')}</label>
              <textarea
                value={formData.supplements}
                onChange={(e) => handleInputChange('supplements', e.target.value)}
                placeholder={t('endoguard.steps.health.supplementsPlaceholder')}
                rows="3"
              />
            </div>

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">{t('common.previous')}</button>
              <button onClick={nextStep} className="next-btn">{t('common.next')}</button>
            </div>
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {step === 6 && (
          <div className="step-section">
            <h2>{t('endoguard.steps.review.title')}</h2>
            
            <div className="review-summary">
              <div className="summary-item">
                <strong>{t('endoguard.steps.review.symptoms')}:</strong> {t('endoguard.steps.review.selectedSymptoms', { count: formData.symptoms.length })}
              </div>
              <div className="summary-item">
                <strong>Calculated Severity:</strong> {calculateSymptomSeverity()}/10 (auto-calculated)
              </div>
              <div className="summary-item">
                <strong>{t('endoguard.steps.review.stress')}:</strong> {formData.stressLevel}/10
              </div>
              <div className="summary-item">
                <strong>{t('endoguard.steps.review.dietQuality')}:</strong> {formData.dietQuality || 'Not specified'}
              </div>
              <div className="summary-item">
                <strong>{t('endoguard.steps.review.plasticUse')}:</strong> {formData.plasticUseFrequency || 'Not specified'}
              </div>
            </div>

            <div className="disclaimer-box">
              <h3>{t('endoguard.steps.review.disclaimer')}</h3>
              <p>{t('endoguard.steps.review.disclaimerText')}</p>
            </div>

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">{t('common.previous')}</button>
              <button 
                onClick={submitAssessment} 
                disabled={isAnalyzing}
                className="submit-btn"
              >
                {isAnalyzing ? t('endoguard.assessment.analyzing') : t('endoguard.assessment.getResults')}
              </button>
            </div>
          </div>
        )}

        {/* Step 7: Results */}
        {step === 7 && results && (
          <EndoGuardResults results={results} />
        )}
      </div>
      </div>
      </>
  );
}
