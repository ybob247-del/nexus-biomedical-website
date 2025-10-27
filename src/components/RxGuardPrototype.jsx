import React, { useState } from 'react'
import { checkoutRxGuardProfessional } from '../utils/stripe'

const RxGuardPrototype = ({ onBack, onUpgrade }) => {
  const [medications, setMedications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  // Sample medication database - expanded with psychiatric medications
  const medicationDatabase = [
    // Cardiovascular
    'Warfarin', 'Aspirin', 'Lisinopril', 'Metformin', 'Atorvastatin',
    'Amlodipine', 'Metoprolol', 'Losartan', 'Clopidogrel', 'Simvastatin',
    'Hydrochlorothiazide', 'Furosemide', 'Digoxin', 'Carvedilol',
    // Psychiatric Medications
    'Sertraline (Zoloft)', 'Fluoxetine (Prozac)', 'Escitalopram (Lexapro)', 'Paroxetine (Paxil)',
    'Venlafaxine (Effexor)', 'Duloxetine (Cymbalta)', 'Bupropion (Wellbutrin)',
    'Lithium', 'Valproic Acid', 'Lamotrigine', 'Carbamazepine',
    'Quetiapine (Seroquel)', 'Risperidone (Risperdal)', 'Olanzapine (Zyprexa)', 'Aripiprazole (Abilify)',
    'Clonazepam (Klonopin)', 'Lorazepam (Ativan)', 'Alprazolam (Xanax)', 'Diazepam (Valium)',
    'Phenelzine (MAOI)', 'Tranylcypromine (MAOI)',
    // Other Common Medications
    'Omeprazole', 'Gabapentin', 'Levothyroxine', 'Albuterol', 'Prednisone',
    'Ibuprofen', 'Acetaminophen', 'Amoxicillin', 'Tramadol', 'Cyclobenzaprine'
  ]

  // Sample interactions (for demo purposes)
  const sampleInteractions = [
    {
      drugs: ['Warfarin', 'Aspirin'],
      severity: 9,
      category: 'Critical',
      description: 'Increased risk of bleeding. Both medications affect blood clotting.',
      mechanism: 'Additive anticoagulant and antiplatelet effects',
      clinicalSignificance: 'Major bleeding risk requiring close monitoring',
      alternatives: ['Warfarin alone', 'Aspirin alone', 'Consider alternative anticoagulant'],
      mitigation: [
        'Monitor INR more frequently (weekly)',
        'Watch for signs of bleeding',
        'Consider reducing aspirin dose or discontinuing',
        'Patient education on bleeding signs'
      ]
    },
    {
      drugs: ['Warfarin', 'Omeprazole'],
      severity: 6,
      category: 'Moderate',
      description: 'Omeprazole may increase warfarin levels, affecting INR.',
      mechanism: 'CYP2C19 enzyme inhibition',
      clinicalSignificance: 'May require warfarin dose adjustment',
      alternatives: ['Famotidine', 'Ranitidine (if available)'],
      mitigation: [
        'Monitor INR within 1 week of starting omeprazole',
        'May need to reduce warfarin dose by 10-20%',
        'Continue regular INR monitoring'
      ]
    },
    {
      drugs: ['Atorvastatin', 'Amlodipine'],
      severity: 4,
      category: 'Minor',
      description: 'Amlodipine may increase atorvastatin levels slightly.',
      mechanism: 'CYP3A4 enzyme inhibition',
      clinicalSignificance: 'Generally well-tolerated, monitor for muscle pain',
      alternatives: ['No change needed - safe combination'],
      mitigation: [
        'Monitor for muscle pain or weakness',
        'Consider lower atorvastatin dose if needed',
        'Check CK levels if symptoms develop'
      ]
    },
    {
      drugs: ['Phenelzine (MAOI)', 'Sertraline (Zoloft)'],
      severity: 10,
      category: 'Critical',
      description: 'SEVERE: Risk of serotonin syndrome - potentially fatal. NEVER combine MAOIs with SSRIs.',
      mechanism: 'Excessive serotonergic activity causing serotonin syndrome',
      clinicalSignificance: 'Life-threatening interaction requiring immediate medical attention',
      alternatives: ['Wait 14 days after stopping MAOI before starting SSRI', 'Consider tricyclic antidepressant after washout', 'Consult psychiatrist immediately'],
      mitigation: [
        'CONTRAINDICATED - Do not combine',
        'Requires 14-day washout period between medications',
        'Monitor for serotonin syndrome symptoms: agitation, confusion, rapid heart rate, high blood pressure, dilated pupils, muscle rigidity',
        'Emergency medical care if symptoms develop'
      ]
    },
    {
      drugs: ['Warfarin', 'Sertraline (Zoloft)'],
      severity: 7,
      category: 'Moderate',
      description: 'SSRIs can increase bleeding risk when combined with anticoagulants.',
      mechanism: 'SSRIs inhibit platelet aggregation; additive effect with warfarin',
      clinicalSignificance: 'Increased risk of bleeding, particularly GI bleeding',
      alternatives: ['Consider mirtazapine (less bleeding risk)', 'Use bupropion if appropriate'],
      mitigation: [
        'Monitor INR more frequently (weekly initially)',
        'Watch for signs of bleeding (bruising, nosebleeds, blood in stool)',
        'Consider PPI for GI protection',
        'Patient education on bleeding precautions'
      ]
    },
    {
      drugs: ['Tramadol', 'Sertraline (Zoloft)'],
      severity: 8,
      category: 'Critical',
      description: 'Increased risk of serotonin syndrome and seizures.',
      mechanism: 'Both medications increase serotonin; tramadol lowers seizure threshold',
      clinicalSignificance: 'Risk of serotonin syndrome and increased seizure risk',
      alternatives: ['Use non-serotonergic pain medication (acetaminophen, NSAIDs)', 'Consider duloxetine for both pain and depression'],
      mitigation: [
        'Use lowest effective doses of both medications',
        'Monitor closely for serotonin syndrome symptoms',
        'Avoid in patients with seizure history',
        'Consider alternative pain management'
      ]
    },
    {
      drugs: ['Lithium', 'Lisinopril'],
      severity: 8,
      category: 'Critical',
      description: 'ACE inhibitors can increase lithium levels, risking toxicity.',
      mechanism: 'Reduced renal clearance of lithium',
      clinicalSignificance: 'Risk of lithium toxicity with neurological and cardiac effects',
      alternatives: ['Use losartan (ARB) instead - safer with lithium', 'Use calcium channel blocker'],
      mitigation: [
        'Monitor lithium levels weekly initially, then monthly',
        'Watch for lithium toxicity signs: tremor, confusion, nausea, diarrhea',
        'May need to reduce lithium dose by 25-50%',
        'Monitor renal function and electrolytes'
      ]
    },
    {
      drugs: ['Quetiapine (Seroquel)', 'Fluoxetine (Prozac)'],
      severity: 6,
      category: 'Moderate',
      description: 'Fluoxetine may increase quetiapine levels via CYP3A4 inhibition.',
      mechanism: 'CYP3A4 enzyme inhibition increases quetiapine exposure',
      clinicalSignificance: 'Increased sedation, orthostatic hypotension, QT prolongation risk',
      alternatives: ['Consider sertraline (less CYP interaction)', 'Use escitalopram'],
      mitigation: [
        'Start with lower quetiapine dose (reduce by 50%)',
        'Monitor for excessive sedation',
        'Check orthostatic vital signs',
        'Consider baseline and follow-up ECG for QT interval'
      ]
    },
    {
      drugs: ['Omeprazole', 'Clopidogrel'],
      severity: 7,
      category: 'Moderate',
      description: 'Omeprazole reduces clopidogrel effectiveness, increasing cardiovascular risk.',
      mechanism: 'CYP2C19 inhibition prevents clopidogrel activation',
      clinicalSignificance: 'Reduced antiplatelet effect increases risk of cardiovascular events',
      alternatives: ['Use pantoprazole (less CYP2C19 inhibition)', 'Use famotidine or ranitidine', 'Consider ticagrelor instead of clopidogrel'],
      mitigation: [
        'Separate administration by 12 hours if combination necessary',
        'Switch to pantoprazole or H2 blocker',
        'Consider CYP2C19 genetic testing',
        'Monitor for cardiovascular events'
      ]
    }
  ]

  const filteredMedications = medicationDatabase.filter(med =>
    med.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddMedication = (med) => {
    if (!medications.includes(med)) {
      setMedications([...medications, med])
      setSearchTerm('')
    }
  }

  const handleRemoveMedication = (med) => {
    setMedications(medications.filter(m => m !== med))
    setShowResults(false)
  }

  const handleAnalyze = () => {
    if (medications.length < 2) {
      alert('Please add at least 2 medications to check for interactions')
      return
    }
    
    setAnalyzing(true)
    setTimeout(() => {
      setAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const getInteractions = () => {
    return sampleInteractions.filter(interaction => {
      return interaction.drugs.every(drug => medications.includes(drug))
    })
  }

  const getSeverityColor = (severity) => {
    if (severity >= 8) return 'bg-red-500'
    if (severity >= 5) return 'bg-orange-500'
    return 'bg-yellow-500'
  }

  const getSeverityBorderColor = (severity) => {
    if (severity >= 8) return 'border-red-500'
    if (severity >= 5) return 'border-orange-500'
    return 'border-yellow-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
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
              <h1 className="text-2xl font-bold text-white">RxGuard™ Interactive Demo</h1>
            </div>
            <button 
              onClick={checkoutRxGuardProfessional}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
            >
              Start 14-Day Free Trial
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
        <div className="mb-6 bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-blue-300 font-semibold mb-1">Demo Mode</h3>
              <p className="text-blue-200 text-sm">
                This is a functional demo with sample data including psychiatric medications (SSRIs, MAOIs, antipsychotics, mood stabilizers). 
                Try complex combinations like Warfarin + Sertraline + Tramadol to see multiple interactions. 
                Upgrade to Professional to access the full drug database (10,000+ medications), real-time AI analysis, and comprehensive clinical recommendations.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Medication Input */}
          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Patient Medications</h2>
              
              {/* Example Scenarios */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  🎯 Quick Demo Scenarios
                </label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => {
                      setMedications(['Warfarin', 'Aspirin', 'Sertraline (Zoloft)', 'Omeprazole', 'Ibuprofen'])
                      setShowResults(false)
                    }}
                    className="text-left px-4 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-lg text-white hover:from-red-500/30 hover:to-orange-500/30 transition-all"
                  >
                    <div className="font-semibold text-red-300 mb-1">🚨 Elderly Patient on 5 Medications</div>
                    <div className="text-xs text-white/70">Multiple critical bleeding risks + SSRI interactions</div>
                  </button>
                  <button
                    onClick={() => {
                      setMedications(['Phenelzine (MAOI)', 'Sertraline (Zoloft)', 'Tramadol'])
                      setShowResults(false)
                    }}
                    className="text-left px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg text-white hover:from-purple-500/30 hover:to-pink-500/30 transition-all"
                  >
                    <div className="font-semibold text-purple-300 mb-1">🧠 Psychiatric Patient Crisis</div>
                    <div className="text-xs text-white/70">LIFE-THREATENING: MAOI + SSRI serotonin syndrome risk</div>
                  </button>
                  <button
                    onClick={() => {
                      setMedications(['Tramadol', 'Sertraline (Zoloft)', 'Warfarin', 'Cyclobenzaprine'])
                      setShowResults(false)
                    }}
                    className="text-left px-4 py-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/50 rounded-lg text-white hover:from-orange-500/30 hover:to-yellow-500/30 transition-all"
                  >
                    <div className="font-semibold text-orange-300 mb-1">💊 Post-Surgery Pain Management</div>
                    <div className="text-xs text-white/70">Serotonin syndrome + bleeding risks + seizure risk</div>
                  </button>
                  <button
                    onClick={() => {
                      setMedications(['Lithium', 'Lisinopril', 'Quetiapine (Seroquel)', 'Fluoxetine (Prozac)'])
                      setShowResults(false)
                    }}
                    className="text-left px-4 py-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/50 rounded-lg text-white hover:from-blue-500/30 hover:to-cyan-500/30 transition-all"
                  >
                    <div className="font-semibold text-blue-300 mb-1">❤️ Bipolar Disorder Treatment</div>
                    <div className="text-xs text-white/70">Lithium toxicity risk + CYP interactions</div>
                  </button>
                </div>
              </div>

              {/* Search Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Search and Add Medications
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type medication name..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                
                {/* Medication Suggestions */}
                {searchTerm && (
                  <div className="mt-2 bg-white/5 border border-white/20 rounded-lg max-h-48 overflow-y-auto">
                    {filteredMedications.length > 0 ? (
                      filteredMedications.map((med) => (
                        <button
                          key={med}
                          onClick={() => handleAddMedication(med)}
                          className="w-full text-left px-4 py-2 text-white hover:bg-white/10 transition-colors"
                          disabled={medications.includes(med)}
                        >
                          {med}
                          {medications.includes(med) && (
                            <span className="ml-2 text-green-400 text-sm">✓ Added</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-white/50">No medications found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Current Medications List */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Current Medications ({medications.length})
                </label>
                {medications.length === 0 ? (
                  <div className="text-center py-8 text-white/50">
                    <p>No medications added yet</p>
                    <p className="text-sm mt-2">Add at least 2 medications to check for interactions</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {medications.map((med) => (
                      <div
                        key={med}
                        className="flex items-center justify-between bg-white/5 border border-white/20 rounded-lg px-4 py-3"
                      >
                        <span className="text-white font-medium">{med}</span>
                        <button
                          onClick={() => handleRemoveMedication(med)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                disabled={medications.length < 2 || analyzing}
                className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold transition-all ${
                  medications.length < 2
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : analyzing
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600 shadow-lg'
                }`}
              >
                {analyzing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Interactions...
                  </span>
                ) : (
                  'Analyze Drug Interactions'
                )}
              </button>
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {!showResults ? (
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 h-full flex items-center justify-center">
                <div className="text-center text-white/50">
                  <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-lg">Add medications and click "Analyze" to see results</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <h2 className="text-xl font-bold text-white mb-4">Analysis Results</h2>
                  
                  {getInteractions().length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">No Critical Interactions Found</h3>
                      <p className="text-white/70">
                        The current medication combination appears safe based on available data.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {getInteractions().map((interaction, index) => (
                        <div
                          key={index}
                          className={`border-l-4 ${getSeverityBorderColor(interaction.severity)} bg-white/5 rounded-lg p-4`}
                        >
                          {/* Interaction Header */}
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className={`px-3 py-1 ${getSeverityColor(interaction.severity)} text-white text-xs font-bold rounded-full`}>
                                  {interaction.category}
                                </span>
                                <span className="text-white/70 text-sm">Severity: {interaction.severity}/10</span>
                              </div>
                              <h3 className="text-white font-semibold">
                                {interaction.drugs.join(' + ')}
                              </h3>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-white/90 mb-3">{interaction.description}</p>

                          {/* Details - Locked in Demo */}
                          <div className="relative">
                            <div className="blur-sm pointer-events-none select-none">
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-white/70 font-medium">Mechanism:</span>
                                  <span className="text-white/50 ml-2">{interaction.mechanism}</span>
                                </div>
                                <div>
                                  <span className="text-white/70 font-medium">Clinical Significance:</span>
                                  <span className="text-white/50 ml-2">{interaction.clinicalSignificance}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Upgrade Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                              <button
                                onClick={onUpgrade}
                                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                              >
                                🔒 Upgrade to View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pro Features Teaser */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-xl p-6">
                  <h3 className="text-white font-bold mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Unlock Professional Features
                  </h3>
                  <ul className="space-y-2 text-white/80 text-sm mb-4">
                    <li className="flex items-center">
                      <span className="text-cyan-400 mr-2">✓</span>
                      Alternative medication recommendations
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan-400 mr-2">✓</span>
                      Clinical mitigation strategies
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan-400 mr-2">✓</span>
                      Patient-friendly reports (PDF)
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan-400 mr-2">✓</span>
                      Access to 10,000+ medication database
                    </li>
                    <li className="flex items-center">
                      <span className="text-cyan-400 mr-2">✓</span>
                      Unlimited interaction checks
                    </li>
                  </ul>
                  <button
                    onClick={checkoutRxGuardProfessional}
                    className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg"
                  >
                    Start 14-Day Free Trial
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RxGuardPrototype

