import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignupPrompt({ feature = "full report" }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Don't show if user is already logged in
  if (isAuthenticated) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(217, 70, 239, 0.15) 0%, rgba(192, 38, 211, 0.15) 100%)',
      border: '2px solid #D946EF',
      borderRadius: '16px',
      padding: '2rem',
      margin: '2rem 0',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: '2rem',
        marginBottom: '0.5rem'
      }}>
        🔒
      </div>
      <h3 style={{
        color: '#D946EF',
        fontSize: '1.5rem',
        marginBottom: '1rem',
        fontWeight: 'bold'
      }}>
        Sign Up FREE to Unlock {feature}
      </h3>
      <p style={{
        color: '#fff',
        fontSize: '1.1rem',
        marginBottom: '1.5rem',
        lineHeight: 1.6
      }}>
        Create a free account to access:
      </p>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: '1.5rem 0',
        color: '#fff',
        fontSize: '1rem',
        lineHeight: 2
      }}>
        <li>✅ Download PDF lab request letter for your doctor</li>
        <li>✅ Save and track your results over time</li>
        <li>✅ Detailed cost breakdowns for recommended tests</li>
        <li>✅ Personalized action plan and resources</li>
        <li>✅ Access to hormone health knowledge base</li>
      </ul>
      <button
        onClick={() => navigate('/signup')}
        style={{
          background: 'linear-gradient(135deg, #D946EF 0%, #C026D3 100%)',
          color: '#fff',
          border: 'none',
          padding: '1rem 3rem',
          borderRadius: '30px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(217, 70, 239, 0.4)',
          transition: 'all 0.3s ease',
          marginTop: '1rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(217, 70, 239, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(217, 70, 239, 0.4)';
        }}
      >
        Create Free Account →
      </button>
      <p style={{
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.9rem',
        marginTop: '1rem'
      }}>
        No credit card required • 14-day free trial • Cancel anytime
      </p>
    </div>
  );
}
