import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, AlertCircle, Loader, UserPlus } from 'lucide-react';

const AcceptInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);

  const invitationToken = searchParams.get('token');

  useEffect(() => {
    if (!invitationToken) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }

    fetchInvitationDetails();
  }, [invitationToken]);

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(`/api/provider/invitation/${invitationToken}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid or expired invitation');
      }

      const data = await response.json();
      setInvitation(data.invitation);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!isAuthenticated) {
      // Redirect to signup with invitation token
      navigate(`/signup?invitation=${invitationToken}`);
      return;
    }

    setAccepting(true);
    setError('');

    try {
      const response = await fetch('/api/provider/accept-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ invitation_token: invitationToken })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to accept invitation');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Invitation Accepted!</h1>
            <p className="text-gray-600 mb-6">
              You've been successfully linked to your provider. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <UserPlus className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Provider Invitation</h1>
          </div>
          <p className="text-purple-100">
            You've been invited to join a healthcare provider's patient portal
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {invitation && (
            <>
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Invitation Details</h2>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                  <div>
                    <span className="text-gray-600">From:</span>
                    <p className="font-medium text-gray-900">
                      {invitation.provider_name}
                      {invitation.provider_credentials && ` (${invitation.provider_credentials})`}
                    </p>
                    {invitation.practice_name && (
                      <p className="text-sm text-gray-600">{invitation.practice_name}</p>
                    )}
                  </div>

                  {invitation.invitation_message && (
                    <div className="pt-3 border-t border-gray-200">
                      <span className="text-gray-600">Message:</span>
                      <p className="text-gray-900 italic mt-1">"{invitation.invitation_message}"</p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-200">
                    <span className="text-gray-600">Expires:</span>
                    <p className="font-medium text-gray-900">
                      {new Date(invitation.expires_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>Your provider will be able to view your EndoGuard™ assessment results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>They can track your hormone health progress over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>You maintain full control and can revoke access anytime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>All data sharing is HIPAA-ready and secure</span>
                  </li>
                </ul>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAcceptInvitation}
                  disabled={accepting}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {accepting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      {isAuthenticated ? 'Accept Invitation' : 'Sign Up & Accept'}
                    </>
                  )}
                </button>
              </div>

              {!isAuthenticated && (
                <p className="text-center text-sm text-gray-600 mt-4">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate(`/login?invitation=${invitationToken}`)}
                    className="text-purple-600 hover:underline font-medium"
                  >
                    Log in instead
                  </button>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvitation;
