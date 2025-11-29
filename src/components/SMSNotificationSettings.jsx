import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/sms-notification-settings.css';

const SMSNotificationSettings = () => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load current settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/sms-settings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPhoneNumber(data.phone_number || '');
          setSmsEnabled(data.sms_notifications_enabled || false);
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
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as +1 (XXX) XXX-XXXX for US numbers
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
    // Extract digits only
    const digits = phone.replace(/\D/g, '');
    
    // Must be 11 digits (1 + 10 digit US number)
    if (digits.length !== 11) {
      return { valid: false, message: 'Please enter a valid US phone number (10 digits)' };
    }

    // Must start with 1 (US country code)
    if (!digits.startsWith('1')) {
      return { valid: false, message: 'Only US phone numbers are supported (+1)' };
    }

    return { valid: true, e164: `+${digits}` };
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

      const response = await fetch('/api/user/update-sms-settings', {
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

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: smsEnabled 
            ? '✅ SMS notifications enabled! You\'ll receive assessment reminders and health alerts.'
            : '✅ SMS notifications disabled. You won\'t receive text messages.'
        });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Failed to save SMS settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
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

  return (
    <div className="sms-settings-container">
      <div className="sms-settings-header">
        <h2>📱 SMS Notifications</h2>
        <p className="sms-settings-subtitle">
          Get text message reminders and health alerts
        </p>
      </div>

      <div className="sms-settings-card">
        {/* Enable/Disable Toggle */}
        <div className="sms-setting-row">
          <div className="sms-setting-info">
            <label className="sms-setting-label">Enable SMS Notifications</label>
            <p className="sms-setting-description">
              Receive assessment reminders, high-risk alerts, and health tips via text message
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
        <div className="sms-setting-row">
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

        {/* Privacy Notice */}
        <div className="sms-privacy-notice">
          <p className="sms-privacy-title">🔒 Privacy & Consent</p>
          <ul className="sms-privacy-list">
            <li>Your phone number is encrypted and never shared with third parties</li>
            <li>You can opt-out anytime by disabling SMS notifications</li>
            <li>Standard message and data rates may apply</li>
            <li>We comply with TCPA and GDPR regulations</li>
          </ul>
        </div>

        {/* Message Types */}
        {smsEnabled && (
          <div className="sms-message-types">
            <p className="sms-message-types-title">You'll receive:</p>
            <ul className="sms-message-types-list">
              <li>📅 Assessment reminders (7, 14, 30 days)</li>
              <li>🚨 High-risk health alerts (immediate)</li>
              <li>🎉 Progress celebrations (improvements)</li>
              <li>🧪 Lab test reminders</li>
              <li>💳 Subscription expiration notices</li>
            </ul>
          </div>
        )}

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
          {saving ? 'Saving...' : 'Save Settings'}
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
          <li>SMS notifications are enabled (toggle is ON)</li>
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

export default SMSNotificationSettings;
