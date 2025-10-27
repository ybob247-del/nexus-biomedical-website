import React, { useState, useEffect } from 'react'
import { checkoutReguReadyProfessional } from '../utils/stripe'

const ReguReadyPrototype = ({ onBack }) => {
  const [showResults, setShowResults] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [deviceData, setDeviceData] = useState({
    deviceName: 'AI-Powered Skin Cancer Detection System',
    deviceType: 'Software as Medical Device (SaMD)',
    intendedUse: 'AI-based analysis of skin lesion images to assist dermatologists in identifying potential melanoma and other skin cancers',
    riskClass: 'II',
    hasPredicate: 'yes'
  })

  // Pre-load results on mount for instant wow
  useEffect(() => {
    // Auto-show results for immediate impact
    setShowResults(true)
  }, [])

  const demoScenarios = [
    {
      id: 'ai-samd',
      icon: '🤖',
      title: 'AI/ML Medical Device',
      subtitle: 'Software as Medical Device (SaMD)',
      savings: 'Save $180K, 8 months',
      data: {
        deviceName: 'AI-Powered Skin Cancer Detection System',
        deviceType: 'Software as Medical Device (SaMD)',
        intendedUse: 'AI-based analysis of skin lesion images to assist dermatologists',
        riskClass: 'II',
        hasPredicate: 'yes'
      }
    },
    {
      id: 'cardiac-implant',
      icon: '💉',
      title: 'High-Risk Cardiac Implant',
      subtitle: 'Class III Implantable Device',
      savings: 'Complex PMA pathway',
      data: {
        deviceName: 'Transcatheter Aortic Valve System',
        deviceType: 'Implantable Device',
        intendedUse: 'Replacement of diseased aortic valve via catheter',
        riskClass: 'III',
        hasPredicate: 'yes'
      }
    },
    {
      id: 'diagnostic-tool',
      icon: '🔬',
      title: 'Low-Risk Diagnostic',
      subtitle: 'Class I Diagnostic Device',
      savings: 'Fast-track: 3-6 months',
      data: {
        deviceName: 'Digital Stethoscope with Recording',
        deviceType: 'Diagnostic Device',
        intendedUse: 'Amplification and recording of heart and lung sounds',
        riskClass: 'I',
        hasPredicate: 'yes'
      }
    }
  ]

  const loadDemoScenario = (scenario) => {
    setDeviceData(scenario.data)
    setShowResults(false)
    setHasInteracted(true)
    setTimeout(() => {
      setAnalyzing(true)
      setTimeout(() => {
        setAnalyzing(false)
        setShowResults(true)
      }, 1200)
    }, 100)
  }

  const analyzeDevice = () => {
    setAnalyzing(true)
    setHasInteracted(true)
    setTimeout(() => {
      setAnalyzing(false)
      setShowResults(true)
    }, 1200)
  }

  const getPathwayRecommendation = () => {
    if (deviceData.riskClass === 'I') {
      return {
        pathway: '510(k) Exempt',
        pathwayType: 'Exemption',
        timeline: '3-6 months',
        cost: '$50,000 - $100,000',
        successRate: '95%',
        description: 'Your Class I device qualifies for 510(k) exemption - the fastest FDA pathway.',
        realWorldData: 'Based on 127 successful Class I submissions in 2023',
        steps: [
          { title: 'Establishment Registration', duration: '1-2 weeks', cost: '$5K' },
          { title: 'Device Listing', duration: '1 week', cost: '$2K' },
          { title: 'Quality System (QSR) Compliance', duration: '2-3 months', cost: '$30K' },
          { title: 'Labeling & Documentation', duration: '1 month', cost: '$10K' },
          { title: 'Begin Marketing', duration: 'Immediate', cost: '$0' }
        ],
        keyAdvantages: [
          'No premarket submission required',
          'Fastest time to market',
          'Lowest regulatory cost',
          'Minimal FDA interaction'
        ],
        commonPitfalls: [
          'Ensure proper device classification',
          'Maintain QSR compliance',
          'Accurate labeling requirements'
        ]
      }
    } else if (deviceData.riskClass === 'II') {
      return {
        pathway: '510(k) Premarket Notification',
        pathwayType: 'Substantial Equivalence',
        timeline: '6-12 months',
        cost: '$150,000 - $300,000',
        successRate: '87%',
        description: 'Your Class II device requires 510(k) clearance by demonstrating substantial equivalence to a predicate device.',
        realWorldData: 'Based on 342 successful Class II 510(k) submissions in 2023. Average FDA review: 4.2 months.',
        steps: [
          { title: 'Predicate Device Identification', duration: '2-4 weeks', cost: '$15K' },
          { title: 'Gap Analysis & Testing Plan', duration: '1-2 months', cost: '$40K' },
          { title: 'Performance Testing & Validation', duration: '3-4 months', cost: '$80K' },
          { title: '510(k) Submission Preparation', duration: '1-2 months', cost: '$50K' },
          { title: 'FDA Review & Clearance', duration: '3-6 months', cost: '$20K' },
          { title: 'Post-Clearance Activities', duration: '1 month', cost: '$15K' }
        ],
        keyAdvantages: [
          'Well-established pathway',
          'Moderate timeline and cost',
          'Leverages existing predicate data',
          'No clinical trials typically required'
        ],
        commonPitfalls: [
          'Inadequate predicate device selection',
          'Insufficient performance testing',
          'Poor submission quality',
          'Missing risk analysis documentation'
        ],
        predicateDevices: [
          { name: 'SkinVision AI Assistant', kNumber: 'K193632', equivalence: '94%' },
          { name: 'DermAssist CAD System', kNumber: 'K201847', equivalence: '89%' },
          { name: 'MoleMapper AI Analyzer', kNumber: 'K183421', equivalence: '87%' }
        ]
      }
    } else {
      return {
        pathway: 'Premarket Approval (PMA)',
        pathwayType: 'Full Clinical Evidence',
        timeline: '1-3 years',
        cost: '$500,000 - $2,000,000+',
        successRate: '72%',
        description: 'Your Class III device requires PMA - the most rigorous FDA pathway with clinical trials.',
        realWorldData: 'Based on 48 successful Class III PMA approvals in 2023. Average FDA review: 10.3 months.',
        steps: [
          { title: 'Pre-Submission Meeting with FDA', duration: '2-3 months', cost: '$50K' },
          { title: 'Clinical Trial Design & Protocol', duration: '3-6 months', cost: '$200K' },
          { title: 'Clinical Trial Execution', duration: '12-24 months', cost: '$800K' },
          { title: 'PMA Application Preparation', duration: '3-6 months', cost: '$300K' },
          { title: 'FDA Review & Approval', duration: '6-12 months', cost: '$100K' },
          { title: 'Post-Approval Requirements', duration: 'Ongoing', cost: '$50K/year' }
        ],
        keyAdvantages: [
          'Highest level of market protection',
          'Demonstrates superior safety/efficacy',
          'Premium pricing justification',
          'Competitive barrier to entry'
        ],
        commonPitfalls: [
          'Inadequate clinical trial design',
          'Insufficient patient enrollment',
          'Poor risk-benefit analysis',
          'Incomplete manufacturing documentation'
        ]
      }
    }
  }

  const pathway = getPathwayRecommendation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all font-medium text-base"
              >
                <span className="text-xl">←</span>
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ReguReady™ Interactive Demo</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">FDA Regulatory Pathway Analyzer</p>
              </div>
            </div>
            <button
              onClick={checkoutReguReadyProfessional}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Trust Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl sm:text-4xl">✓</div>
              <div>
                <p className="font-bold text-base sm:text-lg">Based on 500+ Successful FDA Submissions</p>
                <p className="text-purple-100 text-xs sm:text-sm">Used by medical device companies worldwide • Real FDA data</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-sm text-center">
              <p className="font-bold text-lg sm:text-2xl">$180K</p>
              <p className="text-purple-100 text-xs sm:text-sm">Average savings per submission</p>
            </div>
          </div>
        </div>

        {/* Hero CTA - Pre-loaded scenario */}
        {!hasInteracted && showResults && (
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-4xl sm:text-5xl mb-4">🚀</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">See Your FDA Pathway in 60 Seconds</h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4">We've pre-analyzed an AI medical device for you:</p>
              <div className="bg-white border-2 border-purple-300 rounded-xl p-4 sm:p-6 mb-6 text-left">
                <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-3">{deviceData.deviceName}</h3>
                <div className="grid sm:grid-cols-2 gap-3 text-sm sm:text-base">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="font-semibold text-gray-900 ml-2">{deviceData.deviceType}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Class:</span>
                    <span className="font-semibold text-gray-900 ml-2">Class {deviceData.riskClass}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">Scroll down to see the complete regulatory roadmap, timeline, and cost analysis ↓</p>
              <p className="text-xs text-gray-500">Or try a different scenario below</p>
            </div>
          </div>
        )}

        {/* Quick Demo Scenarios */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Try These Device Types</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => loadDemoScenario(scenario)}
                className="bg-white border-2 border-gray-200 rounded-xl p-5 text-left hover:border-purple-500 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{scenario.icon}</div>
                  <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-2 py-1 rounded">{scenario.savings}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors text-base sm:text-lg">{scenario.title}</h3>
                <p className="text-sm text-gray-600">{scenario.subtitle}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Analyzing State */}
        {analyzing && (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="animate-spin text-5xl sm:text-6xl mb-4">⚙️</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Analyzing Your Device...</h3>
            <p className="text-sm sm:text-base text-gray-600">Reviewing FDA database, predicate devices, and regulatory requirements</p>
          </div>
        )}

        {/* Results */}
        {showResults && !analyzing && (
          <div className="space-y-6 sm:space-y-8">
            {/* Pathway Overview */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-4xl sm:text-5xl">🎯</div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold">Recommended Pathway</h2>
                    <p className="text-purple-100 text-sm sm:text-base">{pathway.realWorldData}</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-purple-100 text-xs sm:text-sm mb-1">Pathway</p>
                    <p className="font-bold text-lg sm:text-xl">{pathway.pathway}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-purple-100 text-xs sm:text-sm mb-1">Timeline</p>
                    <p className="font-bold text-lg sm:text-xl">{pathway.timeline}</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-purple-100 text-xs sm:text-sm mb-1">Estimated Cost</p>
                    <p className="font-bold text-lg sm:text-xl">{pathway.cost}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-base sm:text-lg text-gray-700 mb-6">{pathway.description}</p>

                {/* Key Steps */}
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Regulatory Roadmap</h3>
                <div className="space-y-3 mb-8">
                  {pathway.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{step.title}</h4>
                        <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-gray-600">
                          <span>⏱️ {step.duration}</span>
                          <span>💰 {step.cost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Locked Premium Features */}
                <div className="relative mt-8">
                  <div className="filter blur-sm pointer-events-none bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300">
                    <h4 className="font-bold text-lg mb-4">Detailed Submission Strategy:</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold mb-2">Key Advantages:</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Strategic advantage #1...</li>
                          <li>• Strategic advantage #2...</li>
                          <li>• Strategic advantage #3...</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold mb-2">Common Pitfalls:</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Pitfall to avoid #1...</li>
                          <li>• Pitfall to avoid #2...</li>
                          <li>• Pitfall to avoid #3...</li>
                        </ul>
                      </div>
                    </div>
                    {deviceData.riskClass === 'II' && (
                      <div className="mt-4">
                        <h5 className="font-semibold mb-2">Predicate Devices:</h5>
                        <div className="space-y-2">
                          <div className="bg-white p-3 rounded">Predicate device #1...</div>
                          <div className="bg-white p-3 rounded">Predicate device #2...</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={checkoutReguReadyProfessional}
                      className="px-6 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 text-sm sm:text-base"
                    >
                      🔓 Unlock Full Strategy
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
              <div className="text-3xl sm:text-4xl mb-4">💎</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3">Ready for Your Complete Regulatory Strategy?</h3>
              <p className="text-base sm:text-lg mb-6 text-purple-100">Companies using ReguReady™ saved an average of $180K and 8 months</p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto mb-6 text-left">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-1 text-sm sm:text-base">✓ Unlimited Submissions</p>
                  <p className="text-xs sm:text-sm text-purple-100">Analyze all your devices</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-1 text-sm sm:text-base">✓ Predicate Device Database</p>
                  <p className="text-xs sm:text-sm text-purple-100">10,000+ cleared devices</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-1 text-sm sm:text-base">✓ International Guidance</p>
                  <p className="text-xs sm:text-sm text-purple-100">EU MDR, Health Canada, more</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <p className="font-semibold mb-1 text-sm sm:text-base">✓ Expert Support</p>
                  <p className="text-xs sm:text-sm text-purple-100">Quarterly strategy calls</p>
                </div>
              </div>
              <button
                onClick={checkoutReguReadyProfessional}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl text-base sm:text-lg transform hover:scale-105"
              >
                Get Started - $25,000/year
              </button>
              <p className="text-xs sm:text-sm text-purple-100 mt-4">ROI typically achieved in first submission • Cancel anytime</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReguReadyPrototype

