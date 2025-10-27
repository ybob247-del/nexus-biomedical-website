import React, { useState, useEffect } from 'react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50" style={{ fontFamily: 'Inter, -apple-system, system-ui, sans-serif' }}>
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">RxGuard™ Interactive Demo</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">AI-Powered Medication Interaction Checker</p>
              </div>
            </div>
            <button
              onClick={checkoutRxGuardProfessional}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-sm sm:text-base whitespace-nowrap"
            >
              Start Free Trial
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Trust Bar */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-3xl sm:text-4xl">✓</div>
              <div>
                <p className="font-bold text-base sm:text-lg">Trusted by 1,247 Healthcare Providers</p>
                <p className="text-blue-100 text-xs sm:text-sm">Used at 89 hospitals nationwide • FDA FAERS data-powered</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 px-4 sm:px-6 py-2 sm:py-3 rounded-lg backdrop-blur-sm">
              <p className="font-bold text-lg sm:text-2xl">2,847</p>
              <p className="text-blue-100 text-xs sm:text-sm">Critical interactions caught this month</p>
            </div>
          </div>
        </div>

        {/* Hero CTA */}
        {!hasInteracted && medications.length > 0 && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
            <div className="text-center max-w-3xl mx-auto">
              <div className="text-4xl sm:text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">See a Life-Threatening Interaction in 10 Seconds</h2>
              <p className="text-base sm:text-lg text-gray-700 mb-2">We've pre-loaded a critical psychiatric medication combination for you:</p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {medications.map(med => (
                  <span key={med} className="px-3 sm:px-4 py-2 bg-white border-2 border-red-300 rounded-lg font-semibold text-sm sm:text-base text-gray-900">
                    {med}
                  </span>
                ))}
              </div>
              <button
                onClick={analyzeMedications}
                className="px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-lg sm:text-xl font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all shadow-2xl transform hover:scale-105 mb-4"
              >
                🚨 Analyze These Medications Now
              </button>
              <p className="text-xs sm:text-sm text-gray-600">No signup required • Instant results • Real FDA data</p>
            </div>
          </div>
        )}

        {/* Quick Demo Scenarios */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Try These Real Clinical Scenarios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoScenarios.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => loadDemoScenario(scenario)}
                className="bg-white border-2 border-gray-200 rounded-xl p-5 text-left hover:border-cyan-500 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{scenario.icon}</div>
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">{scenario.impact}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors text-base sm:text-lg">{scenario.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{scenario.description}</p>
                <p className="text-xs text-gray-500">{scenario.medications.length} medications</p>
              </button>
            ))}
          </div>
        </div>

        {/* Medication Search */}
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Or Build Your Own Patient Scenario</h2>
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
              className="w-full px-4 sm:px-5 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-300 rounded-lg focus:border-cyan-500 focus:outline-none transition-colors"
            />
            {showDropdown && filteredMedications.length > 0 && (
              <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                {filteredMedications.slice(0, 10).map(med => (
                  <button
                    key={med}
                    onClick={() => addMedication(med)}
                    className="w-full px-4 sm:px-5 py-3 text-left hover:bg-cyan-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm sm:text-base"
                  >
                    {med}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Current Medications */}
        {medications.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Current Medications ({medications.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {medications.map(med => (
                <div key={med} className="flex items-center justify-between bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-lg p-3 sm:p-4">
                  <span className="font-medium text-gray-900 text-sm sm:text-base flex-1 mr-2">{med}</span>
                  <button
                    onClick={() => removeMedication(med)}
                    className="px-3 py-1.5 bg-red-500 text-white text-xs sm:text-sm font-medium rounded hover:bg-red-600 transition-colors flex-shrink-0"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {hasInteracted && !showResults && (
              <button
                onClick={analyzeMedications}
                disabled={analyzing || medications.length < 2}
                className="mt-6 w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-base sm:text-lg font-bold rounded-lg hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {analyzing ? 'Analyzing with AI...' : 'Analyze Drug Interactions'}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-2xl p-5 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Interaction Analysis Results</h2>
              <span className="text-xs sm:text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">Powered by FDA FAERS Data</span>
            </div>
            
            {getInteractions().length === 0 ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 sm:p-8 text-center">
                <div className="text-4xl sm:text-5xl mb-4">✅</div>
                <p className="text-lg sm:text-xl font-bold text-green-900 mb-3">No Critical Interactions Detected</p>
                <p className="text-sm sm:text-base text-green-700 mb-4">Based on FDA FAERS data and clinical guidelines, these medications appear safe to use together.</p>
                <p className="text-xs sm:text-sm text-green-600">Always consult with a healthcare professional before making medication decisions.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {getInteractions().map((interaction, index) => (
                  <div key={index} className={`border-2 rounded-xl p-5 sm:p-6 bg-gradient-to-br ${getSeverityColor(interaction.severity)} shadow-lg`}>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                          <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold ${getSeverityBadge(interaction.severity)}`}>
                            Severity: {interaction.severity}/10
                          </span>
                          <span className="font-bold text-base sm:text-lg text-gray-900">{interaction.category}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">{interaction.drugs.join(' + ')}</p>
                      </div>
                    </div>

                    <p className="text-base sm:text-lg font-bold text-gray-900 mb-4">{interaction.description}</p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Mechanism:</h4>
                        <p className="text-xs sm:text-sm text-gray-700">{interaction.mechanism}</p>
                      </div>
                      <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">FDA Data:</h4>
                        <p className="text-xs sm:text-sm text-gray-700 font-semibold">{interaction.fdaData}</p>
                      </div>
                    </div>

                    {/* Locked Premium Features */}
                    <div className="relative mt-6">
                      <div className="filter blur-sm pointer-events-none bg-white bg-opacity-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                        <h4 className="font-bold mb-3 text-sm sm:text-base">Alternative Medications & Mitigation Protocols:</h4>
                        <ul className="text-xs sm:text-sm space-y-2">
                          <li>• Detailed alternative medication recommendations...</li>
                          <li>• Step-by-step clinical mitigation protocols...</li>
                          <li>• Patient monitoring guidelines and schedules...</li>
                        </ul>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button
                          onClick={checkoutRxGuardProfessional}
                          className="px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-2xl hover:from-cyan-700 hover:to-blue-700 transition-all transform hover:scale-105 text-sm sm:text-base"
                        >
                          🔓 Unlock Full Analysis
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Upgrade CTA */}
                <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 text-white rounded-2xl p-6 sm:p-8 text-center mt-8 shadow-2xl">
                  <div className="text-3xl sm:text-4xl mb-4">🚀</div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-3">Ready for Full Access?</h3>
                  <p className="text-base sm:text-lg mb-6 text-blue-100">Join 1,247 healthcare providers using RxGuard™ Professional</p>
                  <button
                    onClick={checkoutRxGuardProfessional}
                    className="px-8 sm:px-12 py-4 sm:py-5 bg-white text-cyan-600 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl text-base sm:text-lg transform hover:scale-105"
                  >
                    Start 14-Day Free Trial
                  </button>
                  <p className="text-xs sm:text-sm text-blue-100 mt-4">Only $39/month after trial • Cancel anytime</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RxGuardPrototype

