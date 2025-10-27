import React, { useState } from 'react'
import { checkoutReguReadyProfessional } from '../utils/stripe'

const ReguReadyPrototype = ({ onBack, onUpgrade }) => {
  const [step, setStep] = useState(1)
  const [deviceData, setDeviceData] = useState({
    deviceName: '',
    deviceType: '',
    intendedUse: '',
    riskClass: '',
    hasPredicate: ''
  })
  const [showResults, setShowResults] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const deviceTypes = [
    'Diagnostic Device',
    'Therapeutic Device',
    'Monitoring Device',
    'Surgical Instrument',
    'Implantable Device',
    'Software as Medical Device (SaMD)',
    'In Vitro Diagnostic (IVD)',
    'Combination Product'
  ]

  const riskClasses = [
    { value: 'I', label: 'Class I - Low Risk', desc: 'General controls (e.g., tongue depressors, bandages)' },
    { value: 'II', label: 'Class II - Moderate Risk', desc: 'General + special controls (e.g., infusion pumps, surgical drapes)' },
    { value: 'III', label: 'Class III - High Risk', desc: 'Premarket approval required (e.g., pacemakers, heart valves)' }
  ]

  // Sample predicate devices
  const samplePredicates = [
    {
      name: 'SkinVision AI Dermatology Assistant',
      kNumber: 'K193632',
      clearanceDate: '2019-11-15',
      deviceClass: 'II',
      productCode: 'QFM',
      equivalenceScore: 94
    },
    {
      name: 'DermAssist Computer-Aided Detection',
      kNumber: 'K201847',
      clearanceDate: '2020-08-22',
      deviceClass: 'II',
      productCode: 'QFM',
      equivalenceScore: 89
    },
    {
      name: 'MoleMapper AI Skin Lesion Analyzer',
      kNumber: 'K183421',
      clearanceDate: '2018-12-10',
      deviceClass: 'II',
      productCode: 'QFM',
      equivalenceScore: 87
    }
  ]

  const handleInputChange = (field, value) => {
    setDeviceData({ ...deviceData, [field]: value })
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setShowResults(true)
    }, 2500)
  }

  const getRecommendedPathway = () => {
    if (deviceData.riskClass === 'I') {
      return {
        pathway: '510(k) Exempt',
        timeline: '3-6 months',
        cost: '$50K - $100K',
        description: 'Your device may qualify for 510(k) exemption. You can market after registering with FDA.',
        steps: [
          'Register establishment with FDA',
          'List device with FDA',
          'Comply with general controls (QSR, labeling)',
          'Begin marketing'
        ]
      }
    } else if (deviceData.riskClass === 'II') {
      return {
        pathway: '510(k) Premarket Notification',
        timeline: '6-12 months',
        cost: '$150K - $300K',
        description: 'Your device requires 510(k) clearance demonstrating substantial equivalence to a predicate device.',
        steps: [
          'Identify appropriate predicate device(s)',
          'Conduct comparative testing (performance, biocompatibility)',
          'Prepare 510(k) submission with substantial equivalence analysis',
          'Submit to FDA and respond to questions',
          'Receive clearance and begin marketing'
        ]
      }
    } else {
      return {
        pathway: 'Premarket Approval (PMA)',
        timeline: '1-3 years',
        cost: '$500K - $2M+',
        description: 'Your device requires PMA with clinical evidence of safety and effectiveness.',
        steps: [
          'Conduct preclinical testing',
          'Submit IDE application for clinical trials',
          'Complete clinical studies',
          'Prepare comprehensive PMA application',
          'FDA review and potential advisory panel',
          'Receive approval and begin marketing'
        ]
      }
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Device Information</h2>
            
            {/* Example Scenarios */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">
                🎯 Quick Demo Scenarios
              </label>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => {
                    setDeviceData({
                      deviceName: 'AI Skin Cancer Detection System',
                      deviceType: 'Software as Medical Device (SaMD)',
                      intendedUse: 'Computer-aided detection of melanoma and other skin cancers using deep learning analysis of dermoscopic images. Intended for use by dermatologists and primary care physicians to assist in early detection.',
                      riskClass: 'II',
                      hasPredicate: 'no'
                    })
                  }}
                  className="text-left px-4 py-3 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/50 rounded-lg text-white hover:from-teal-500/30 hover:to-cyan-500/30 transition-all"
                >
                  <div className="font-semibold text-teal-300 mb-1">🤖 AI/ML Medical Device (SaMD)</div>
                  <div className="text-xs text-white/70">Class II • 510(k) pathway • 6-12 months • $150K-$300K</div>
                </button>
                <button
                  onClick={() => {
                    setDeviceData({
                      deviceName: 'Transcatheter Aortic Valve Replacement System',
                      deviceType: 'Implantable Device',
                      intendedUse: 'Minimally invasive replacement of diseased aortic valve in patients with severe aortic stenosis who are at high surgical risk. Delivered via catheter through femoral artery.',
                      riskClass: 'III',
                      hasPredicate: 'yes'
                    })
                  }}
                  className="text-left px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/50 rounded-lg text-white hover:from-red-500/30 hover:to-pink-500/30 transition-all"
                >
                  <div className="font-semibold text-red-300 mb-1">💉 High-Risk Cardiac Implant</div>
                  <div className="text-xs text-white/70">Class III • PMA pathway • 1-3 years • $500K-$2M+</div>
                </button>
                <button
                  onClick={() => {
                    setDeviceData({
                      deviceName: 'Digital Stethoscope with Recording',
                      deviceType: 'Diagnostic Device',
                      intendedUse: 'Electronic stethoscope for auscultation of heart, lung, and bowel sounds with digital recording and playback capability. For use by healthcare professionals in clinical settings.',
                      riskClass: 'I',
                      hasPredicate: 'yes'
                    })
                  }}
                  className="text-left px-4 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-lg text-white hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
                >
                  <div className="font-semibold text-green-300 mb-1">🔌 Low-Risk Diagnostic Tool</div>
                  <div className="text-xs text-white/70">Class I • 510(k) Exempt • 3-6 months • $50K-$100K</div>
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Device Name
              </label>
              <input
                type="text"
                value={deviceData.deviceName}
                onChange={(e) => handleInputChange('deviceName', e.target.value)}
                placeholder="e.g., AI Skin Cancer Detection System"
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Device Type
              </label>
              <select
                value={deviceData.deviceType}
                onChange={(e) => handleInputChange('deviceType', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select device type...</option>
                {deviceTypes.map((type) => (
                  <option key={type} value={type} className="bg-gray-800">
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Intended Use
              </label>
              <textarea
                value={deviceData.intendedUse}
                onChange={(e) => handleInputChange('intendedUse', e.target.value)}
                placeholder="Describe what the device is intended to do and who will use it..."
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Risk Classification</h2>
            <p className="text-white/70 mb-4">
              Select the FDA risk class that best matches your device:
            </p>
            <div className="space-y-3">
              {riskClasses.map((riskClass) => (
                <div
                  key={riskClass.value}
                  onClick={() => handleInputChange('riskClass', riskClass.value)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    deviceData.riskClass === riskClass.value
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 mt-1 flex-shrink-0 ${
                      deviceData.riskClass === riskClass.value
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-white/40'
                    }`}>
                      {deviceData.riskClass === riskClass.value && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-1">{riskClass.label}</h3>
                      <p className="text-white/70 text-sm">{riskClass.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Predicate Device</h2>
            <p className="text-white/70 mb-4">
              Do you have a predicate device in mind for substantial equivalence comparison?
            </p>
            <div className="space-y-3">
              <div
                onClick={() => handleInputChange('hasPredicate', 'yes')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  deviceData.hasPredicate === 'yes'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                    deviceData.hasPredicate === 'yes'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-white/40'
                  }`}>
                    {deviceData.hasPredicate === 'yes' && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white font-medium">Yes, I have a predicate device</span>
                </div>
              </div>
              <div
                onClick={() => handleInputChange('hasPredicate', 'no')}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  deviceData.hasPredicate === 'no'
                    ? 'border-purple-500 bg-purple-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/40'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                    deviceData.hasPredicate === 'no'
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-white/40'
                  }`}>
                    {deviceData.hasPredicate === 'no' && (
                      <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-white font-medium">No, help me find one</span>
                </div>
              </div>
            </div>
            {deviceData.hasPredicate === 'no' && (
              <div className="mt-4 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
                <p className="text-purple-200 text-sm">
                  <strong>Pro Feature:</strong> ReguReady™ Professional can search 500,000+ FDA submissions 
                  to find the best predicate devices for your 510(k) application.
                </p>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white mb-4">Review & Analyze</h2>
            <div className="space-y-3">
              <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
                <div className="text-white/60 text-sm mb-1">Device Name</div>
                <div className="text-white font-medium">{deviceData.deviceName || 'Not specified'}</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
                <div className="text-white/60 text-sm mb-1">Device Type</div>
                <div className="text-white font-medium">{deviceData.deviceType || 'Not specified'}</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
                <div className="text-white/60 text-sm mb-1">Intended Use</div>
                <div className="text-white font-medium">{deviceData.intendedUse || 'Not specified'}</div>
              </div>
              <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
                <div className="text-white/60 text-sm mb-1">Risk Classification</div>
                <div className="text-white font-medium">
                  {deviceData.riskClass ? `Class ${deviceData.riskClass}` : 'Not specified'}
                </div>
              </div>
              <div className="p-4 bg-white/5 border border-white/20 rounded-lg">
                <div className="text-white/60 text-sm mb-1">Predicate Device</div>
                <div className="text-white font-medium">
                  {deviceData.hasPredicate === 'yes' ? 'Yes, identified' : deviceData.hasPredicate === 'no' ? 'Need assistance' : 'Not specified'}
                </div>
              </div>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!deviceData.deviceName || !deviceData.riskClass || analyzing}
              className={`w-full mt-6 px-6 py-4 rounded-lg font-semibold transition-all ${
                !deviceData.deviceName || !deviceData.riskClass
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : analyzing
                  ? 'bg-purple-600 text-white'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
              }`}
            >
              {analyzing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Regulatory Pathway...
                </span>
              ) : (
                'Generate Regulatory Recommendation'
              )}
            </button>
          </div>
        )

      default:
        return null
    }
  }

  if (showResults) {
    const pathway = getRecommendedPathway()
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={onBack}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <h1 className="text-2xl font-bold text-white">ReguReady™ Analysis Results</h1>
              </div>
              <button
                onClick={checkoutReguReadyProfessional}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
              >
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recommended Pathway */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">Recommended Pathway</h2>
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold rounded-full">
                    {pathway.pathway}
                  </span>
                </div>
                <p className="text-white/80 mb-6">{pathway.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-sm mb-1">Estimated Timeline</div>
                    <div className="text-white font-semibold text-lg">{pathway.timeline}</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg">
                    <div className="text-white/60 text-sm mb-1">Estimated Cost</div>
                    <div className="text-white font-semibold text-lg">{pathway.cost}</div>
                  </div>
                </div>

                <h3 className="text-white font-semibold mb-3">Key Steps:</h3>
                <ol className="space-y-2">
                  {pathway.steps.map((step, index) => (
                    <li key={index} className="flex items-start text-white/80">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Predicate Devices (if Class II) */}
              {deviceData.riskClass === 'II' && (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-4">Potential Predicate Devices</h2>
                  <p className="text-white/70 text-sm mb-4">
                    Based on your device description, here are similar FDA-cleared devices:
                  </p>
                  
                  <div className="space-y-3">
                    {samplePredicates.map((predicate, index) => (
                      <div key={index} className="relative">
                        <div className="p-4 bg-white/5 border border-white/20 rounded-lg blur-sm">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-white font-semibold">{predicate.name}</h3>
                            <span className="text-green-400 text-sm font-semibold">{predicate.equivalenceScore}% Match</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-white/60">K-Number:</span>
                              <span className="text-white ml-2">{predicate.kNumber}</span>
                            </div>
                            <div>
                              <span className="text-white/60">Class:</span>
                              <span className="text-white ml-2">{predicate.deviceClass}</span>
                            </div>
                          </div>
                        </div>
                        {index === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={checkoutReguReadyProfessional}
                              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg text-sm"
                            >
                              🔒 Upgrade to View Predicates
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Device Summary */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <h3 className="text-white font-bold mb-4">Your Device</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-white/60 mb-1">Name</div>
                    <div className="text-white font-medium">{deviceData.deviceName}</div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Type</div>
                    <div className="text-white font-medium">{deviceData.deviceType}</div>
                  </div>
                  <div>
                    <div className="text-white/60 mb-1">Risk Class</div>
                    <div className="text-white font-medium">Class {deviceData.riskClass}</div>
                  </div>
                </div>
              </div>

              {/* Upgrade CTA */}
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-xl p-6">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Unlock Full Analysis
                </h3>
                <ul className="space-y-2 text-white/80 text-sm mb-4">
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">✓</span>
                    Detailed predicate device analysis
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">✓</span>
                    Gap analysis & compliance checklist
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">✓</span>
                    Submission document templates
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">✓</span>
                    FDA review timeline predictions
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-400 mr-2">✓</span>
                    International regulatory guidance
                  </li>
                </ul>
                <button
                  onClick={checkoutReguReadyProfessional}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  Upgrade to Professional
                </button>
                <p className="text-white/60 text-xs text-center mt-3">
                  Starting at $10K per submission
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="text-white/80 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-white">ReguReady™ Interactive Demo</h1>
            </div>
            <button
              onClick={onUpgrade}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <div className="mb-6 bg-purple-500/20 border border-purple-500/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-purple-300 font-semibold mb-1">Demo Mode</h3>
              <p className="text-purple-200 text-sm">
                This is a functional demo with sample recommendations. Upgrade to Professional for access to 500,000+ FDA submissions, 
                detailed gap analysis, and submission-ready document generation.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step >= s
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/10 text-white/40'
                }`}>
                  {s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    step > s ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-white/60">
            <span>Device Info</span>
            <span>Risk Class</span>
            <span>Predicate</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 mb-6">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        {!showResults && step < 4 && (
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                step === 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              ← Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReguReadyPrototype

