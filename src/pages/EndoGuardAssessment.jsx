import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import TrialGate from '../components/TrialGate'; // Removed for hybrid freemium model
import FDADisclaimer from '../components/FDADisclaimer';
import '../styles/endoguard-assessment.css';
import EndoGuardResults from '../components/EndoGuardResults';

const API_BASE = 'http://localhost:3008/api/endoguard';

export default function EndoGuardAssessment() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Demographics
    age: '',
    biologicalSex: '',
    menstrualStatus: '',
    
    // Symptoms
    symptoms: [],
    symptomSeverity: 5,
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
    existingConditions: [],
    medications: [],
    supplements: []
  });

  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Hybrid freemium model - allow unauthenticated access
  // Users will be prompted to sign up when viewing results
  // (Authentication check removed to enable try-before-signup flow)

  // Symptom options organized by hormone system
  const symptomOptions = {
    thyroid: [
      'Unexplained weight gain or loss',
      'Fatigue or low energy',
      'Hair loss or thinning',
      'Cold intolerance',
      'Dry skin',
      'Brain fog or difficulty concentrating'
    ],
    reproductive: [
      'Irregular menstrual cycles',
      'Heavy or painful periods',
      'PMS symptoms',
      'Low libido',
      'Fertility issues',
      'Hot flashes or night sweats'
    ],
    adrenal: [
      'Chronic stress or anxiety',
      'Difficulty waking up',
      'Afternoon energy crashes',
      'Salt cravings',
      'Difficulty handling stress',
      'Mood swings'
    ],
    metabolic: [
      'Blood sugar imbalances',
      'Increased belly fat',
      'Sugar cravings',
      'Difficulty losing weight',
      'Insulin resistance',
      'PCOS symptoms'
    ]
  };

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

  const submitAssessment = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch(`${API_BASE}/assess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        setResults(data.assessment);
        setStep(7); // Results step
      }
    } catch (error) {
      console.error('Assessment error:', error);
      alert('Failed to complete assessment. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
      <div className="endoguard-assessment">
      <div className="assessment-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0 }}>EndoGuard™ Hormone Health Assessment</h1>
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
              📊 My Assessments
            </button>
          )}
        </div>
        <p>Discover your Endocrine Disrupting Chemical (EDC) exposure risk and get personalized recommendations</p>
        <FDADisclaimer />
        
        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
        <div className="step-indicator">Step {step} of 6</div>
      </div>

      <div className="assessment-content">
        {/* Step 1: Demographics */}
        {step === 1 && (
          <div className="step-section">
            <h2>About You</h2>
            
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Enter your age"
                min="18"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Biological Sex</label>
              <select
                value={formData.biologicalSex}
                onChange={(e) => handleInputChange('biologicalSex', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            {formData.biologicalSex === 'female' && (
              <div className="form-group">
                <label>Menstrual Status</label>
                <select
                  value={formData.menstrualStatus}
                  onChange={(e) => handleInputChange('menstrualStatus', e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="regular">Regular cycles</option>
                  <option value="irregular">Irregular cycles</option>
                  <option value="perimenopause">Perimenopause</option>
                  <option value="menopause">Menopause</option>
                  <option value="postmenopause">Postmenopause</option>
                  <option value="pregnant">Pregnant</option>
                  <option value="breastfeeding">Breastfeeding</option>
                </select>
              </div>
            )}

            <button onClick={nextStep} className="next-btn">Next</button>
          </div>
        )}

        {/* Step 2: Symptoms */}
        {step === 2 && (
          <div className="step-section">
            <h2>Symptoms</h2>
            <p>Select all symptoms you're currently experiencing:</p>

            {Object.entries(symptomOptions).map(([system, symptoms]) => (
              <div key={system} className="symptom-category">
                <h3>{system.charAt(0).toUpperCase() + system.slice(1)} System</h3>
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
            ))}

            {formData.symptoms.length > 0 && (
              <>
                <div className="form-group">
                  <label>Overall Symptom Severity (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.symptomSeverity}
                    onChange={(e) => handleInputChange('symptomSeverity', parseInt(e.target.value))}
                  />
                  <div className="range-value">{formData.symptomSeverity}</div>
                </div>

                <div className="form-group">
                  <label>How long have you had these symptoms?</label>
                  <select
                    value={formData.symptomDuration}
                    onChange={(e) => handleInputChange('symptomDuration', e.target.value)}
                  >
                    <option value="">Select...</option>
                    <option value="less_than_month">Less than 1 month</option>
                    <option value="1_3_months">1-3 months</option>
                    <option value="3_6_months">3-6 months</option>
                    <option value="6_12_months">6-12 months</option>
                    <option value="1_2_years">1-2 years</option>
                    <option value="over_2_years">Over 2 years</option>
                  </select>
                </div>
              </>
            )}

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && (
          <div className="step-section">
            <h2>Lifestyle Factors</h2>

            <div className="form-group">
              <label>Diet Quality</label>
              <select
                value={formData.dietQuality}
                onChange={(e) => handleInputChange('dietQuality', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="excellent">Excellent (mostly whole foods, organic)</option>
                <option value="good">Good (balanced, some processed foods)</option>
                <option value="fair">Fair (mix of healthy and unhealthy)</option>
                <option value="poor">Poor (mostly processed/fast food)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Exercise Frequency</label>
              <select
                value={formData.exerciseFrequency}
                onChange={(e) => handleInputChange('exerciseFrequency', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="daily">Daily (5-7 days/week)</option>
                <option value="regular">Regular (3-4 days/week)</option>
                <option value="occasional">Occasional (1-2 days/week)</option>
                <option value="rarely">Rarely or never</option>
              </select>
            </div>

            <div className="form-group">
              <label>Sleep Quality</label>
              <select
                value={formData.sleepQuality}
                onChange={(e) => handleInputChange('sleepQuality', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="excellent">Excellent (7-9 hours, restful)</option>
                <option value="good">Good (6-7 hours, mostly restful)</option>
                <option value="fair">Fair (5-6 hours or interrupted)</option>
                <option value="poor">Poor (less than 5 hours or very poor quality)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Stress Level (1-10)</label>
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
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {/* Step 4: EDC Exposure */}
        {step === 4 && (
          <div className="step-section">
            <h2>EDC Exposure Assessment</h2>
            <p>Help us understand your exposure to endocrine disrupting chemicals:</p>

            <div className="form-group">
              <label>Plastic Use Frequency</label>
              <select
                value={formData.plasticUseFrequency}
                onChange={(e) => handleInputChange('plasticUseFrequency', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="high">High (daily plastic containers, bottles, packaging)</option>
                <option value="moderate">Moderate (occasional plastic use)</option>
                <option value="low">Low (mostly glass/stainless steel)</option>
                <option value="minimal">Minimal (actively avoid plastics)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Processed Food Frequency</label>
              <select
                value={formData.processedFoodFrequency}
                onChange={(e) => handleInputChange('processedFoodFrequency', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="daily">Daily</option>
                <option value="several_times_week">Several times per week</option>
                <option value="occasionally">Occasionally</option>
                <option value="rarely">Rarely or never</option>
              </select>
            </div>

            <div className="form-group">
              <label>Water Source</label>
              <select
                value={formData.waterSource}
                onChange={(e) => handleInputChange('waterSource', e.target.value)}
              >
                <option value="">Select...</option>
                <option value="tap_unfiltered">Tap water (unfiltered)</option>
                <option value="tap_filtered">Tap water (filtered)</option>
                <option value="bottled">Bottled water</option>
                <option value="well">Well water</option>
                <option value="reverse_osmosis">Reverse osmosis filtered</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.occupationalExposure}
                  onChange={(e) => handleInputChange('occupationalExposure', e.target.checked)}
                />
                <span>I have occupational exposure to chemicals (manufacturing, agriculture, cleaning, beauty industry, etc.)</span>
              </label>
            </div>

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {/* Step 5: Health History */}
        {step === 5 && (
          <div className="step-section">
            <h2>Health History</h2>

            <div className="form-group">
              <label>Existing Health Conditions (optional)</label>
              <textarea
                value={formData.existingConditions.join(', ')}
                onChange={(e) => handleInputChange('existingConditions', e.target.value.split(',').map(s => s.trim()))}
                placeholder="e.g., PCOS, hypothyroidism, endometriosis (separate with commas)"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Current Medications (optional)</label>
              <textarea
                value={formData.medications.join(', ')}
                onChange={(e) => handleInputChange('medications', e.target.value.split(',').map(s => s.trim()))}
                placeholder="List any medications you're taking (separate with commas)"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Current Supplements (optional)</label>
              <textarea
                value={formData.supplements.join(', ')}
                onChange={(e) => handleInputChange('supplements', e.target.value.split(',').map(s => s.trim()))}
                placeholder="List any supplements you're taking (separate with commas)"
                rows="3"
              />
            </div>

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button onClick={nextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {/* Step 6: Review & Submit */}
        {step === 6 && (
          <div className="step-section">
            <h2>Review Your Assessment</h2>
            
            <div className="review-summary">
              <div className="summary-item">
                <strong>Symptoms Selected:</strong> {formData.symptoms.length}
              </div>
              <div className="summary-item">
                <strong>Symptom Severity:</strong> {formData.symptomSeverity}/10
              </div>
              <div className="summary-item">
                <strong>Stress Level:</strong> {formData.stressLevel}/10
              </div>
              <div className="summary-item">
                <strong>Diet Quality:</strong> {formData.dietQuality || 'Not specified'}
              </div>
              <div className="summary-item">
                <strong>Plastic Use:</strong> {formData.plasticUseFrequency || 'Not specified'}
              </div>
            </div>

            <div className="disclaimer-box">
              <h3>Important Disclaimer</h3>
              <p>This assessment is for educational purposes only and does not constitute medical advice. Results should not be used to diagnose or treat any medical condition. Always consult with a qualified healthcare provider before making any health decisions.</p>
            </div>

            <div className="button-group">
              <button onClick={prevStep} className="prev-btn">Previous</button>
              <button 
                onClick={submitAssessment} 
                disabled={isAnalyzing}
                className="submit-btn"
              >
                {isAnalyzing ? 'Analyzing...' : 'Get My Results'}
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
  );
}
