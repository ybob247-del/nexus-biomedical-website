import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Star, Send, CheckCircle } from 'lucide-react';
import '../styles/beta-survey.css';

const BetaSurvey = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const weekNumber = parseInt(searchParams.get('week')) || 1;

  const [formData, setFormData] = useState({
    nps_score: null,
    overall_satisfaction: null,
    ease_of_use_rating: null,
    accuracy_rating: null,
    usefulness_rating: null,
    prefer_mobile_app: '',
    mobile_platforms: [],
    mobile_app_features: '',
    mobile_app_pricing: '',
    what_works_well: '',
    what_needs_improvement: '',
    feature_requests: '',
    testimonial: '',
    would_recommend: null,
    would_pay_after_beta: null
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRatingClick = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMobilePlatformToggle = (platform) => {
    setFormData(prev => ({
      ...prev,
      mobile_platforms: prev.mobile_platforms.includes(platform)
        ? prev.mobile_platforms.filter(p => p !== platform)
        : [...prev.mobile_platforms, platform]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/beta/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          feedback_type: 'weekly_survey',
          week_number: weekNumber
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
      setTimeout(() => navigate('/dashboard'), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="beta-survey-container">
        <div className="survey-success">
          <CheckCircle size={64} color="#00D084" />
          <h2>Thank You!</h2>
          <p>Your Week {weekNumber} feedback has been submitted successfully.</p>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="beta-survey-container">
      <div className="survey-header">
        <h1>Week {weekNumber} Beta Feedback Survey</h1>
        <p>Help us improve EndoGuard and RxGuard with your insights</p>
        <div className="survey-progress">Week {weekNumber} of 8</div>
      </div>

      <form onSubmit={handleSubmit} className="survey-form">
        {/* NPS Score */}
        <div className="survey-section">
          <label className="survey-label">
            How likely are you to recommend Nexus Biomedical to a colleague or friend? (0-10)
          </label>
          <div className="nps-scale">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(score => (
              <button
                key={score}
                type="button"
                className={`nps-button ${formData.nps_score === score ? 'selected' : ''}`}
                onClick={() => handleRatingClick('nps_score', score)}
              >
                {score}
              </button>
            ))}
          </div>
          <div className="nps-labels">
            <span>Not at all likely</span>
            <span>Extremely likely</span>
          </div>
        </div>

        {/* Overall Satisfaction */}
        <div className="survey-section">
          <label className="survey-label">Overall satisfaction with the platform</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={40}
                fill={formData.overall_satisfaction >= star ? '#FFB800' : 'none'}
                stroke={formData.overall_satisfaction >= star ? '#FFB800' : '#ccc'}
                onClick={() => handleRatingClick('overall_satisfaction', star)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        {/* Feature Ratings */}
        <div className="survey-section">
          <label className="survey-label">Ease of Use</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={32}
                fill={formData.ease_of_use_rating >= star ? '#00A8CC' : 'none'}
                stroke={formData.ease_of_use_rating >= star ? '#00A8CC' : '#ccc'}
                onClick={() => handleRatingClick('ease_of_use_rating', star)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        <div className="survey-section">
          <label className="survey-label">Accuracy of Results</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={32}
                fill={formData.accuracy_rating >= star ? '#00A8CC' : 'none'}
                stroke={formData.accuracy_rating >= star ? '#00A8CC' : '#ccc'}
                onClick={() => handleRatingClick('accuracy_rating', star)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        <div className="survey-section">
          <label className="survey-label">Usefulness in Practice</label>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={32}
                fill={formData.usefulness_rating >= star ? '#00A8CC' : 'none'}
                stroke={formData.usefulness_rating >= star ? '#00A8CC' : '#ccc'}
                onClick={() => handleRatingClick('usefulness_rating', star)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        {/* Mobile App Preferences */}
        <div className="survey-section">
          <label className="survey-label">
            Would you prefer to use this platform as a mobile app instead of a website?
          </label>
          <div className="radio-group">
            {[
              { value: 'yes_definitely', label: 'Yes, definitely prefer mobile app' },
              { value: 'maybe', label: 'Maybe, depends on features' },
              { value: 'no_web_fine', label: 'No, website is fine' },
              { value: 'no_preference', label: 'No preference' }
            ].map(option => (
              <label key={option.value} className="radio-option">
                <input
                  type="radio"
                  name="prefer_mobile_app"
                  value={option.value}
                  checked={formData.prefer_mobile_app === option.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, prefer_mobile_app: e.target.value }))}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        {formData.prefer_mobile_app === 'yes_definitely' || formData.prefer_mobile_app === 'maybe' ? (
          <>
            <div className="survey-section">
              <label className="survey-label">Which platforms would you want the mobile app on?</label>
              <div className="checkbox-group">
                {['iOS (iPhone/iPad)', 'Android', 'Both'].map(platform => (
                  <label key={platform} className="checkbox-option">
                    <input
                      type="checkbox"
                      checked={formData.mobile_platforms.includes(platform)}
                      onChange={() => handleMobilePlatformToggle(platform)}
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>

            <div className="survey-section">
              <label className="survey-label">
                What features would make a mobile app valuable to you?
              </label>
              <textarea
                value={formData.mobile_app_features}
                onChange={(e) => setFormData(prev => ({ ...prev, mobile_app_features: e.target.value }))}
                placeholder="e.g., Push notifications, offline access, camera integration..."
                rows={3}
              />
            </div>

            <div className="survey-section">
              <label className="survey-label">
                Would you be willing to pay the same subscription price for a mobile app version?
              </label>
              <div className="radio-group">
                {[
                  { value: 'same_price', label: 'Yes, same price is fine' },
                  { value: 'cheaper', label: 'No, I\'d expect it to be cheaper' },
                  { value: 'free', label: 'No, I\'d expect it free if paying for web' },
                  { value: 'pay_more', label: 'I\'d pay MORE for mobile convenience' }
                ].map(option => (
                  <label key={option.value} className="radio-option">
                    <input
                      type="radio"
                      name="mobile_app_pricing"
                      value={option.value}
                      checked={formData.mobile_app_pricing === option.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, mobile_app_pricing: e.target.value }))}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {/* Open-ended Feedback */}
        <div className="survey-section">
          <label className="survey-label">What's working well?</label>
          <textarea
            value={formData.what_works_well}
            onChange={(e) => setFormData(prev => ({ ...prev, what_works_well: e.target.value }))}
            placeholder="Tell us what you love about the platform..."
            rows={4}
          />
        </div>

        <div className="survey-section">
          <label className="survey-label">What needs improvement?</label>
          <textarea
            value={formData.what_needs_improvement}
            onChange={(e) => setFormData(prev => ({ ...prev, what_needs_improvement: e.target.value }))}
            placeholder="What could be better?"
            rows={4}
          />
        </div>

        <div className="survey-section">
          <label className="survey-label">Feature requests</label>
          <textarea
            value={formData.feature_requests}
            onChange={(e) => setFormData(prev => ({ ...prev, feature_requests: e.target.value }))}
            placeholder="What features would you like to see?"
            rows={4}
          />
        </div>

        <div className="survey-section">
          <label className="survey-label">
            Would you be willing to provide a testimonial? (Optional)
          </label>
          <textarea
            value={formData.testimonial}
            onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
            placeholder="Share your experience (may be used in marketing materials)..."
            rows={3}
          />
        </div>

        {/* Final Questions */}
        <div className="survey-section">
          <label className="survey-label">
            Would you recommend this platform to others in your field?
          </label>
          <div className="radio-group-inline">
            <label className="radio-option">
              <input
                type="radio"
                name="would_recommend"
                value="true"
                checked={formData.would_recommend === true}
                onChange={() => setFormData(prev => ({ ...prev, would_recommend: true }))}
              />
              Yes
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="would_recommend"
                value="false"
                checked={formData.would_recommend === false}
                onChange={() => setFormData(prev => ({ ...prev, would_recommend: false }))}
              />
              No
            </label>
          </div>
        </div>

        <div className="survey-section">
          <label className="survey-label">
            Would you pay for this platform after the beta period ends?
          </label>
          <div className="radio-group-inline">
            <label className="radio-option">
              <input
                type="radio"
                name="would_pay_after_beta"
                value="true"
                checked={formData.would_pay_after_beta === true}
                onChange={() => setFormData(prev => ({ ...prev, would_pay_after_beta: true }))}
              />
              Yes
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="would_pay_after_beta"
                value="false"
                checked={formData.would_pay_after_beta === false}
                onChange={() => setFormData(prev => ({ ...prev, would_pay_after_beta: false }))}
              />
              No
            </label>
          </div>
        </div>

        {error && (
          <div className="survey-error">{error}</div>
        )}

        <button type="submit" className="survey-submit" disabled={loading}>
          <Send size={20} />
          {loading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};

export default BetaSurvey;
