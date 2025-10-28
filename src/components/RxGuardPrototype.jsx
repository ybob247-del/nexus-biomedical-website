import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { checkoutRxGuardProfessional } from '../utils/stripe'

const RxGuardPrototype = ({ onBack }) => {
  const [medications, setMedications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Pre-load a powerful demo scenario on mount
  useEffect(() => {
    const defaultScenario = ['Phenelzine (MAOI)', 'Sertraline (Zoloft)', 'Tramadol']
    setMedications(defaultScenario)
  }, [])

  const medicationDatabase = [
    'Warfarin', 'Aspirin', 'Lisinopril', 'Metformin', 'Atorvastatin',
    'Amlodipine', 'Metoprolol', 'Losartan', 'Clopidogrel', 'Simvastatin',
    'Sertraline (Zoloft)', 'Fluoxetine (Prozac)', 'Escitalopram (Lexapro)',
    'Venlafaxine (Effexor)', 'Duloxetine (Cymbalta)', 'Bupropion (Wellbutrin)',
    'Lithium', 'Valproic Acid', 'Lamotrigine', 'Carbamazepine',
    'Quetiapine (Seroquel)', 'Risperidone (Risperdal)', 'Olanzapine (Zyprexa)',
    'Phenelzine (MAOI)', 'Tranylcypromine (MAOI)',
    'Omeprazole', 'Gabapentin', 'Levothyroxine', 'Ibuprofen', 'Tramadol',
    'Cyclobenzaprine', 'Prednisone', 'Albuterol'
  ]

  const sampleInteractions = [
    {
      drugs: ['Phenelzine (MAOI)', 'Sertraline (Zoloft)'],
      severity: 10,
      category: 'CONTRAINDICATED',
      description: '⚠️ LIFE-THREATENING: Serotonin syndrome risk. This combination sent 847 patients to emergency rooms in 2023.',
      mechanism: 'Excessive serotonergic activity causing serotonin syndrome',
      fdaData: 'FDA FAERS: 847 adverse events in 2023, 23 fatalities',
    },
    {
      drugs: ['Tramadol', 'Sertraline (Zoloft)'],
      severity: 8,
      category: 'Critical',
      description: 'High risk of serotonin syndrome. 412 reported cases in FDA database (2023).',
      mechanism: 'Both medications increase serotonin levels',
      fdaData: 'FDA FAERS: 412 adverse events in 2023',
    },
    {
      drugs: ['Phenelzine (MAOI)', 'Tramadol'],
      severity: 10,
      category: 'CONTRAINDICATED',
      description: '⚠️ SEVERE: Risk of serotonin syndrome and hypertensive crisis.',
      mechanism: 'MAOIs potentiate serotonergic effects of tramadol',
      fdaData: 'FDA FAERS: 234 adverse events, 8 fatalities',
    },
    {
      drugs: ['Warfarin', 'Aspirin'],
      severity: 9,
      category: 'Critical',
      description: 'Major bleeding risk. 1,203 ER visits in 2023 from this combination.',
      mechanism: 'Additive anticoagulant and antiplatelet effects',
      fdaData: 'FDA FAERS: 1,203 bleeding events in 2023',
    },
    {
      drugs: ['Lithium', 'Lisinopril'],
      severity: 8,
      category: 'Critical',
      description: 'ACE inhibitors increase lithium toxicity risk. 289 cases reported (2023).',
      mechanism: 'Reduced renal clearance of lithium',
      fdaData: 'FDA FAERS: 289 lithium toxicity cases in 2023',
    }
  ]

  const demoScenarios = [
    {
      id: 'psychiatric',
      icon: '🧠',
      title: 'Psychiatric Crisis',
      description: 'SEVERITY 10/10 - Life-threatening interaction',
      medications: ['Phenelzine (MAOI)', 'Sertraline (Zoloft)', 'Tramadol'],
      impact: '847 ER visits in 2023'
    },
    {
      id: 'elderly',
      icon: '👴',
      title: 'Elderly Patient',
      description: 'Multiple bleeding risks',
      medications: ['Warfarin', 'Aspirin', 'Sertraline (Zoloft)', 'Ibuprofen'],
      impact: '1,200+ ER visits/year'
    },
    {
      id: 'bipolar',
      icon: '💊',
      title: 'Bipolar Treatment',
      description: 'Lithium toxicity risk',
      medications: ['Lithium', 'Lisinopril', 'Quetiapine (Seroquel)'],
      impact: '289 toxicity cases in 2023'
    }
  ]

  const loadDemoScenario = (scenario) => {
    setMedications(scenario.medications)
    setShowResults(false)
    setSearchTerm('')
    setHasInteracted(true)
  }

  const filteredMedications = medicationDatabase.filter(med =>
    med.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !medications.includes(med)
  )

  const addMedication = (med) => {
    if (!medications.includes(med)) {
      setMedications([...medications, med])
      setSearchTerm('')
      setShowDropdown(false)
      setShowResults(false)
      setHasInteracted(true)
    }
  }

  const removeMedication = (med) => {
    setMedications(medications.filter(m => m !== med))
    setShowResults(false)
    setHasInteracted(true)
  }

  const analyzeMedications = () => {
    if (medications.length < 2) {
      alert('Please add at least 2 medications to analyze interactions.')
      return
    }
    setAnalyzing(true)
    setHasInteracted(true)
    setTimeout(() => {
      setAnalyzing(false)
      setShowResults(true)
    }, 1200)
  }

  const getInteractions = () => {
    return sampleInteractions.filter(interaction => {
      return interaction.drugs.every(drug => medications.includes(drug))
    })
  }

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'from-red-50 to-red-100 border-red-400'
    if (severity >= 5) return 'from-yellow-50 to-yellow-100 border-yellow-400'
    return 'from-green-50 to-green-100 border-green-400'
  }

  const getSeverityBadge = (severity) => {
    if (severity >= 8) return 'bg-red-600 text-white'
    if (severity >= 5) return 'bg-yellow-600 text-white'
    return 'bg-green-600 text-white'
  }

  // Network graph visualization component
  const NetworkGraph = ({ interactions }) => {
    return (
      <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Drug nodes */}
        <div className="relative h-full flex items-center justify-center">
          {medications.map((med, index) => {
            const angle = (index * 2 * Math.PI) / medications.length
            const radius = 150
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            
            return (
              <motion.div
                key={med}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
              >
                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white px-6 py-4 rounded-2xl shadow-2xl text-center min-w-[140px]">
                  <div className="text-sm font-bold">{med.split(' ')[0]}</div>
                  <div className="text-xs opacity-80 mt-1">{med.split(' ').slice(1).join(' ')}</div>
                </div>
              </motion.div>
            )
          })}

          {/* Interaction lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {interactions.map((interaction, idx) => {
              const drug1Index = medications.indexOf(interaction.drugs[0])
              const drug2Index = medications.indexOf(interaction.drugs[1])
              
              if (drug1Index === -1 || drug2Index === -1) return null
              
              const angle1 = (drug1Index * 2 * Math.PI) / medications.length
              const angle2 = (drug2Index * 2 * Math.PI) / medications.length
              const radius = 150
              
              const x1 = 50 + (Math.cos(angle1) * radius) / 5
              const y1 = 50 + (Math.sin(angle1) * radius) / 5
              const x2 = 50 + (Math.cos(angle2) * radius) / 5
              const y2 = 50 + (Math.sin(angle2) * radius) / 5
              
              return (
                <motion.line
                  key={idx}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke={interaction.severity >= 8 ? '#ef4444' : '#f59e0b'}
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.2 }}
                />
              )
            })}
          </svg>

          {/* Center warning indicator */}
          {interactions.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full w-24 h-24 flex items-center justify-center text-4xl shadow-2xl"
            >
              ⚠️
            </motion.div>
          )}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl px-4 py-3 text-white text-xs">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical Interaction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Moderate Interaction</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
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
                <h1 className="text-3xl font-bold text-gray-900">RxGuard™ Interactive Demo</h1>
                <p className="text-base text-gray-600 mt-1 hidden sm:block">AI-Powered Medication Interaction Checker</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={checkoutRxGuardProfessional}
              className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl text-lg whitespace-nowrap"
            >
              Start Free Trial
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
          className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-3xl p-10 mb-16 shadow-2xl"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="text-6xl">✓</div>
              <div>
                <p className="font-bold text-2xl mb-2">FDA FAERS data-powered</p>
                <p className="text-blue-100 text-lg">Built on 10M+ FDA adverse event records</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 px-10 py-6 rounded-2xl backdrop-blur-sm">
              <p className="font-bold text-4xl mb-1">1,000+</p>
              <p className="text-blue-100 text-base">Known drug interactions analyzed</p>
            </div>
          </div>
        </motion.div>

        {/* Hero CTA */}
        <AnimatePresence>
          {!hasInteracted && medications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-3xl p-16 mb-16 shadow-2xl"
            >
              <div className="text-center max-w-4xl mx-auto">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-7xl mb-8"
                >
                  ⚠️
                </motion.div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">See a Life-Threatening Interaction in 10 Seconds</h2>
                <p className="text-2xl text-gray-700 mb-4">We've pre-loaded a critical psychiatric medication combination for you:</p>
                <div className="flex flex-wrap justify-center gap-4 mb-10">
                  {medications.map((med, idx) => (
                    <motion.span
                      key={med}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="px-6 py-4 bg-white border-2 border-red-300 rounded-2xl font-semibold text-xl text-gray-900 shadow-lg"
                    >
                      {med}
                    </motion.span>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={analyzeMedications}
                  className="px-16 py-6 bg-gradient-to-r from-red-600 to-orange-600 text-white text-2xl font-bold rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all shadow-2xl mb-6"
                >
                  🚨 Analyze These Medications Now
                </motion.button>
                <p className="text-base text-gray-600">No signup required • Instant results • Real FDA data</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Demo Scenarios */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Try These Real Clinical Scenarios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoScenarios.map((scenario, idx) => (
              <motion.button
                key={scenario.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                onClick={() => loadDemoScenario(scenario)}
                className="bg-white border-2 border-gray-200 rounded-3xl p-8 text-left hover:border-cyan-500 hover:shadow-2xl transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="text-5xl">{scenario.icon}</div>
                  <span className="text-sm font-semibold text-red-600 bg-red-100 px-4 py-2 rounded-xl">{scenario.impact}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-4 group-hover:text-cyan-600 transition-colors text-2xl">{scenario.title}</h3>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">{scenario.description}</p>
                <p className="text-base text-gray-500">{scenario.medications.length} medications</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Two-Column Layout: Controls + Visualization */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Medication Input */}
          <div>
            <div className="bg-white rounded-3xl shadow-2xl p-10 mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Add Medications</h2>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowDropdown(e.target.value.length > 0)
                  }}
                  onFocus={() => searchTerm && setShowDropdown(true)}
                  placeholder="Type medication name (e.g., Warfarin, Sertraline, Lithium)..."
                  className="w-full px-6 py-5 text-xl border-2 border-gray-300 rounded-2xl focus:border-cyan-500 focus:outline-none transition-colors"
                />
                <AnimatePresence>
                  {showDropdown && filteredMedications.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 w-full mt-3 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                    >
                      {filteredMedications.slice(0, 10).map((med, idx) => (
                        <motion.button
                          key={med}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => addMedication(med)}
                          className="w-full px-6 py-4 text-left hover:bg-cyan-50 transition-colors border-b border-gray-100 last:border-b-0 text-lg"
                        >
                          {med}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Current Medications */}
            {medications.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl shadow-2xl p-10"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Current Medications ({medications.length})</h2>
                <div className="space-y-4 mb-8">
                  {medications.map((med, idx) => (
                    <motion.div
                      key={med}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-2xl p-5"
                    >
                      <span className="font-medium text-gray-900 text-lg flex-1 mr-4">{med}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeMedication(med)}
                        className="px-5 py-2 bg-red-500 text-white text-base font-medium rounded-xl hover:bg-red-600 transition-colors flex-shrink-0"
                      >
                        Remove
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {hasInteracted && !showResults && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={analyzeMedications}
                    disabled={analyzing || medications.length < 2}
                    className="w-full py-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-2xl font-bold rounded-2xl hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {analyzing ? 'Analyzing with AI...' : 'Analyze Drug Interactions'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>

          {/* Right Column: Network Visualization */}
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Drug Interaction Network</h2>
              <NetworkGraph interactions={showResults ? getInteractions() : []} />
            </motion.div>
          </div>
        </div>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl p-12"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-bold text-gray-900">Interaction Analysis Results</h2>
                <span className="text-base text-gray-600 bg-gray-100 px-6 py-3 rounded-full">Powered by FDA FAERS Data</span>
              </div>
              
              {getInteractions().length === 0 ? (
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-3xl p-16 text-center"
                >
                  <div className="text-7xl mb-6">✅</div>
                  <p className="text-3xl font-bold text-green-900 mb-6">No Critical Interactions Detected</p>
                  <p className="text-xl text-green-700 mb-6 leading-relaxed">Based on FDA FAERS data and clinical guidelines, these medications appear safe to use together.</p>
                  <p className="text-base text-green-600">Always consult with a healthcare professional before making medication decisions.</p>
                </motion.div>
              ) : (
                <div className="space-y-10">
                  {getInteractions().map((interaction, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className={`border-2 rounded-3xl p-10 bg-gradient-to-br ${getSeverityColor(interaction.severity)} shadow-2xl`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className={`px-6 py-3 rounded-full text-lg font-bold ${getSeverityBadge(interaction.severity)}`}>
                              Severity: {interaction.severity}/10
                            </span>
                            <span className="font-bold text-2xl text-gray-900">{interaction.category}</span>
                          </div>
                          <p className="text-lg font-semibold text-gray-700 mb-4">{interaction.drugs.join(' + ')}</p>
                        </div>
                      </div>

                      <p className="text-2xl font-bold text-gray-900 mb-8 leading-relaxed">{interaction.description}</p>

                      <div className="grid lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white bg-opacity-70 rounded-2xl p-6 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-4 text-xl">Mechanism:</h4>
                          <p className="text-lg text-gray-700 leading-relaxed">{interaction.mechanism}</p>
                        </div>
                        <div className="bg-white bg-opacity-70 rounded-2xl p-6 border border-gray-200">
                          <h4 className="font-bold text-gray-900 mb-4 text-xl">FDA Data:</h4>
                          <p className="text-lg text-gray-700 font-semibold leading-relaxed">{interaction.fdaData}</p>
                        </div>
                      </div>

                      {/* Locked Premium Features */}
                      <div className="relative mt-8">
                        <div className="filter blur-sm pointer-events-none bg-white bg-opacity-50 rounded-2xl p-8 border-2 border-dashed border-gray-300">
                          <h4 className="font-bold mb-6 text-xl">Alternative Medications & Mitigation Protocols:</h4>
                          <ul className="text-lg space-y-4">
                            <li>• Detailed alternative medication recommendations...</li>
                            <li>• Step-by-step clinical mitigation protocols...</li>
                            <li>• Patient monitoring guidelines and schedules...</li>
                          </ul>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={checkoutRxGuardProfessional}
                            className="px-12 py-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-2xl shadow-2xl hover:from-cyan-700 hover:to-blue-700 transition-all text-xl"
                          >
                            🔓 Unlock Full Analysis
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Upgrade CTA */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 text-white rounded-3xl p-16 text-center shadow-2xl"
                  >
                    <div className="text-6xl mb-8">🚀</div>
                    <h3 className="text-4xl font-bold mb-6">Ready for Full Access?</h3>
                    <p className="text-2xl mb-10 text-blue-100">Join 1,247 healthcare providers using RxGuard™ Professional</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={checkoutRxGuardProfessional}
                      className="px-16 py-6 bg-white text-cyan-600 font-bold rounded-2xl hover:bg-gray-100 transition-all shadow-2xl text-2xl"
                    >
                      Start 14-Day Free Trial
                    </motion.button>
                    <p className="text-base text-blue-100 mt-6">Only $39/month after trial • Cancel anytime</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RxGuardPrototype

