import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function EmailReportModal({ isOpen, onClose, onSend, results, user }) {
  const { t } = useTranslation();
  const [recipientType, setRecipientType] = useState('self'); // self, provider, custom
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null); // null, 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSend = async () => {
    try {
      setIsSending(true);
      setSendStatus(null);
      setErrorMessage('');

      // Determine recipient email
      let recipientEmail = '';
      let recipientName = '';
      
      if (recipientType === 'self') {
        recipientEmail = user?.email || '';
        recipientName = user?.name || 'User';
      } else if (recipientType === 'custom') {
        if (!customEmail || !customEmail.includes('@')) {
          setErrorMessage('Please enter a valid email address');
          setIsSending(false);
          return;
        }
        recipientEmail = customEmail;
        recipientName = customName || 'Recipient';
      }

      // Call API to send email with PDF
      const response = await fetch('/api/endoguard/email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          recipientName,
          message,
          results,
          senderName: user?.name || 'Nexus User',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSendStatus('success');
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          // Reset form
          setRecipientType('self');
          setCustomEmail('');
          setCustomName('');
          setMessage('');
          setSendStatus(null);
        }, 2000);
      } else {
        setSendStatus('error');
        setErrorMessage(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email send error:', error);
      setSendStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content email-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Mail className="modal-icon" size={24} />
            <h2>Email Assessment Report</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {sendStatus === 'success' ? (
            <div className="send-success">
              <CheckCircle size={48} color="#10b981" />
              <h3>Email Sent Successfully!</h3>
              <p>Your EndoGuard assessment report has been delivered.</p>
            </div>
          ) : (
            <>
              {/* Recipient Type Selection */}
              <div className="form-group">
                <label>Send Report To:</label>
                <div className="recipient-options">
                  <button
                    className={`recipient-option ${recipientType === 'self' ? 'active' : ''}`}
                    onClick={() => setRecipientType('self')}
                  >
                    <Mail size={20} />
                    <span>Myself</span>
                    {user?.email && <small>{user.email}</small>}
                  </button>
                  
                  <button
                    className={`recipient-option ${recipientType === 'provider' ? 'active' : ''}`}
                    onClick={() => setRecipientType('provider')}
                    disabled
                    title="Coming soon - Provider portal integration"
                  >
                    <Mail size={20} />
                    <span>My Healthcare Provider</span>
                    <small className="coming-soon">Coming Soon</small>
                  </button>
                  
                  <button
                    className={`recipient-option ${recipientType === 'custom' ? 'active' : ''}`}
                    onClick={() => setRecipientType('custom')}
                  >
                    <Mail size={20} />
                    <span>Someone Else</span>
                  </button>
                </div>
              </div>

              {/* Custom Recipient Fields */}
              {recipientType === 'custom' && (
                <div className="custom-recipient-fields">
                  <div className="form-group">
                    <label htmlFor="recipientName">Recipient Name (Optional)</label>
                    <input
                      id="recipientName"
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Dr. Smith"
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="recipientEmail">Recipient Email *</label>
                    <input
                      id="recipientEmail"
                      type="email"
                      value={customEmail}
                      onChange={(e) => setCustomEmail(e.target.value)}
                      placeholder="doctor@example.com"
                      className="form-input"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Personal Message */}
              <div className="form-group">
                <label htmlFor="message">Personal Message (Optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personal note to include with your report..."
                  className="form-textarea"
                  rows={4}
                />
              </div>

              {/* Error Message */}
              {sendStatus === 'error' && (
                <div className="error-message">
                  <AlertCircle size={20} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Report Preview Info */}
              <div className="report-preview-info">
                <h4>Report Contents:</h4>
                <ul>
                  <li>Overall Risk Score: <strong>{results?.overallRisk?.score}/100</strong></li>
                  <li>EDC Exposure Analysis</li>
                  <li>Hormone Health Assessment</li>
                  <li>Personalized Recommendations</li>
                  <li>Laboratory Test Suggestions</li>
                  <li>Scientific Citations</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {sendStatus !== 'success' && (
          <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn-primary" 
              onClick={handleSend}
              disabled={isSending || (recipientType === 'custom' && !customEmail)}
            >
              {isSending ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Send Report
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .modal-icon {
          color: #D946EF;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 24px;
          color: #1f2937;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .modal-close:hover {
          background: #f3f4f6;
        }

        .modal-body {
          padding: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #374151;
        }

        .recipient-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .recipient-option {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .recipient-option:hover:not(:disabled) {
          border-color: #D946EF;
          background: #faf5ff;
        }

        .recipient-option.active {
          border-color: #D946EF;
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        }

        .recipient-option:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .recipient-option span {
          font-weight: 600;
          color: #1f2937;
          margin-top: 8px;
        }

        .recipient-option small {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .coming-soon {
          color: #D946EF !important;
          font-weight: 600;
        }

        .custom-recipient-fields {
          margin-top: 16px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 12px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #D946EF;
        }

        .form-textarea {
          resize: vertical;
          font-family: inherit;
        }

        .report-preview-info {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 12px;
          padding: 16px;
          margin-top: 20px;
        }

        .report-preview-info h4 {
          margin: 0 0 12px 0;
          color: #166534;
          font-size: 14px;
        }

        .report-preview-info ul {
          margin: 0;
          padding-left: 20px;
          color: #166534;
        }

        .report-preview-info li {
          margin-bottom: 6px;
          font-size: 14px;
        }

        .send-success {
          text-align: center;
          padding: 40px 20px;
        }

        .send-success h3 {
          color: #10b981;
          margin: 16px 0 8px 0;
        }

        .send-success p {
          color: #6b7280;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 16px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #D946EF 0%, #C026D3 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(217, 70, 239, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: #6b7280;
          border: 2px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .modal-content {
            max-height: 95vh;
          }
          
          .modal-header,
          .modal-body,
          .modal-footer {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
}
