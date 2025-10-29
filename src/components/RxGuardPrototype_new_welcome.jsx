// This is the new welcome screen section for RxGuard - to be integrated into RxGuardPrototype.jsx

// WELCOME SCREEN - NEW MODERN LAYOUT
if (currentStep === 'welcome') {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #cffafe 50%, #a5f3fc 100%)',
      padding: '4rem 2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Back Button */}
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'fixed',
              top: '2rem',
              left: '2rem',
              background: '#00A8CC',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
              zIndex: 1001,
              boxShadow: '0 4px 12px rgba(0, 168, 204, 0.3)'
            }}
          >
            ← Back to Home
          </button>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(0, 168, 204, 0.3)'
          }}>
            AI-POWERED MEDICATION SAFETY
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1e293b 0%, #00A8CC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            RxGuard™ Interactive Demo
          </h1>

          <p style={{
            fontSize: '1.5rem',
            color: '#475569',
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Experience how AI-powered drug interaction detection protects patients and reduces healthcare costs
          </p>

          {/* Stats Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid #cbd5e1'
          }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00A8CC', lineHeight: '1.3' }}>100K+ Deaths</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>FDA adverse event records analyzed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00A8CC', lineHeight: '1.3' }}>10,000+ Interactions</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>Detected</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#00A8CC', lineHeight: '1.3' }}>$85K/Event</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>Cost-powered predictions</div>
            </div>
          </div>
        </motion.div>

        {/* Scenarios Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: '4rem' }}
        >
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            Explore Real Clinical Scenarios
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '3rem',
            maxWidth: '800px',
            margin: '0 auto 3rem auto'
          }}>
            See how RxGuard™ detects life-threatening interactions instantly • No signup required • Real FDA data
          </p>

          {/* Scenario Cards */}
          <div style={{ display: 'grid', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            {scenarios.map((scenario, idx) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                onClick={() => {
                  setSelectedScenario(scenario);
                  setCurrentStep('results');
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '16px',
                  padding: '2rem',
                  cursor: 'pointer',
                  border: '2px solid #cbd5e1',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 168, 204, 0.2)';
                  e.currentTarget.style.borderColor = '#00A8CC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
                      {scenario.title}
                    </h3>
                    <p style={{ fontSize: '1.2rem', color: '#00A8CC', fontWeight: 600, marginBottom: '0.5rem' }}>
                      {scenario.subtitle}
                    </p>
                    <p style={{ fontSize: '1rem', color: '#64748b' }}>
                      {scenario.description}
                    </p>
                  </div>
                  <div style={{
                    background: scenario.severity.includes('10') ? '#dc2626' : scenario.severity.includes('9') ? '#f97316' : '#eab308',
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    marginLeft: '1rem'
                  }}>
                    {scenario.severity}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '1rem',
                  marginTop: '1.5rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Timeline</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
                      {scenario.medications.length} medications
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>Est. Cost</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' }}>
                      ${(scenario.annualCost / 1000000).toFixed(0)}M annually
                    </div>
                  </div>
                  <button style={{
                    background: 'linear-gradient(135deg, #00A8CC 0%, #0086A8 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 2rem',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 168, 204, 0.3)'
                  }}>
                    Try This Scenario →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Calculator CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #1e293b 0%, #00A8CC 100%)',
            borderRadius: '24px',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(0, 168, 204, 0.3)'
          }}
        >
          <h3 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
            Build Your Own Scenario
          </h3>
          <p style={{ fontSize: '1.3rem', color: '#cbd5e1', marginBottom: '2rem', lineHeight: '1.6' }}>
            Use our interactive calculator to analyze any medication combination with real-time FDA data
          </p>
          <button
            onClick={handleStartCustom}
            style={{
              background: 'white',
              color: '#00A8CC',
              border: 'none',
              padding: '1.25rem 3rem',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Open Interactive Calculator →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

