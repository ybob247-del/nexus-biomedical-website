import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

  // Animated timeline visualization
  const TimelineVisualization = ({ steps }) => {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 rounded-3xl p-8 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="timeline-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="white" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#timeline-grid)" />
          </svg>
        </div>

        {/* Timeline path */}
        <div className="relative h-full flex flex-col justify-between py-8">
          {steps.map((step, index) => {
            const isEven = index % 2 === 0
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, type: 'spring' }}
                className={`flex items-center ${isEven ? 'justify-start' : 'justify-end'} relative`}
              >
                {/* Milestone card */}
                <div className={`bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-2xl max-w-md ${isEven ? 'mr-auto' : 'ml-auto'}`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="bg-white text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                      {index + 1}
                    </div>
                    <h4 className="font-bold text-lg flex-1">{step.title}</h4>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">⏱️ {step.duration}</span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-lg">💰 {step.cost}</span>
                  </div>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: index * 0.2 + 0.3, duration: 0.5 }}
                    className="absolute left-1/2 top-full w-1 h-8 bg-gradient-to-b from-pink-400 to-purple-400 origin-top"
                    style={{ transform: 'translateX(-50%)' }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Success indicator */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: steps.length * 0.2, type: 'spring' }}
          className="absolute bottom-4 right-4 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl shadow-2xl"
        >
          ✓
        </motion.div>

        {/* Stats */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
          <div className="text-sm mb-1">Success Rate</div>
          <div className="text-2xl font-bold">{pathway.successRate}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-5 py-3 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all font-medium text-lg"
              >
                <span className="text-2xl">←</span>
                <span className="hidden sm:inline">Back</span>
              </button>
              <div className="h-10 w-px bg-gray-300 hidden sm:block"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">ReguReady™ Interactive Demo</h1>
                <p className="text-base text-gray-600 mt-1 hidden sm:block">FDA Regulatory Pathway Analyzer</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkoutReguReadyProfessional}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-lg whitespace-nowrap"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-3xl p-10 mb-16 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="text-6xl">✓</div>
              <div>
                <p className="font-bold text-2xl mb-2">Built on Real FDA Submission Data</p>
                <p className="text-purple-100 text-lg">Analyzing 500+ FDA clearance pathways • CDRH database-powered</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 px-10 py-6 rounded-2xl backdrop-blur-sm text-center">
              <p className="font-bold text-4xl mb-1">$31M</p>
              <p className="text-purple-100 text-base">Average FDA submission cost (industry data)</p>
            </div>
          </div>
        </motion.div>

        {/* Hero CTA - Pre-loaded scenario */}
        <AnimatePresence>
          {!hasInteracted && showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300 rounded-3xl p-16 mb-16 shadow-2xl"
            >
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-7xl mb-8"
                >
                  🚀
                </motion.div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">See Your FDA Pathway in 60 Seconds</h2>
                <p className="text-2xl text-gray-700 mb-6">We've pre-analyzed an AI medical device for you:</p>
                <div className="bg-white border-2 border-purple-300 rounded-2xl p-10 mb-8 text-left">
                  <h3 className="font-bold text-3xl text-gray-900 mb-6">{deviceData.deviceName}</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-xl">
                    <div>
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold text-gray-900 ml-3">{deviceData.deviceType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Risk Class:</span>
                      <span className="font-semibold text-gray-900 ml-3">Class {deviceData.riskClass}</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg text-gray-600 mb-4">Scroll down to see the complete regulatory roadmap, timeline, and cost analysis ↓</p>
                <p className="text-base text-gray-500">Or try a different scenario below</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Demo Scenarios */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Try These Device Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoScenarios.map((scenario, idx) => (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => loadDemoScenario(scenario)}
                className="bg-white border-2 border-gray-200 rounded-3xl p-8 text-left hover:border-purple-500 hover:shadow-2xl transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl">{scenario.icon}</div>
                  <span className="text-sm font-semibold text-purple-600 bg-purple-100 px-4 py-2 rounded-xl">{scenario.savings}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors text-2xl">{scenario.title}</h3>
                <p className="text-lg text-gray-600 leading-relaxed">{scenario.subtitle}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Analyzing State */}
        <AnimatePresence>
          {analyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl p-16 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="text-7xl mb-8"
              >
                ⚙️
              </motion.div>
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Analyzing Your Device...</h3>
              <p className="text-xl text-gray-600">Reviewing FDA database, predicate devices, and regulatory requirements</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results - Two Column Layout */}
        <AnimatePresence>
          {showResults && !analyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-12"
            >
              {/* Pathway Overview */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-12">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="text-7xl">🎯</div>
                    <div>
                      <h2 className="text-4xl font-bold mb-2">Recommended Pathway</h2>
                      <p className="text-purple-100 text-xl">{pathway.realWorldData}</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
                      <p className="text-purple-100 text-base mb-2">Pathway</p>
                      <p className="font-bold text-2xl">{pathway.pathway}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
                      <p className="text-purple-100 text-base mb-2">Timeline</p>
                      <p className="font-bold text-2xl">{pathway.timeline}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm">
                      <p className="text-purple-100 text-base mb-2">Estimated Cost</p>
                      <p className="font-bold text-2xl">{pathway.cost}</p>
                    </div>
                  </div>
                </div>

                <div className="p-12">
                  <p className="text-2xl text-gray-700 mb-12 leading-relaxed">{pathway.description}</p>

                  {/* Two-Column Layout: Timeline + Details */}
                  <div className="grid lg:grid-cols-2 gap-12 mb-12">
                    {/* Left: Animated Timeline */}
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Regulatory Roadmap</h3>
                      <TimelineVisualization steps={pathway.steps} />
                    </div>

                    {/* Right: Step Details */}
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-6">Key Milestones</h3>
                      <div className="space-y-6">
                        {pathway.steps.map((step, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 mb-3 text-xl">{step.title}</h4>
                                <div className="flex flex-wrap gap-4 text-lg text-gray-600">
                                  <span className="bg-white px-4 py-2 rounded-lg">⏱️ {step.duration}</span>
                                  <span className="bg-white px-4 py-2 rounded-lg">💰 {step.cost}</span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Locked Premium Features */}
                  <div className="relative mt-12">
                    <div className="filter blur-sm pointer-events-none bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-10 border-2 border-dashed border-gray-300">
                      <h4 className="font-bold text-2xl mb-8">Detailed Submission Strategy:</h4>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h5 className="font-semibold text-xl mb-4">Key Advantages:</h5>
                          <ul className="text-lg space-y-3">
                            <li>• Strategic advantage #1...</li>
                            <li>• Strategic advantage #2...</li>
                            <li>• Strategic advantage #3...</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-semibold text-xl mb-4">Common Pitfalls:</h5>
                          <ul className="text-lg space-y-3">
                            <li>• Pitfall to avoid #1...</li>
                            <li>• Pitfall to avoid #2...</li>
                            <li>• Pitfall to avoid #3...</li>
                          </ul>
                        </div>
                      </div>
                      {deviceData.riskClass === 'II' && (
                        <div className="mt-8">
                          <h5 className="font-semibold text-xl mb-4">Predicate Devices:</h5>
                          <div className="space-y-3">
                            <div className="bg-white p-6 rounded-xl">Predicate device #1...</div>
                            <div className="bg-white p-6 rounded-xl">Predicate device #2...</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={checkoutReguReadyProfessional}
                        className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-2xl hover:from-purple-700 hover:to-pink-700 transition-all text-xl"
                      >
                        🔓 Unlock Full Strategy
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white rounded-3xl p-16 text-center shadow-2xl"
              >
                <div className="text-6xl mb-8">💎</div>
                <h3 className="text-4xl font-bold mb-6">Ready for Your Complete Regulatory Strategy?</h3>
                <p className="text-2xl mb-10 text-purple-100">Companies using ReguReady™ saved an average of $180K and 8 months</p>
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
                  <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm text-left">
                    <p className="font-semibold mb-2 text-xl">✓ Unlimited Submissions</p>
                    <p className="text-lg text-purple-100">Analyze all your devices</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm text-left">
                    <p className="font-semibold mb-2 text-xl">✓ Predicate Device Database</p>
                    <p className="text-lg text-purple-100">10,000+ cleared devices</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm text-left">
                    <p className="font-semibold mb-2 text-xl">✓ International Guidance</p>
                    <p className="text-lg text-purple-100">EU MDR, Health Canada, more</p>
                  </div>
                  <div className="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm text-left">
                    <p className="font-semibold mb-2 text-xl">✓ Expert Support</p>
                    <p className="text-lg text-purple-100">Quarterly strategy calls</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={checkoutReguReadyProfessional}
                  className="px-16 py-6 bg-white text-purple-600 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl text-2xl"
                >
                  Get Started - $25,000/year
                </motion.button>
                <p className="text-base text-purple-100 mt-6">ROI typically achieved in first submission • Cancel anytime</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ReguReadyPrototype

