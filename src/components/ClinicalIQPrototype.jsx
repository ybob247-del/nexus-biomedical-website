import { useState } from 'react';
import { motion } from 'framer-motion';
import BetaDisclaimer from './BetaDisclaimer';

export default function ClinicalIQPrototype({ onBack }) {
  const [selectedScenario, setSelectedScenario] = useState(null);

  const scenarios = [
    {
      id: 'oncology-phase3',
      title: 'Oncology Phase III Trial',
      subtitle: 'Non-Small Cell Lung Cancer - PD-L1 Inhibitor',
      description: 'Multi-center, randomized, double-blind trial comparing novel PD-L1 inhibitor vs. standard of care',
      severity: 'HIGH COMPLEXITY',
      severityColor: 'bg-red-600',
      enrollment: '450 patients',
      timeline: '36 months',
      successProbability: 68,
      protocolIssues: [
        'Inclusion criteria too restrictive (estimated 15% screen failure rate)',
        'Primary endpoint (OS) requires long follow-up - consider PFS as primary',
        'Competing trials recruiting similar population (3 active trials identified)',
        'Site selection suboptimal - 40% of sites have no prior oncology trial experience'
      ],
      recommendations: [
        'Broaden inclusion criteria to include ECOG 2 patients (increase eligible population by 25%)',
        'Change primary endpoint to PFS with OS as key secondary (reduce trial duration by 8-12 months)',
        'Add 5 high-performing sites in US and EU with proven oncology enrollment track record',
        'Implement competitive enrollment bonuses for sites exceeding targets'
      ],
      siteRecommendations: [
        { site: 'MD Anderson Cancer Center', location: 'Houston, TX', enrollmentRate: '3.2 patients/month', experience: 'High' },
        { site: 'Memorial Sloan Kettering', location: 'New York, NY', enrollmentRate: '2.8 patients/month', experience: 'High' },
        { site: 'Dana-Farber Cancer Institute', location: 'Boston, MA', enrollmentRate: '2.5 patients/month', experience: 'High' }
      ],
      costAnalysis: {
        traditionalCost: 42000000,
        optimizedCost: 31500000,
        timeTraditional: '48 months',
        timeOptimized: '36 months',
        successRate: '68%',
        enrollmentForecast: '12.5 patients/month (85% confidence)'
      }
    },
    {
      id: 'rare-disease-phase2',
      title: 'Rare Disease Phase II Trial',
      subtitle: 'Duchenne Muscular Dystrophy - Gene Therapy',
      description: 'Open-label, single-arm trial evaluating gene therapy in ambulatory DMD patients aged 4-7',
      severity: 'MODERATE COMPLEXITY',
      severityColor: 'bg-orange-600',
      enrollment: '24 patients',
      timeline: '18 months',
      successProbability: 82,
      protocolIssues: [
        'Ultra-rare patient population (estimated 200 eligible patients in US)',
        'Age range too narrow (4-7 years) - only 40% of DMD population',
        'No established patient registries identified for recruitment',
        'Endpoint (6-minute walk test) may not be sensitive enough for this age group'
      ],
      recommendations: [
        'Expand age range to 4-12 years (increase eligible population by 150%)',
        'Partner with Duchenne Registry and Parent Project Muscular Dystrophy for recruitment',
        'Add motor function composite score as co-primary endpoint',
        'Implement social media recruitment campaign targeting DMD parent communities',
        'Offer travel reimbursement and lodging support to increase geographic reach'
      ],
      siteRecommendations: [
        { site: 'Nationwide Children\'s Hospital', location: 'Columbus, OH', enrollmentRate: '1.2 patients/month', experience: 'High' },
        { site: 'UCLA Medical Center', location: 'Los Angeles, CA', enrollmentRate: '0.9 patients/month', experience: 'High' },
        { site: 'Children\'s Hospital of Philadelphia', location: 'Philadelphia, PA', enrollmentRate: '0.8 patients/month', experience: 'High' }
      ],
      costAnalysis: {
        traditionalCost: 8500000,
        optimizedCost: 6200000,
        timeTraditional: '24 months',
        timeOptimized: '18 months',
        successRate: '82%',
        enrollmentForecast: '1.3 patients/month (78% confidence)'
      }
    },
    {
      id: 'cardiovascular-phase3',
      title: 'Cardiovascular Phase III Trial',
      subtitle: 'Heart Failure - SGLT2 Inhibitor',
      description: 'Randomized, placebo-controlled trial in HFrEF patients evaluating cardiovascular outcomes',
      severity: 'HIGH COMPLEXITY',
      severityColor: 'bg-blue-600',
      enrollment: '5000 patients',
      timeline: '48 months',
      successProbability: 75,
      protocolIssues: [
        'Very large enrollment target (5000 patients) with aggressive timeline',
        'Competing SGLT2 inhibitor trials saturating recruitment pool',
        'Primary endpoint (CV death + HF hospitalization) requires long follow-up',
        'Site activation delays averaging 6 months per site'
      ],
      recommendations: [
        'Increase site count from 200 to 300 sites to accelerate enrollment',
        'Implement adaptive design with interim futility analysis at 50% enrollment',
        'Add sites in Eastern Europe and Latin America for faster enrollment',
        'Streamline site activation process with centralized IRB and remote monitoring',
        'Consider enrichment strategy targeting patients with recent HF hospitalization'
      ],
      siteRecommendations: [
        { site: 'Cleveland Clinic', location: 'Cleveland, OH', enrollmentRate: '4.5 patients/month', experience: 'High' },
        { site: 'Mayo Clinic', location: 'Rochester, MN', enrollmentRate: '3.8 patients/month', experience: 'High' },
        { site: 'Duke University Medical Center', location: 'Durham, NC', enrollmentRate: '3.2 patients/month', experience: 'High' }
      ],
      costAnalysis: {
        traditionalCost: 125000000,
        optimizedCost: 98000000,
        timeTraditional: '60 months',
        timeOptimized: '48 months',
        successRate: '75%',
        enrollmentForecast: '104 patients/month (82% confidence)'
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
        background: 'linear-gradient(135deg, #f8fafc 0%, #dcfce7 50%, #d1fae5 100%)',
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
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '1.5rem 2rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, lineHeight: '1.8' }}>
              Trial Success Probability: {selectedScenario.successProbability}%
            </h3>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '1.1rem', opacity: 0.95, lineHeight: '1.7' }}>
              AI analysis complete • {selectedScenario.enrollment} target • {selectedScenario.timeline} estimated timeline
            </p>
          </motion.div>

          {/* Two-Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Left Column: Protocol Analysis */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Trial Info Card */}
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
                  <p style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {selectedScenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8' }}>
                    {selectedScenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Enrollment Target</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{selectedScenario.enrollment}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Est. Timeline</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{selectedScenario.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Protocol Issues */}
              <div style={{
                backgroundColor: '#fef2f2',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #ef4444'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#dc2626', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Protocol Issues Identified
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.protocolIssues.map((issue, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#7f1d1d', marginBottom: '0.75rem' }}>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Recommendations */}
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '2rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #10b981'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#059669', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  AI Optimization Recommendations
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '2' }}>
                  {selectedScenario.recommendations.map((rec, index) => (
                    <li key={index} style={{ fontSize: '1.05rem', color: '#065f46', marginBottom: '0.75rem' }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Site Recommendations */}
              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '4px solid #3b82f6'
              }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1e40af', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                  Top Site Recommendations
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {selectedScenario.siteRecommendations.map((site, index) => (
                    <div key={index} style={{
                      padding: '1.5rem',
                      background: 'white',
                      borderRadius: '12px',
                      border: '2px solid #3b82f6'
                    }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0, lineHeight: '1.5' }}>
                        {site.site}
                      </h4>
                      <p style={{ fontSize: '0.95rem', color: '#64748b', margin: '0.5rem 0', lineHeight: '1.6' }}>
                        {site.location} • {site.enrollmentRate} • Experience: {site.experience}
                      </p>
                    </div>
                  ))}
                </div>
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
                  Trial Cost Impact Analysis
                </h3>

                <div style={{ marginBottom: '2.5rem' }}>
                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Traditional Trial Cost
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#ef4444', lineHeight: '1.3' }}>
                      ${(selectedScenario.costAnalysis.traditionalCost / 1000000).toFixed(1)}M
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Timeline: {selectedScenario.costAnalysis.timeTraditional}
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      ClinicalIQ™ Optimized Cost
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10b981', lineHeight: '1.3' }}>
                      ${(selectedScenario.costAnalysis.optimizedCost / 1000000).toFixed(1)}M
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Timeline: {selectedScenario.costAnalysis.timeOptimized}
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Success Probability
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#8b5cf6', lineHeight: '1.3' }}>
                      {selectedScenario.successProbability}%
                    </div>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', marginTop: '0.5rem' }}>
                      Based on 400K+ historical trials
                    </p>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                    <label style={{ fontSize: '1rem', color: '#64748b', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      Enrollment Forecast
                    </label>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#3b82f6', lineHeight: '1.3' }}>
                      {selectedScenario.costAnalysis.enrollmentForecast}
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
                      ${((selectedScenario.costAnalysis.traditionalCost - selectedScenario.costAnalysis.optimizedCost) / 1000000).toFixed(1)}M
                    </div>
                    <p style={{ fontSize: '1.1rem', color: 'white', opacity: 0.9, marginTop: '1rem', lineHeight: '1.7' }}>
                      {Math.round(((selectedScenario.costAnalysis.traditionalCost - selectedScenario.costAnalysis.optimizedCost) / selectedScenario.costAnalysis.traditionalCost) * 100)}% cost reduction
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
                    Analysis based on 400,000+ historical clinical trials • ClinicalTrials.gov database • FDA approval data • Real-world enrollment patterns
                  </p>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '2rem',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ClinicalIQ'}
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
      background: 'linear-gradient(135deg, #f8fafc 0%, #dcfce7 50%, #d1fae5 100%)',
      padding: '4rem 2rem',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflowY: 'auto'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <BetaDisclaimer platformColor="#10B981" />
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
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 700,
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            AI-POWERED CLINICAL TRIAL INTELLIGENCE
          </div>

          <h1 style={{
            fontSize: '4rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem',
            lineHeight: '1.2'
          }}>
            ClinicalIQ™ Interactive Demo
          </h1>

          <p style={{
            fontSize: '1.5rem',
            color: '#475569',
            maxWidth: '900px',
            margin: '0 auto 3rem auto',
            lineHeight: '1.8'
          }}>
            Experience how AI-powered trial optimization increases success rates and reduces costs
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
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', lineHeight: '1.3' }}>400K+ Trials</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>Historical data analyzed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', lineHeight: '1.3' }}>75-85% Accuracy</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>Enrollment forecasting</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', lineHeight: '1.3' }}>Up to 70% Cost Reduction</div>
              <div style={{ fontSize: '1rem', color: '#64748b', marginTop: '0.5rem', lineHeight: '1.6' }}>AI-powered optimization</div>
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
            Explore Real Clinical Trial Scenarios
          </h2>
          <p style={{
            fontSize: '1.25rem',
            color: '#64748b',
            textAlign: 'center',
            marginBottom: '3rem',
            lineHeight: '1.8'
          }}>
            See how ClinicalIQ™ optimizes trial design instantly • No signup required • Real trial data
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
                  <p style={{ fontSize: '1.25rem', color: '#10b981', fontWeight: 600, marginBottom: '1rem', lineHeight: '1.6' }}>
                    {scenario.subtitle}
                  </p>
                  <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: '1.8' }}>
                    {scenario.description}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Enrollment</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{scenario.enrollment}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Timeline</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' }}>{scenario.timeline}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem', fontWeight: 600 }}>Success Rate</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{scenario.successProbability}%</p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '1.25rem',
                    borderRadius: '12px',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
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
            background: 'linear-gradient(135deg, #1e293b 0%, #10b981 100%)',
            borderRadius: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'white', marginBottom: '1rem', lineHeight: '1.4' }}>
            Ready to Optimize Your Clinical Trial?
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', marginBottom: '2rem', lineHeight: '1.8' }}>
            Start your free trial and get AI-powered insights in minutes • No credit card required
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
            onClick={() => window.location.href = 'mailto:support@nexusbiomedical.ai?subject=Start Free Trial - ClinicalIQ'}
          >
            Start Free Trial →
          </button>
        </motion.div>
      </div>
    </div>
  );
}

