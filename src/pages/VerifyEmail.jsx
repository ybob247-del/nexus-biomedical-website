import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error, already_verified
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link');
      return;
    }

    verifyEmail(token);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      const response = await fetch(`/api/auth/verify-email.js?token=${token}`);
      const data = await response.json();

      if (response.ok) {
        if (data.alreadyVerified) {
          setStatus('already_verified');
          setMessage('Your email is already verified');
        } else {
          setStatus('success');
          setMessage('Email verified successfully!');
        }
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('An error occurred during verification');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f1b2e] to-[#1a2942] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-gradient-to-br from-[#1a2942] to-[#0f1b2e] rounded-2xl shadow-2xl p-8 border border-cyan-500/20">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              Nexus Biomedical Intelligence
            </h1>
          </div>

          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {status === 'verifying' && (
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-cyan-500 border-t-transparent"></div>
            )}
            {status === 'success' && (
              <div className="bg-green-500/20 rounded-full p-4">
                <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            {status === 'already_verified' && (
              <div className="bg-blue-500/20 rounded-full p-4">
                <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-500/20 rounded-full p-4">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            )}
          </div>

          {/* Status Message */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">
              {status === 'verifying' && 'Verifying Your Email...'}
              {status === 'success' && 'Email Verified!'}
              {status === 'already_verified' && 'Already Verified'}
              {status === 'error' && 'Verification Failed'}
            </h2>
            <p className="text-gray-300 mb-6">
              {status === 'verifying' && 'Please wait while we verify your email address.'}
              {status === 'success' && 'Your email has been verified successfully. Redirecting to dashboard...'}
              {status === 'already_verified' && 'Your email is already verified. Redirecting to dashboard...'}
              {status === 'error' && message}
            </p>

            {/* Action Buttons */}
            {status === 'success' || status === 'already_verified' ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-cyan-500/30"
              >
                Go to Dashboard
              </button>
            ) : status === 'error' ? (
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 shadow-lg shadow-cyan-500/30"
                >
                  Back to Signup
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-200"
                >
                  Go to Login
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Need help?{' '}
            <a href="mailto:support@nexusbiomedical.ai" className="text-cyan-400 hover:text-cyan-300">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
