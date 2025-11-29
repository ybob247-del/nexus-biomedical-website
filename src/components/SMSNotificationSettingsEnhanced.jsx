import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/sms-notification-settings.css';

const SMSNotificationSettingsEnhanced = () => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [preferences, setPreferences] = useState({
    sms_enabled: true,
    assessment_completed: true,
    high_risk_alert: true,
    trial_expiring: true,
    subscription_expiring: true,
    subscription_activated: true,
    assessment_reminder: true,
    lab_reminder: true,
    improvement_celebration: true,
    weekly_tips: true,
    monthly_reminder: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load current settings and preferences
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Load basic SMS settings
        const settingsResponse = await fetch('/api/user/sms-settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (settingsResponse.ok) {
          const data = await settingsResponse.json();
          setPhoneNumber(data.phone_number || '');
          setSmsEnabled(data.sms_notifications_enabled || false);
        }

        // Load notification preferences
        const prefsResponse = await fetch('/api/sms/notification-preferences', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (prefsResponse.ok) {
          const data = await prefsResponse.json();
          if (data.preferences && Object.keys(data.preferences).length > 0) {
            setPreferences(data.preferences);
          }
        }
      } catch (error) {
        console.error('Failed to load SMS settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const formatPhoneNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    
    if (digits.length === 0) return '';
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const validatePhoneNumber = (phone) => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length !== 11) {
      return { valid: false, message: 'Please enter a valid US phone number (10 digits)' };
    }

    if (!digits.startsWith('1')) {
      return { valid: false, message: 'Only US phone numbers are supported (+1)' };
    }

    return { valid: true, e164: `+${digits}` };
  };

  const handlePreferenceToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = async () => {
    setMessage({ type: '', text: '' });

    // Validate phone number if SMS is enabled
    if (smsEnabled) {
      if (!phoneNumber) {
        setMessage({ type: 'error', text: 'Please enter a phone number to enable SMS notifications' });
        return;
      }

      const validation = validatePhoneNumber(phoneNumber);
      if (!validation.valid) {
        setMessage({ type: 'error', text: validation.message });
        return;
      }
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const digits = phoneNumber.replace(/\D/g, '');
      const e164Phone = digits.length === 11 ? `+${digits}` : '';

      // Save basic SMS settings
      const settingsResponse = await fetch('/api/user/update-sms-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone_number: e164Phone,
          sms_notifications_enabled: smsEnabled
        })
      });

      if (!settingsResponse.ok) {
        const error = await settingsResponse.json();
        throw new Error(error.error || 'Failed to save SMS settings');
      }

      // Save notification preferences
      const prefsResponse = await fetch('/api/sms/notification-preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preferences: {
            ...preferences,
            sms_enabled: smsEnabled
          }
        })
      });

      if (!prefsResponse.ok) {
        const error = await prefsResponse.json();
        throw new Error(error.error || 'Failed to save notification preferences');
      }

      setMessage({ 
        type: 'success', 
        text: smsEnabled 
          ? '✅ SMS notification preferences saved successfully!'
          : '✅ SMS notifications disabled. You won\'t receive text messages.'
      });
    } catch (error) {
      console.error('Failed to save SMS settings:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="sms-settings-container">
        <div className="sms-settings-loading">Loading SMS settings...</div>
      </div>
    );
  }

  const notificationTypes = [
    {
      key: 'assessment_completed',
      label: 'Assessment Completed',
      description: 'Get notified when your EndoGuard assessment is complete with your risk score',
      icon: '📊'
    },
    {
      key: 'high_risk_alert',
      label: 'High Risk Alerts',
      description: 'Urgent notifications when your assessment shows high risk (≥70/100)',
      icon: '🚨',
      important: true
    },
    {
      key: 'trial_expiring',
      label: 'Trial Expiration Reminders',
      description: 'Reminders when your free trial is expiring (3 days and 1 day before)',
      icon: '⏰'
    },
    {
      key: 'subscription_expiring',
      label: 'Subscription Expiration',
      description: 'Notifications when your subscription is about to expire',
      icon: '💳'
    },
    {
      key: 'subscription_activated',
      label: 'Subscription Activated',
      description: 'Confirmation when your premium subscription is successfully activated',
      icon: '🎉'
    },
    {
      key: 'assessment_reminder',
      label: 'Assessment Reminders',
      description: 'Periodic reminders to take follow-up assessments (7, 14, 30 days)',
      icon: '📅'
    },
    {
      key: 'lab_reminder',
      label: 'Lab Test Reminders',
      description: 'Reminders to schedule recommended hormone tests',
      icon: '🧪'
    },
    {
      key: 'improvement_celebration',
      label: 'Progress Celebrations',
      description: 'Positive messages when your risk score improves',
      icon: '🎊'
    },
    {
      key: 'weekly_tips',
      label: 'Weekly Health Tips',
      description: 'Educational content and health tips sent weekly',
      icon: '💡'
    },
    {
      key: 'monthly_reminder',
      label: 'Monthly Check-ins',
      description: 'Monthly reminders to review your hormone health progress',
      icon: '📆'
    }
  ];

  return (
    <div className="sms-settings-container">
      <div className="sms-settings-header">
        <h2>📱 SMS Notification Preferences</h2>
        <p className="sms-settings-subtitle">
          Customize which text message notifications you want to receive
        </p>
      </div>

      <div className="sms-settings-card">
        {/* Master Enable/Disable Toggle */}
        <div className="sms-setting-row" style={{ borderBottom: '2px solid rgba(6, 182, 212, 0.2)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div className="sms-setting-info">
            <label className="sms-setting-label">Enable SMS Notifications</label>
            <p className="sms-setting-description">
              Master toggle for all SMS notifications
            </p>
          </div>
          <label className="sms-toggle">
            <input
              type="checkbox"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
            />
            <span className="sms-toggle-slider"></span>
          </label>
        </div>

        {/* Phone Number Input */}
        <div className="sms-setting-row" style={{ marginBottom: '2rem' }}>
          <div className="sms-setting-info">
            <label className="sms-setting-label" htmlFor="phone-number">
              Phone Number
            </label>
            <p className="sms-setting-description">
              US phone numbers only. Format: +1 (555) 123-4567
            </p>
          </div>
          <input
            id="phone-number"
            type="tel"
            className="sms-phone-input"
            placeholder="+1 (555) 123-4567"
            value={phoneNumber}
            onChange={handlePhoneChange}
            disabled={!smsEnabled}
            maxLength={18}
          />
        </div>

        {/* Granular Notification Preferences */}
        {smsEnabled && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ color: '#60a5fa', fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
              Notification Types
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Choose which types of SMS notifications you want to receive
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {notificationTypes.map((type) => (
                <div 
                  key={type.key}
                  className="sms-setting-row"
                  style={{
                    background: type.important ? 'rgba(239, 68, 68, 0.1)' : 'rgba(15, 23, 42, 0.5)',
                    border: type.important ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(6, 182, 212, 0.2)',
                    borderRadius: '0.75rem',
                    padding: '1rem'
                  }}
                >
                  <div className="sms-setting-info" style={{ flex: 1 }}>
                    <label className="sms-setting-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{type.icon}</span>
                      {type.label}
                      {type.important && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: '#ef4444', 
                          fontWeight: 600,
                          marginLeft: '0.5rem'
                        }}>
                          RECOMMENDED
                        </span>
                      )}
                    </label>
                    <p className="sms-setting-description">
                      {type.description}
                    </p>
                  </div>
                  <label className="sms-toggle">
                    <input
                      type="checkbox"
                      checked={preferences[type.key] !== false}
                      onChange={() => handlePreferenceToggle(type.key)}
                    />
                    <span className="sms-toggle-slider"></span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="sms-privacy-notice" style={{ marginTop: '2rem' }}>
          <p className="sms-privacy-title">🔒 Privacy & Consent</p>
          <ul className="sms-privacy-list">
            <li>Your phone number is encrypted and never shared with third parties</li>
            <li>You can opt-out anytime by disabling SMS notifications</li>
            <li>You can customize individual notification types above</li>
            <li>Standard message and data rates may apply</li>
            <li>We comply with TCPA and GDPR regulations</li>
          </ul>
        </div>

        {/* Status Message */}
        {message.text && (
          <div className={`sms-message sms-message-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Save Button */}
        <button
          className="sms-save-button"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>

      {/* Help Section */}
      <div className="sms-help-section">
        <h3>Need Help?</h3>
        <p>
          If you're not receiving SMS notifications, check that:
        </p>
        <ul>
          <li>Your phone number is correct and in E.164 format</li>
          <li>SMS notifications are enabled (master toggle is ON)</li>
          <li>The specific notification type is enabled above</li>
          <li>Your phone can receive SMS from short codes</li>
          <li>You haven't blocked messages from our number</li>
        </ul>
        <p>
          Contact support at <a href="mailto:support@nexusbiomedical.ai">support@nexusbiomedical.ai</a> if issues persist.
        </p>
      </div>
    </div>
  );
};

export default SMSNotificationSettingsEnhanced;
