import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Users, Building2, CheckCircle, XCircle, 
  Mail, Eye, Search, Filter, TrendingUp, AlertCircle 
} from 'lucide-react';

const AdminProviderManagement = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    provider_type: 'physician',
    specialty: ''
  });
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState('');
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/providers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }

      const data = await response.json();
      setProviders(data.providers || []);
      setPendingInvitations(data.pending_invitations || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInviteProvider = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/invite-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(inviteForm)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }

      setInviteSuccess(true);
      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(false);
        setInviteForm({
          email: '',
          first_name: '',
          last_name: '',
          provider_type: 'physician',
          specialty: ''
        });
        fetchProviders();
      }, 2000);
    } catch (error) {
      setInviteError(error.message);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleViewAsProvider = async (providerId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/impersonate-provider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ provider_id: providerId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to impersonate provider');
      }

      // Store the impersonation token and redirect to provider dashboard
      localStorage.setItem('impersonation_token', data.token);
      localStorage.setItem('original_token', token);
      navigate('/provider/dashboard');
    } catch (error) {
      console.error('Error impersonating provider:', error);
      alert('Failed to view as provider: ' + error.message);
    }
  };

  const filteredProviders = providers.filter(provider => {
    const matchesSearch = 
      provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialty?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterType === 'all' || 
      provider.provider_type === filterType;

    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: providers.length,
    active: providers.filter(p => p.verified).length,
    pending: pendingInvitations.length,
    totalPatients: providers.reduce((sum, p) => sum + (p.patient_count || 0), 0)
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      paddingTop: '80px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            Provider Management
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            Manage provider access and view provider dashboards
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Users size={32} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.total}</div>
                <div style={{ opacity: 0.9 }}>Total Providers</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle size={32} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.active}</div>
                <div style={{ opacity: 0.9 }}>Active Providers</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Mail size={32} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.pending}</div>
                <div style={{ opacity: 0.9 }}>Pending Invitations</div>
              </div>
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            padding: '1.5rem',
            borderRadius: '12px',
            color: '#fff'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <TrendingUp size={32} />
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 700 }}>{stats.totalPatients}</div>
                <div style={{ opacity: 0.9 }}>Total Patients</div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          <button
            onClick={() => setShowInviteModal(true)}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <UserPlus size={20} />
            Invite Provider
          </button>

          <div style={{ flex: 1, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search 
                size={20} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: '#94a3b8'
                }} 
              />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '1rem'
                }}
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Types</option>
              <option value="physician">Physicians</option>
              <option value="nurse_practitioner">Nurse Practitioners</option>
              <option value="physician_assistant">Physician Assistants</option>
              <option value="clinic">Clinics</option>
              <option value="hospital">Hospitals</option>
            </select>
          </div>
        </div>

        {/* Pending Invitations */}
        {pendingInvitations.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Pending Invitations ({pendingInvitations.length})
            </h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {pendingInvitations.map(invitation => (
                <div
                  key={invitation.id}
                  style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    border: '1px solid rgba(251, 191, 36, 0.3)',
                    padding: '1rem',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>
                      {invitation.first_name} {invitation.last_name}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      {invitation.email} • {invitation.specialty || invitation.provider_type}
                    </div>
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '0.9rem' }}>
                    Invited {new Date(invitation.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Providers List */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '1rem' }}>
            Active Providers ({filteredProviders.length})
          </h2>
          
          {loading ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: '3rem' }}>
              Loading providers...
            </div>
          ) : filteredProviders.length === 0 ? (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3rem',
              borderRadius: '12px',
              textAlign: 'center',
              color: '#94a3b8'
            }}>
              No providers found
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {filteredProviders.map(provider => (
                <div
                  key={provider.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 600, margin: 0 }}>
                        {provider.name || `${provider.first_name} ${provider.last_name}`}
                      </h3>
                      {provider.verified && (
                        <CheckCircle size={20} style={{ color: '#10b981' }} />
                      )}
                    </div>
                    <div style={{ color: '#94a3b8', marginBottom: '0.5rem' }}>
                      {provider.email}
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                      <span style={{ color: '#60a5fa' }}>
                        <Building2 size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        {provider.specialty || provider.provider_type}
                      </span>
                      <span style={{ color: '#a78bfa' }}>
                        <Users size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                        {provider.patient_count || 0} patients
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewAsProvider(provider.user_id)}
                    style={{
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Eye size={18} />
                    View as Provider
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            padding: '2rem',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h2 style={{ color: '#fff', fontSize: '1.75rem', marginBottom: '1.5rem' }}>
              Invite Provider
            </h2>

            {inviteSuccess ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '1rem',
                borderRadius: '8px',
                color: '#10b981',
                textAlign: 'center'
              }}>
                <CheckCircle size={48} style={{ margin: '0 auto 1rem' }} />
                <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                  Invitation sent successfully!
                </div>
              </div>
            ) : (
              <form onSubmit={handleInviteProvider}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.first_name}
                      onChange={(e) => setInviteForm({ ...inviteForm, first_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '1rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inviteForm.last_name}
                      onChange={(e) => setInviteForm({ ...inviteForm, last_name: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                    Provider Type *
                  </label>
                  <select
                    required
                    value={inviteForm.provider_type}
                    onChange={(e) => setInviteForm({ ...inviteForm, provider_type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '1rem',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="physician">Physician</option>
                    <option value="nurse_practitioner">Nurse Practitioner</option>
                    <option value="physician_assistant">Physician Assistant</option>
                    <option value="clinic">Clinic</option>
                    <option value="hospital">Hospital</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ color: '#94a3b8', display: 'block', marginBottom: '0.5rem' }}>
                    Specialty
                  </label>
                  <input
                    type="text"
                    value={inviteForm.specialty}
                    onChange={(e) => setInviteForm({ ...inviteForm, specialty: e.target.value })}
                    placeholder="e.g., Endocrinology, Family Medicine"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                {inviteError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    color: '#ef4444',
                    marginBottom: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    {inviteError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="submit"
                    disabled={inviteLoading}
                    style={{
                      flex: 1,
                      background: inviteLoading 
                        ? 'rgba(59, 130, 246, 0.5)' 
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: inviteLoading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {inviteLoading ? 'Sending...' : 'Send Invitation'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowInviteModal(false);
                      setInviteError('');
                    }}
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProviderManagement;
