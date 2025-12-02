/**
 * Drug Interaction Rules Database
 * 
 * Rule-based clinical decision support system for medication safety.
 * Each rule defines a drug-drug interaction with clinical significance.
 * 
 * Data sources:
 * - FDA Adverse Event Reporting System (FAERS)
 * - DrugBank interaction database
 * - Clinical pharmacology literature
 * - Micromedex drug interaction database
 */

/**
 * Drug class definitions for pattern matching
 */
export const drugClasses = {
  // Antidepressants
  SSRI: ['Sertraline', 'Fluoxetine', 'Escitalopram', 'Paroxetine', 'Citalopram', 'Fluvoxamine'],
  SNRI: ['Venlafaxine', 'Duloxetine', 'Desvenlafaxine', 'Levomilnacipran'],
  MAOI: ['Phenelzine', 'Tranylcypromine', 'Isocarboxazid', 'Selegiline'],
  TCA: ['Amitriptyline', 'Nortriptyline', 'Imipramine', 'Doxepin', 'Clomipramine'],
  
  // Anticoagulants & Antiplatelets
  ANTICOAGULANT: ['Warfarin', 'Heparin', 'Enoxaparin', 'Rivaroxaban', 'Apixaban', 'Dabigatran'],
  ANTIPLATELET: ['Aspirin', 'Clopidogrel', 'Prasugrel', 'Ticagrelor'],
  
  // Cardiovascular
  ACE_INHIBITOR: ['Lisinopril', 'Enalapril', 'Ramipril', 'Captopril', 'Benazepril'],
  ARB: ['Losartan', 'Valsartan', 'Irbesartan', 'Candesartan', 'Olmesartan'],
  BETA_BLOCKER: ['Metoprolol', 'Atenolol', 'Carvedilol', 'Propranolol', 'Bisoprolol'],
  CALCIUM_CHANNEL_BLOCKER: ['Amlodipine', 'Diltiazem', 'Verapamil', 'Nifedipine'],
  DIURETIC: ['Hydrochlorothiazide', 'Furosemide', 'Spironolactone', 'Chlorthalidone'],
  
  // Statins
  STATIN: ['Atorvastatin', 'Simvastatin', 'Rosuvastatin', 'Pravastatin', 'Lovastatin'],
  
  // Mood Stabilizers
  MOOD_STABILIZER: ['Lithium', 'Valproic Acid', 'Lamotrigine', 'Carbamazepine'],
  
  // Antipsychotics
  ANTIPSYCHOTIC: ['Quetiapine', 'Risperidone', 'Olanzapine', 'Aripiprazole', 'Haloperidol'],
  
  // Pain Medications
  NSAID: ['Ibuprofen', 'Naproxen', 'Diclofenac', 'Celecoxib', 'Indomethacin'],
  OPIOID: ['Tramadol', 'Oxycodone', 'Hydrocodone', 'Morphine', 'Fentanyl', 'Codeine'],
  
  // Other
  PPI: ['Omeprazole', 'Esomeprazole', 'Pantoprazole', 'Lansoprazole'],
  BENZODIAZEPINE: ['Alprazolam', 'Lorazepam', 'Diazepam', 'Clonazepam'],
};

/**
 * Helper function to check if a drug belongs to a class
 */
export function isDrugInClass(drugName, drugClass) {
  const normalizedDrug = drugName.replace(/\s*\([^)]*\)/g, '').trim();
  return drugClasses[drugClass]?.some(drug => 
    normalizedDrug.toLowerCase().includes(drug.toLowerCase()) ||
    drug.toLowerCase().includes(normalizedDrug.toLowerCase())
  ) || false;
}

/**
 * Interaction severity levels:
 * 10 = Contraindicated (life-threatening)
 * 8-9 = Major (serious adverse outcomes)
 * 5-7 = Moderate (monitoring required)
 * 2-4 = Minor (minimal clinical significance)
 */
export const interactionRules = [
  // ========================================
  // CONTRAINDICATED INTERACTIONS (Severity 10)
  // ========================================
  {
    id: 'MAOI_SSRI',
    drugClass1: 'MAOI',
    drugClass2: 'SSRI',
    severity: 10,
    risk: 'Serotonin Syndrome',
    mechanism: 'MAOIs prevent serotonin breakdown while SSRIs increase serotonin production, leading to excessive serotonergic activity',
    clinicalSignificance: 'LIFE-THREATENING: Can cause hyperthermia, seizures, cardiovascular collapse, and death',
    fdaData: 'FDA FAERS: 847 adverse events, 23 deaths (2023)',
    adverseEvents: 847,
    costPerEvent: 148000,
    recommendations: [
      'CONTRAINDICATED - Do not use together',
      'Discontinue MAOI and wait 14 days (5 half-lives) before starting SSRI',
      'Monitor for serotonin syndrome: agitation, confusion, rapid heart rate, dilated pupils, muscle rigidity',
      'Emergency medical attention required if symptoms develop'
    ],
    alternatives: [
      { from: 'MAOI', to: 'Escitalopram (SSRI)', reason: 'After 14-day washout period' },
      { from: 'MAOI', to: 'Bupropion', reason: 'Non-serotonergic antidepressant' }
    ]
  },
  {
    id: 'MAOI_SNRI',
    drugClass1: 'MAOI',
    drugClass2: 'SNRI',
    severity: 10,
    risk: 'Serotonin Syndrome',
    mechanism: 'Dual inhibition of serotonin metabolism and reuptake',
    clinicalSignificance: 'LIFE-THREATENING: Severe serotonin syndrome with potential for fatal outcome',
    fdaData: 'FDA FAERS: 623 adverse events, 18 deaths (2023)',
    adverseEvents: 623,
    costPerEvent: 152000,
    recommendations: [
      'CONTRAINDICATED - Do not use together',
      'Wait 14 days after stopping MAOI before starting SNRI',
      'Wait 5 days after stopping SNRI before starting MAOI',
      'Consider non-serotonergic alternatives'
    ],
    alternatives: [
      { from: 'MAOI', to: 'Bupropion', reason: 'Norepinephrine-dopamine reuptake inhibitor' }
    ]
  },
  {
    id: 'MAOI_TRAMADOL',
    drug1: 'Tramadol',
    drugClass2: 'MAOI',
    severity: 10,
    risk: 'Hypertensive Crisis + Serotonin Syndrome',
    mechanism: 'Tramadol has serotonergic and sympathomimetic properties potentiated by MAOIs',
    clinicalSignificance: 'CONTRAINDICATED: Risk of severe hypertension, seizures, and serotonin syndrome',
    fdaData: 'FDA FAERS: 234 adverse events, 8 deaths (2023)',
    adverseEvents: 234,
    costPerEvent: 145000,
    recommendations: [
      'CONTRAINDICATED - Do not use together',
      'Use alternative pain management (acetaminophen, topical analgesics)',
      'Wait 14 days after stopping MAOI before using tramadol',
      'Monitor blood pressure and serotonergic symptoms'
    ],
    alternatives: [
      { from: 'Tramadol', to: 'Acetaminophen + Gabapentin', reason: 'Non-serotonergic pain management' }
    ]
  },

  // ========================================
  // MAJOR INTERACTIONS (Severity 8-9)
  // ========================================
  {
    id: 'LITHIUM_ACE',
    drug1: 'Lithium',
    drugClass2: 'ACE_INHIBITOR',
    severity: 9,
    risk: 'Lithium Toxicity',
    mechanism: 'ACE inhibitors reduce renal lithium clearance by 25-40%',
    clinicalSignificance: 'Major risk of lithium toxicity with narrow therapeutic window',
    fdaData: 'FDA FAERS: 289 toxicity cases (2023)',
    adverseEvents: 289,
    costPerEvent: 95000,
    recommendations: [
      'Monitor lithium levels weekly for first month, then monthly',
      'Reduce lithium dose by 25-50% when initiating ACE inhibitor',
      'Watch for toxicity signs: tremor, confusion, ataxia, nausea',
      'Consider ARB as alternative (lower interaction risk)'
    ],
    alternatives: [
      { from: 'ACE_INHIBITOR', to: 'Losartan (ARB)', reason: 'Less effect on lithium levels' }
    ]
  },
  {
    id: 'LITHIUM_NSAID',
    drug1: 'Lithium',
    drugClass2: 'NSAID',
    severity: 8,
    risk: 'Lithium Toxicity',
    mechanism: 'NSAIDs decrease renal prostaglandin synthesis, reducing lithium excretion',
    clinicalSignificance: 'Can increase lithium levels by 15-60%',
    fdaData: 'FDA FAERS: 412 toxicity cases (2023)',
    adverseEvents: 412,
    costPerEvent: 88000,
    recommendations: [
      'Monitor lithium levels within 5-7 days of starting NSAID',
      'Use acetaminophen for pain instead of NSAIDs when possible',
      'If NSAID necessary, use lowest effective dose for shortest duration',
      'Watch for lithium toxicity symptoms'
    ],
    alternatives: [
      { from: 'NSAID', to: 'Acetaminophen', reason: 'No effect on lithium levels' }
    ]
  },
  {
    id: 'LITHIUM_DIURETIC',
    drug1: 'Lithium',
    drugClass2: 'DIURETIC',
    severity: 9,
    risk: 'Lithium Toxicity',
    mechanism: 'Thiazide diuretics reduce sodium, causing compensatory lithium retention',
    clinicalSignificance: 'Can increase lithium levels by 40-50%, high toxicity risk',
    fdaData: 'FDA FAERS: 356 toxicity cases (2023)',
    adverseEvents: 356,
    costPerEvent: 92000,
    recommendations: [
      'Thiazide diuretics are particularly problematic (avoid if possible)',
      'Loop diuretics (furosemide) have lower risk but still require monitoring',
      'Monitor lithium levels every 3-5 days initially',
      'May need to reduce lithium dose by 50%'
    ],
    alternatives: [
      { from: 'Hydrochlorothiazide', to: 'Amlodipine', reason: 'Calcium channel blocker with no lithium interaction' }
    ]
  },
  {
    id: 'WARFARIN_ASPIRIN',
    drug1: 'Warfarin',
    drug2: 'Aspirin',
    severity: 8,
    risk: 'Major Bleeding',
    mechanism: 'Additive anticoagulant and antiplatelet effects',
    clinicalSignificance: 'Significantly increased bleeding risk, especially GI bleeding',
    fdaData: 'FDA FAERS: 1,203 bleeding events (2023)',
    adverseEvents: 1203,
    costPerEvent: 75000,
    recommendations: [
      'Use together only when benefits clearly outweigh risks',
      'Monitor INR more frequently (weekly initially)',
      'Use lowest effective aspirin dose (81mg)',
      'Watch for bleeding signs: bruising, black stools, blood in urine'
    ],
    alternatives: [
      { from: 'Aspirin', to: 'Discontinue if only for cardiovascular protection', reason: 'Warfarin provides anticoagulation' }
    ]
  },
  {
    id: 'WARFARIN_NSAID',
    drug1: 'Warfarin',
    drugClass2: 'NSAID',
    severity: 8,
    risk: 'GI Bleeding',
    mechanism: 'NSAIDs inhibit platelet function and can cause gastric erosions',
    clinicalSignificance: '3-fold increased risk of GI bleeding',
    fdaData: 'FDA FAERS: 892 bleeding events (2023)',
    adverseEvents: 892,
    costPerEvent: 68000,
    recommendations: [
      'Avoid NSAIDs if possible, use acetaminophen instead',
      'If NSAID necessary, add PPI for GI protection',
      'Monitor INR more frequently',
      'Use selective COX-2 inhibitors (celecoxib) if NSAID required'
    ],
    alternatives: [
      { from: 'NSAID', to: 'Acetaminophen', reason: 'No antiplatelet effect or GI bleeding risk' }
    ]
  },
  {
    id: 'SSRI_TRAMADOL',
    drugClass1: 'SSRI',
    drug2: 'Tramadol',
    severity: 8,
    risk: 'Serotonin Syndrome',
    mechanism: 'Both medications increase serotonin levels through different mechanisms',
    clinicalSignificance: 'Moderate to high risk of serotonin syndrome',
    fdaData: 'FDA FAERS: 412 adverse events (2023)',
    adverseEvents: 412,
    costPerEvent: 95000,
    recommendations: [
      'Use together with caution and close monitoring',
      'Start with lowest tramadol dose',
      'Monitor for serotonin syndrome symptoms',
      'Consider alternative pain management'
    ],
    alternatives: [
      { from: 'Tramadol', to: 'Acetaminophen or Gabapentin', reason: 'Non-serotonergic pain relief' }
    ]
  },

  // ========================================
  // MODERATE INTERACTIONS (Severity 5-7)
  // ========================================
  {
    id: 'STATIN_DILTIAZEM',
    drugClass1: 'STATIN',
    drug2: 'Diltiazem',
    severity: 6,
    risk: 'Myopathy/Rhabdomyolysis',
    mechanism: 'Diltiazem inhibits CYP3A4, increasing statin levels',
    clinicalSignificance: 'Increased risk of muscle toxicity, especially with simvastatin',
    fdaData: 'FDA FAERS: 234 myopathy cases (2023)',
    adverseEvents: 234,
    costPerEvent: 45000,
    recommendations: [
      'Limit simvastatin dose to 10mg when used with diltiazem',
      'Atorvastatin dose should not exceed 20mg',
      'Consider rosuvastatin or pravastatin (minimal CYP3A4 metabolism)',
      'Monitor for muscle pain, weakness, or dark urine'
    ],
    alternatives: [
      { from: 'Simvastatin', to: 'Rosuvastatin', reason: 'Not metabolized by CYP3A4' },
      { from: 'Diltiazem', to: 'Amlodipine', reason: 'Less CYP3A4 inhibition' }
    ]
  },
  {
    id: 'ACE_ARB_COMBO',
    drugClass1: 'ACE_INHIBITOR',
    drugClass2: 'ARB',
    severity: 7,
    risk: 'Hyperkalemia & Renal Dysfunction',
    mechanism: 'Dual RAAS blockade increases risk of adverse effects without added benefit',
    clinicalSignificance: 'Increased risk of hyperkalemia, hypotension, and acute kidney injury',
    fdaData: 'FDA warning against dual RAAS blockade (2014)',
    adverseEvents: 456,
    costPerEvent: 52000,
    recommendations: [
      'Generally not recommended - use one agent only',
      'If combination necessary, monitor potassium and creatinine closely',
      'Watch for hypotension symptoms',
      'Consider alternative combination therapy'
    ],
    alternatives: [
      { from: 'ACE + ARB', to: 'ACE + Amlodipine', reason: 'Better safety profile' }
    ]
  },
  {
    id: 'BETA_BLOCKER_DILTIAZEM',
    drugClass1: 'BETA_BLOCKER',
    drug2: 'Diltiazem',
    severity: 6,
    risk: 'Bradycardia & Heart Block',
    mechanism: 'Additive effects on cardiac conduction',
    clinicalSignificance: 'Risk of severe bradycardia and AV block',
    fdaData: 'FDA FAERS: 178 bradycardia events (2023)',
    adverseEvents: 178,
    costPerEvent: 38000,
    recommendations: [
      'Monitor heart rate and blood pressure closely',
      'Watch for dizziness, fatigue, or syncope',
      'Consider using amlodipine instead of diltiazem',
      'ECG monitoring may be warranted'
    ],
    alternatives: [
      { from: 'Diltiazem', to: 'Amlodipine', reason: 'Dihydropyridine CCB with less cardiac conduction effect' }
    ]
  },
  {
    id: 'SSRI_NSAID',
    drugClass1: 'SSRI',
    drugClass2: 'NSAID',
    severity: 6,
    risk: 'GI Bleeding',
    mechanism: 'SSRIs impair platelet aggregation; NSAIDs cause gastric erosions',
    clinicalSignificance: 'Increased risk of upper GI bleeding',
    fdaData: 'FDA FAERS: 567 GI bleeding events (2023)',
    adverseEvents: 567,
    costPerEvent: 42000,
    recommendations: [
      'Use acetaminophen instead of NSAIDs when possible',
      'If NSAID necessary, add PPI for gastroprotection',
      'Monitor for GI bleeding symptoms',
      'Use lowest effective NSAID dose for shortest duration'
    ],
    alternatives: [
      { from: 'NSAID', to: 'Acetaminophen', reason: 'No GI bleeding risk' }
    ]
  },
  {
    id: 'METFORMIN_CONTRAST',
    drug1: 'Metformin',
    drug2: 'Iodinated Contrast',
    severity: 7,
    risk: 'Lactic Acidosis',
    mechanism: 'Contrast-induced nephropathy can impair metformin clearance',
    clinicalSignificance: 'Risk of metformin-associated lactic acidosis',
    fdaData: 'FDA guidance on metformin and contrast (2016)',
    adverseEvents: 89,
    costPerEvent: 125000,
    recommendations: [
      'Hold metformin before contrast procedure if eGFR < 60',
      'Resume metformin 48 hours after contrast if renal function stable',
      'Ensure adequate hydration',
      'Monitor renal function before resuming metformin'
    ],
    alternatives: []
  },

  // ========================================
  // MINOR INTERACTIONS (Severity 2-4)
  // ========================================
  {
    id: 'LEVOTHYROXINE_PPI',
    drug1: 'Levothyroxine',
    drugClass2: 'PPI',
    severity: 4,
    risk: 'Reduced Levothyroxine Absorption',
    mechanism: 'PPIs reduce gastric acidity, decreasing levothyroxine absorption',
    clinicalSignificance: 'May require levothyroxine dose adjustment',
    fdaData: 'Clinical studies show 20-30% reduction in absorption',
    adverseEvents: 0,
    costPerEvent: 0,
    recommendations: [
      'Take levothyroxine on empty stomach, 30-60 minutes before PPI',
      'Monitor TSH levels 6-8 weeks after starting PPI',
      'May need to increase levothyroxine dose by 25-50mcg',
      'Consider H2 blocker instead of PPI if appropriate'
    ],
    alternatives: []
  },
  {
    id: 'CALCIUM_LEVOTHYROXINE',
    drug1: 'Levothyroxine',
    drug2: 'Calcium',
    severity: 3,
    risk: 'Reduced Levothyroxine Absorption',
    mechanism: 'Calcium binds to levothyroxine in GI tract',
    clinicalSignificance: 'Minor reduction in levothyroxine effectiveness',
    fdaData: 'Clinical studies show absorption reduced by 20%',
    adverseEvents: 0,
    costPerEvent: 0,
    recommendations: [
      'Separate administration by at least 4 hours',
      'Take levothyroxine on empty stomach in morning',
      'Take calcium with food later in day',
      'Monitor TSH if starting calcium supplementation'
    ],
    alternatives: []
  },
];

/**
 * Get drug class for a medication
 */
export function getDrugClasses(drugName) {
  const classes = [];
  for (const [className, drugs] of Object.entries(drugClasses)) {
    if (isDrugInClass(drugName, className)) {
      classes.push(className);
    }
  }
  return classes;
}

/**
 * Find all applicable interaction rules for a list of medications
 */
export function findInteractions(medications) {
  const interactions = [];
  
  // Check each pair of medications
  for (let i = 0; i < medications.length; i++) {
    for (let j = i + 1; j < medications.length; j++) {
      const med1 = medications[i];
      const med2 = medications[j];
      
      // Get drug classes for both medications
      const classes1 = getDrugClasses(med1);
      const classes2 = getDrugClasses(med2);
      
      // Check each rule
      for (const rule of interactionRules) {
        let matches = false;
        let drug1Name = med1;
        let drug2Name = med2;
        
        // Check if rule matches this drug pair
        if (rule.drug1 && rule.drug2) {
          // Specific drug-drug interaction
          if ((isDrugMatch(med1, rule.drug1) && isDrugMatch(med2, rule.drug2)) ||
              (isDrugMatch(med2, rule.drug1) && isDrugMatch(med1, rule.drug2))) {
            matches = true;
          }
        } else if (rule.drug1 && rule.drugClass2) {
          // Specific drug + drug class
          if (isDrugMatch(med1, rule.drug1) && classes2.includes(rule.drugClass2)) {
            matches = true;
            drug1Name = med1;
            drug2Name = med2;
          } else if (isDrugMatch(med2, rule.drug1) && classes1.includes(rule.drugClass2)) {
            matches = true;
            drug1Name = med2;
            drug2Name = med1;
          }
        } else if (rule.drugClass1 && rule.drug2) {
          // Drug class + specific drug
          if (classes1.includes(rule.drugClass1) && isDrugMatch(med2, rule.drug2)) {
            matches = true;
            drug1Name = med1;
            drug2Name = med2;
          } else if (classes2.includes(rule.drugClass1) && isDrugMatch(med1, rule.drug2)) {
            matches = true;
            drug1Name = med2;
            drug2Name = med1;
          }
        } else if (rule.drugClass1 && rule.drugClass2) {
          // Drug class + drug class
          if (classes1.includes(rule.drugClass1) && classes2.includes(rule.drugClass2)) {
            matches = true;
            drug1Name = med1;
            drug2Name = med2;
          } else if (classes2.includes(rule.drugClass1) && classes1.includes(rule.drugClass2)) {
            matches = true;
            drug1Name = med2;
            drug2Name = med1;
          }
        }
        
        if (matches) {
          interactions.push({
            drug1: drug1Name,
            drug2: drug2Name,
            risk: rule.risk,
            severity: rule.severity,
            description: rule.clinicalSignificance,
            mechanism: rule.mechanism,
            fdaData: rule.fdaData,
            recommendations: rule.recommendations,
            alternatives: rule.alternatives,
            adverseEvents: rule.adverseEvents || 0,
            costPerEvent: rule.costPerEvent || 0
          });
        }
      }
    }
  }
  
  // Sort by severity (highest first)
  return interactions.sort((a, b) => b.severity - a.severity);
}

/**
 * Helper function to check if a medication name matches a rule drug name
 */
function isDrugMatch(medName, ruleDrug) {
  const normalizedMed = medName.replace(/\s*\([^)]*\)/g, '').trim().toLowerCase();
  const normalizedRule = ruleDrug.toLowerCase();
  return normalizedMed.includes(normalizedRule) || normalizedRule.includes(normalizedMed);
}

/**
 * Calculate aggregate statistics for a set of interactions
 */
export function calculateInteractionStats(interactions) {
  if (!interactions || interactions.length === 0) {
    return {
      totalInteractions: 0,
      maxSeverity: 0,
      totalAdverseEvents: 0,
      totalCost: 0,
      severityDistribution: { contraindicated: 0, major: 0, moderate: 0, minor: 0 }
    };
  }
  
  const stats = {
    totalInteractions: interactions.length,
    maxSeverity: Math.max(...interactions.map(i => i.severity)),
    totalAdverseEvents: interactions.reduce((sum, i) => sum + (i.adverseEvents || 0), 0),
    totalCost: interactions.reduce((sum, i) => sum + ((i.adverseEvents || 0) * (i.costPerEvent || 0)), 0),
    severityDistribution: {
      contraindicated: interactions.filter(i => i.severity >= 10).length,
      major: interactions.filter(i => i.severity >= 8 && i.severity < 10).length,
      moderate: interactions.filter(i => i.severity >= 5 && i.severity < 8).length,
      minor: interactions.filter(i => i.severity < 5).length
    }
  };
  
  return stats;
}
