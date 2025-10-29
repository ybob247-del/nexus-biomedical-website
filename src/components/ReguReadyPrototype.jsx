import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ReguReadyPrototype({ onBack }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    {
      id: 'class-ii-510k',
      title: 'Class II Medical Device',
      subtitle: '510(k) Premarket Notification',
      description: 'Wearable cardiac monitor - substantial equivalence pathway',
      severity: 'MODERATE COMPLEXITY',
      severityColor: 'bg-blue-600',
      timeline: '6-8 months',
      costRange: '$75K - $150K',
      milestones: [
        { phase: 'Device Classification', status: 'Complete', duration: '2 weeks', cost: '$5K' },
        { phase: 'Predicate Device Search', status: 'Complete', duration: '3 weeks', cost: '$15K' },
        { phase: 'Testing & Documentation', status: 'In Progress', duration: '12 weeks', cost: '$60K' },
        { phase: '510(k) Submission Prep', status: 'Pending', duration: '6 weeks', cost: '$35K' },
        { phase: 'FDA Review', status: 'Pending', duration: '90 days', cost: '$10K' },
        { phase: 'Clearance', status: 'Pending', duration: '2 weeks', cost: '$5K' }
      ],
      risks: [
        'Predicate device may be challenged',
        'Additional testing may be required',
        'FDA may request more clinical data'
      ],
      recommendations: [
        'Strengthen substantial equivalence argument with 3 predicate devices',
        'Conduct biocompatibility testing early (ISO 10993)',
        'Prepare comprehensive risk analysis (ISO 14971)',
        'Budget 20% contingency for additional FDA requests'
      ],
      savings: {
        traditionalCost: 180000,
        optimizedCost: 130000,
        timeSaved: '2-3 months',
        successRate: '92%'
      }
    },
    {
      id: 'class-iii-pma',
      title: 'Class III Medical Device',
      subtitle: 'Premarket Approval (PMA)',
      description: 'Implantable cardiovascular stent - full clinical trial required',
      severity: 'HIGH COMPLEXITY',
      severityColor: 'bg-red-600',
      timeline: '18-24 months',
      costRange: '$2M - $5M',
      milestones: [
        { phase: 'Pre-Submission Meeting', status: 'Complete', duration: '3 months', cost: '$50K' },
        { phase: 'Clinical Trial Design', status: 'Complete', duration: '4 months', cost: '$200K' },
        { phase: 'Clinical Trial Execution', status: 'In Progress', duration: '12 months', cost: '$2.5M' },
        { phase: 'PMA Module Preparation', status: 'Pending', duration: '6 months', cost: '$500K' },
        { phase: 'FDA Panel Review', status: 'Pending', duration: '6 months', cost: '$300K' },
        { phase: 'Approval & Labeling', status: 'Pending', duration: '3 months', cost: '$100K' }
      ],
      risks: [
        'Clinical trial enrollment delays (avg 6 months)',
        'Adverse events may require protocol amendments',
        'FDA panel may recommend denial or additional studies'
      ],
      recommendations: [
        'Engage FDA early with Pre-Sub meetings (21 CFR 814.20)',
        'Use adaptive trial design to reduce timeline by 4-6 months',
        'Prepare robust statistical analysis plan with FDA input',
        'Budget $500K contingency for protocol amendments'
      ],
      savings: {
        traditionalCost: 4200000,
        optimizedCost: 3650000,
        timeSaved: '4-6 months',
        successRate: '78%'
      }
    },
    {
      id: 'de-novo',
      title: 'Novel Low-Risk Device',
      subtitle: 'De Novo Classification',
      description: 'AI-powered diagnostic software - no predicate exists',
      severity: 'MODERATE COMPLEXITY',
      severityColor: 'bg-orange-600',
      timeline: '10-12 months',
      costRange: '$200K - $400K',
      milestones: [
        { phase: 'Pre-Submission Consultation', status: 'Complete', duration: '2 months', cost: '$30K' },
        { phase: 'Risk Classification Analysis', status: 'Complete', duration: '6 weeks', cost: '$40K' },
        { phase: 'Clinical Validation Study', status: 'In Progress', duration: '5 months', cost: '$180K' },
        { phase: 'De Novo Request Preparation', status: 'Pending', duration: '8 weeks', cost: '$80K' },
        { phase: 'FDA Review & Classification', status: 'Pending', duration: '150 days', cost: '$50K' },
        { phase: 'Special Controls Established', status: 'Pending', duration: '1 month', cost: '$20K' }
      ],
      risks: [
        'FDA may determine device is Class III (requires PMA)',
        'Clinical validation may need expansion',
        'Algorithm transparency requirements unclear'
      ],
      recommendations: [
        'Demonstrate low-risk profile with comprehensive bench testing',
        'Provide algorithm validation data (FDA AI/ML guidance)',
        'Establish special controls framework proactively',
        'Prepare 510(k) pathway for future similar devices'
      ],
      savings: {
        traditionalCost: 450000,
        optimizedCost: 320000,
        timeSaved: '3-4 months',
        successRate: '85%'
      }
    }
  ];

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
  };

  const handleBack = () => {
    setSelectedScenario(null);
  };

  if (selectedScenario) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f3e8ff 50%, #e9d5ff 100%)',
        padding: '2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: 'auto'
      }}>
        <button
          onClick={handleBack}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          ← Back
        </button>

        <div style={{ maxWidth: '1400px', margin: '0 auto', paddingTop: '5rem' }}>
          {/* Alert Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              padding: '1.5rem 2rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, lineHeight: '1.8' }}>
              Regulatory Pathway Analysis Complete
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.7' }}>
              Optimized submission strategy identified • Timeline: {selectedScenario.timeline} • Est. Cost: {selectedScenario.costRange}
            </p>
          </motion.div>

          {/* Two-Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Pathway Details */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Device Info Card */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #475569',
                lineHeight: '1.8'
              }}>
                <div style={{ marginBottom: '2rem' }}>
                  <span className={`${selectedScenario.severityColor} text-white px-4 py-2 rounded-full text-sm font-bold inline-block mb-4`}>
                    {selectedScenario.severity}
                  </span>
                  <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                    {selectedScenario.title}
                  </h2>
                  <p style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {selectedScenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8' }}>
                    {selectedScenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Timeline</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{selectedScenario.timeline}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Est. Cost</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{selectedScenario.costRange}</p>
                  </div>
                </div>
              </div>

              {/* Regulatory Milestones */}
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #475569'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e293b', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Regulatory Milestones
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {selectedScenario.milestones.map((milestone, index) => (
                    <div key={index} style={{
                      padding: '1.5rem',
                      background: milestone.status === 'Complete' ? '#f0fdf4' : milestone.status === 'In Progress' ? '#fef3c7' : '#f8fafc',
                      borderRadius: '12px',
                      border: `3px solid ${milestone.status === 'Complete' ? '#10b981' : milestone.status === 'In Progress' ? '#f59e0b' : '#cbd5e1'}`,
                      lineHeight: '1.7'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: '1.5' }}>
                            {milestone.phase}
                          </h4>
                          <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0.25rem 0 0 0', lineHeight: '1.6' }}>
                            {milestone.duration} • {milestone.cost}
                          </p>
                        </div>
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: milestone.status === 'Complete' ? '#10b981' : milestone.status === 'In Progress' ? '#f59e0b' : '#64748b',
                          padding: '0.25rem 0.75rem',
                          background: 'white',
                          borderRadius: '12px'
                        }}>
                          {milestone.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div style={{
                backgroundColor: '#fef2f2',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #ef4444'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#dc2626', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Key Risks
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.risks.map((risk, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#7f1d1d', marginBottom: '0.75rem' }}>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #10b981'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#059669', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  AI Recommendations
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.recommendations.map((rec, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#065f46', marginBottom: '0.75rem' }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Right Column: Cost Impact Calculator */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #475569',
                position: 'sticky',
                top: '2rem'
              }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '2rem', lineHeight: '1.5' }}>
                  Cost Impact Calculator
                </h3>

                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Traditional Pathway Cost
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444', lineHeight: '1.3' }}>
                      ${selectedScenario.savings.traditionalCost.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      ReguReady™ Optimized Cost
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981', lineHeight: '1.3' }}>
                      ${selectedScenario.savings.optimizedCost.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Time Saved
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>
                      {selectedScenario.savings.timeSaved}
                    </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      FDA Approval Success Rate
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#8b5cf6', lineHeight: '1.3' }}>
                      {selectedScenario.savings.successRate}
                    </div>
                  </div>

                  <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '16px',
                    marginTop: '2.5rem'
                  }}>
                    <p style={{ fontSize: '1rem', color: 'white', opacity: 0.9, marginBottom: '0.75rem', fontWeight: 600 }}>
                      Total Cost Savings
                    </p>
                    <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white', lineHeight: '1.2' }}>
                      ${(selectedScenario.savings.traditionalCost - selectedScenario.savings.optimizedCost).toLocaleString()}
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9, marginTop: '1rem', lineHeight: '1.7' }}>
                      {Math.round(((selectedScenario.savings.traditionalCost - selectedScenario.savings.optimizedCost) / selectedScenario.savings.traditionalCost) * 100)}% cost reduction
                    </p>
                  </div>
                </div>

                <div style={{
                  padding: '2rem',
                  background: '#eff6ff',
                  borderRadius: '12px',
                  marginTop: '2rem',
                  border: '2px solid #3b82f6'
                }}>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e40af', marginBottom: '1rem', lineHeight: '1.5' }}>
                    Data Source
                  </h4>
                  <p style={{ fontSize: '0.95rem', color: '#1e40af', lineHeight: '1.8', margin: 0 }}>
                    FDA CDRH database • 21 CFR Part 814 • Industry benchmarks from 500+ submissions • Real-world approval timelines
                  </p>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '2rem',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ReguReady'}
                >
                  Start Free Trial →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f3e8ff 50%, #e9d5ff 100%)',
      padding: '4rem 2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: '#10b981',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '30px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}
        >
          ← Back to Home
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '2rem' }}
        >
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            AI-POWERED REGULATORY GUIDANCE
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            ReguReady™ Interactive Demo
          </h1>

          <p style={{
            fontSize: '1.5rem',
            color: '#475569',
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Experience how AI-powered regulatory guidance accelerates FDA submissions and reduces approval costs
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
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>Built on Real FDA Data</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>CDRH database-powered</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>500+ FDA Pathways</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>Clearance routes analyzed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>$31M Avg Cost</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>FDA submission (industry data)</div>
            </div>
          </div>
        </motion.div>

        {/* Scenarios Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1e293b',
            textAlign: 'center',
            marginBottom: '1rem',
            lineHeight: '1.4'
          }}>
            Explore Real Regulatory Scenarios
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '3rem',
            lineHeight: '1.8'
          }}>
            See how ReguReady™ optimizes FDA pathways instantly • No signup required • Real CDRH data
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
            {scenarios.map((scenario, index) => (
              <motion.div
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}
                style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '2rem',
                  padding: '2.5rem',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  border: '4px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => handleScenarioSelect(scenario)}
              >
                <div style={{ marginBottom: '2rem' }}>
                  <div className={`inline-block px-4 py-2 ${scenario.severityColor} text-white rounded-full text-sm font-bold mb-5`}>
                    {scenario.severity}
                  </div>
                  <h3 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    {scenario.title}
                  </h3>
                  <p style={{ fontSize: '1.25rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {scenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8' }}>
                    {scenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Timeline</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{scenario.timeline}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Est. Cost</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{scenario.costRange}</p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleScenarioSelect(scenario);
                  }}
                >
                  Try This Scenario →
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'linear-gradient(135deg, #1e293b 0%, #3b82f6 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: '1.4' }}>
            Ready to Accelerate Your FDA Submission?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: '1.8' }}>
            Start your free trial and get regulatory guidance in minutes • No credit card required
          </p>
          <button
            style={{
              background: 'white',
              color: '#1e293b',
              border: 'none',
              padding: '1.25rem 3rem',
              borderRadius: '30px',
              fontSize: '1.25rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ReguReady'}
          >
            Start Free Trial →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

