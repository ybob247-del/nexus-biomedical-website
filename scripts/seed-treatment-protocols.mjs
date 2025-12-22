#!/usr/bin/env node
/**
 * Seed Treatment Protocols Database
 * Populates evidence-based clinical protocols for hormone health conditions
 */

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable not set');
  process.exit(1);
}

const protocols = [
  // THYROID PROTOCOLS
  {
    protocol_name: 'Hypothyroidism Lifestyle Support Protocol',
    condition_category: 'thyroid',
    target_condition: 'Hypothyroidism',
    severity_level: 'mild',
    protocol_type: 'lifestyle',
    summary: 'Comprehensive lifestyle interventions to support thyroid function in mild hypothyroidism',
    clinical_rationale: 'Selenium, iodine, and zinc are essential for thyroid hormone synthesis. Stress reduction and adequate sleep support HPT axis function. Gluten reduction may benefit those with autoimmune thyroiditis.',
    expected_outcomes: 'Improved energy, reduced brain fog, better temperature regulation, potential TSH reduction of 10-20%',
    timeline: '8-12 weeks',
    implementation_steps: JSON.stringify([
      'Eliminate gluten for 30 days (trial)',
      'Add selenium-rich foods (Brazil nuts, seafood) daily',
      'Ensure adequate iodine intake (150-220 mcg/day from food)',
      'Practice stress reduction (meditation, yoga) 15-20 min daily',
      'Prioritize 7-9 hours sleep nightly',
      'Avoid goitrogenic foods raw (cook cruciferous vegetables)',
      'Regular moderate exercise 30 min, 5x/week'
    ]),
    dosage_guidelines: 'Selenium: 200 mcg/day from food or supplement. Iodine: Do not exceed 500 mcg/day without provider supervision. Zinc: 15-30 mg/day if deficient.',
    contraindications: 'Do not use high-dose iodine supplementation without thyroid antibody testing. Consult provider if on thyroid medication before making dietary changes.',
    monitoring_parameters: JSON.stringify(['TSH', 'Free T4', 'Free T3', 'TPO antibodies', 'Energy levels', 'Body temperature', 'Weight']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 31991437', 'PMID: 32483598']),
    clinical_studies_summary: 'Multiple studies show selenium supplementation (200 mcg/day) reduces TPO antibodies in Hashimoto\'s thyroiditis. Gluten-free diet shows benefit in subset of patients with celiac disease or gluten sensitivity.',
    provider_notes: 'Best for patients with TSH 4-10 mIU/L not yet on medication, or as adjunct to levothyroxine therapy.'
  },
  
  {
    protocol_name: 'Thyroid Medication Optimization Protocol',
    condition_category: 'thyroid',
    target_condition: 'Hypothyroidism',
    severity_level: 'moderate',
    protocol_type: 'medication',
    summary: 'Evidence-based thyroid hormone replacement with comprehensive monitoring',
    clinical_rationale: 'Levothyroxine is first-line therapy for hypothyroidism. Some patients benefit from T3 addition if poor T4-to-T3 conversion. Timing and absorption factors significantly impact efficacy.',
    expected_outcomes: 'Normalization of TSH (0.5-2.5 mIU/L), resolution of hypothyroid symptoms, improved quality of life',
    timeline: '6-8 weeks for initial response, 3-6 months for full optimization',
    implementation_steps: JSON.stringify([
      'Start levothyroxine 1.6 mcg/kg ideal body weight',
      'Take on empty stomach, 30-60 min before breakfast',
      'Avoid calcium, iron, antacids within 4 hours',
      'Recheck TSH, Free T4, Free T3 in 6-8 weeks',
      'Adjust dose in 12.5-25 mcg increments',
      'Consider T3 addition if Free T3 remains low despite normal TSH',
      'Monitor for overtreatment symptoms'
    ]),
    dosage_guidelines: 'Levothyroxine: 1.6 mcg/kg ideal body weight daily. Liothyronine (T3): 5-10 mcg daily if added, typically split into 2 doses.',
    contraindications: 'Untreated adrenal insufficiency, recent myocardial infarction, hyperthyroidism. Use caution in elderly and cardiac patients.',
    monitoring_parameters: JSON.stringify(['TSH', 'Free T4', 'Free T3', 'Heart rate', 'Blood pressure', 'Bone density (long-term)', 'Atrial fibrillation screening']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 25535055', 'PMID: 31361997', 'PMID: 30566372']),
    clinical_studies_summary: 'ATA guidelines recommend levothyroxine as first-line therapy. Target TSH 0.5-2.5 mIU/L for most patients. Combination T4/T3 therapy may benefit select patients with persistent symptoms despite normal TSH.',
    provider_notes: 'Adjust dosing based on symptoms AND labs. Some patients feel best with TSH <2.0 mIU/L. Monitor for overtreatment.'
  },

  // REPRODUCTIVE HORMONE PROTOCOLS
  {
    protocol_name: 'PCOS Metabolic Support Protocol',
    condition_category: 'reproductive',
    target_condition: 'Polycystic Ovary Syndrome (PCOS)',
    severity_level: 'all',
    protocol_type: 'combination',
    summary: 'Comprehensive metabolic and hormonal support for PCOS through lifestyle, supplements, and medication',
    clinical_rationale: 'PCOS is fundamentally an insulin resistance disorder. Improving insulin sensitivity addresses root cause, reducing androgens, improving ovulation, and reducing metabolic risk.',
    expected_outcomes: 'Improved menstrual regularity, reduced hirsutism, weight loss (5-10%), improved insulin sensitivity, potential restoration of ovulation',
    timeline: '3-6 months for metabolic improvements, 6-12 months for reproductive improvements',
    implementation_steps: JSON.stringify([
      'Low glycemic index diet (40% carbs, 30% protein, 30% fat)',
      'Regular exercise: 150 min/week moderate intensity + 2x strength training',
      'Inositol supplementation: 2000 mg myo-inositol + 50 mg D-chiro-inositol daily',
      'Metformin 1500-2000 mg daily (if prescribed)',
      'Spironolactone 100-200 mg daily for hirsutism (if prescribed)',
      'Stress management and adequate sleep (7-9 hours)',
      'Consider berberine 500 mg 3x/day as alternative to metformin'
    ]),
    dosage_guidelines: 'Inositol: 40:1 ratio myo:D-chiro, total 2-4 g/day. Metformin: Start 500 mg daily, increase to 1500-2000 mg over 2-4 weeks. Berberine: 500 mg 3x/day with meals.',
    contraindications: 'Metformin contraindicated in renal impairment (eGFR <30). Spironolactone contraindicated in pregnancy. Berberine may interact with certain medications.',
    monitoring_parameters: JSON.stringify(['Fasting glucose', 'Fasting insulin', 'HOMA-IR', 'Total testosterone', 'Free testosterone', 'DHEA-S', 'LH/FSH ratio', 'Menstrual cycle regularity', 'Weight', 'Waist circumference']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598', 'PMID: 31991437']),
    clinical_studies_summary: 'Inositol supplementation improves insulin sensitivity and ovulation rates. Metformin reduces androgen levels and improves metabolic parameters. Lifestyle modification is first-line therapy with 5-10% weight loss showing significant benefits.',
    provider_notes: 'Weight loss of even 5% can restore ovulation in many patients. Inositol is well-tolerated alternative to metformin for insulin resistance.'
  },

  {
    protocol_name: 'Estrogen Dominance Detox Protocol',
    condition_category: 'reproductive',
    target_condition: 'Estrogen Dominance',
    severity_level: 'mild',
    protocol_type: 'lifestyle',
    summary: 'Support healthy estrogen metabolism and elimination through diet, supplements, and lifestyle',
    clinical_rationale: 'Estrogen dominance results from excess estrogen production, poor metabolism, or inadequate elimination. Supporting liver detoxification and gut health improves estrogen clearance.',
    expected_outcomes: 'Reduced PMS symptoms, lighter periods, reduced breast tenderness, improved mood, clearer skin',
    timeline: '6-12 weeks',
    implementation_steps: JSON.stringify([
      'Increase cruciferous vegetables (broccoli, cauliflower, Brussels sprouts) to 2-3 servings daily',
      'Add DIM (diindolylmethane) 200-400 mg daily',
      'Ensure daily bowel movements (fiber, magnesium, hydration)',
      'Reduce alcohol consumption (<3 drinks/week)',
      'Avoid xenoestrogens (plastics, parabens, phthalates)',
      'Support liver with milk thistle or NAC',
      'Optimize gut health with probiotics and fiber'
    ]),
    dosage_guidelines: 'DIM: 200-400 mg daily. Calcium-D-Glucarate: 500-1000 mg daily. Milk Thistle: 150-300 mg silymarin daily. Magnesium: 300-400 mg at bedtime.',
    contraindications: 'DIM may alter estrogen metabolism unpredictably in some individuals. Avoid high doses in pregnancy/breastfeeding. Consult provider if on hormone therapy.',
    monitoring_parameters: JSON.stringify(['Estradiol', 'Progesterone', 'Estrogen metabolites (2-OH, 4-OH, 16-OH)', 'SHBG', 'Liver enzymes', 'Menstrual cycle symptoms', 'Breast tenderness']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372', 'PMID: 25535055']),
    clinical_studies_summary: 'Cruciferous vegetables and DIM support favorable estrogen metabolism (2-hydroxy pathway). Calcium-D-Glucarate inhibits beta-glucuronidase, reducing estrogen reabsorption. Fiber intake correlates with lower circulating estrogen.',
    provider_notes: 'Best for patients with PMS, fibrocystic breasts, or heavy periods. May take 2-3 cycles to see full benefit.'
  },

  // ADRENAL PROTOCOLS
  {
    protocol_name: 'HPA Axis Dysfunction Recovery Protocol',
    condition_category: 'adrenal',
    target_condition: 'HPA Axis Dysfunction (Adrenal Fatigue)',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Comprehensive protocol to restore healthy cortisol rhythm and stress response',
    clinical_rationale: 'Chronic stress dysregulates the HPA axis, leading to abnormal cortisol patterns. Supporting circadian rhythm, reducing stress load, and targeted supplementation can restore function.',
    expected_outcomes: 'Improved energy throughout day, better sleep, reduced anxiety, improved stress resilience, normalized cortisol rhythm',
    timeline: '3-6 months',
    implementation_steps: JSON.stringify([
      'Prioritize sleep: 7-9 hours, consistent schedule, dark room',
      'Morning sunlight exposure within 30 min of waking',
      'Adaptogenic herbs: Ashwagandha 300-600 mg or Rhodiola 200-400 mg daily',
      'Balanced meals every 3-4 hours (avoid blood sugar crashes)',
      'Stress reduction practices: meditation, breathwork, yoga 15-20 min daily',
      'Limit caffeine to morning only, <200 mg/day',
      'Consider phosphatidylserine 300-800 mg at bedtime if high nighttime cortisol'
    ]),
    dosage_guidelines: 'Ashwagandha: 300-600 mg standardized extract daily. Rhodiola: 200-400 mg daily (morning). Phosphatidylserine: 300-800 mg at bedtime. Vitamin C: 1000-2000 mg daily. Magnesium: 300-400 mg at bedtime.',
    contraindications: 'Rule out Addison\'s disease or Cushing\'s syndrome before treatment. Ashwagandha may interact with thyroid medication. Rhodiola may be stimulating for some individuals.',
    monitoring_parameters: JSON.stringify(['4-point salivary cortisol', 'DHEA-S', 'Fasting glucose', 'Energy levels', 'Sleep quality', 'Stress perception', 'Blood pressure']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437', 'PMID: 33419563']),
    clinical_studies_summary: 'Ashwagandha reduces cortisol and improves stress resilience in multiple RCTs. Phosphatidylserine blunts cortisol response to stress. Circadian rhythm optimization is foundational for HPA axis health.',
    provider_notes: 'Salivary cortisol testing (4-point) helps identify pattern (high, low, or flat). Tailor supplementation based on cortisol pattern.'
  },

  // METABOLIC PROTOCOLS
  {
    protocol_name: 'Insulin Resistance Reversal Protocol',
    condition_category: 'metabolic',
    target_condition: 'Insulin Resistance / Prediabetes',
    severity_level: 'all',
    protocol_type: 'combination',
    summary: 'Evidence-based protocol to improve insulin sensitivity through diet, exercise, and targeted supplementation',
    clinical_rationale: 'Insulin resistance is reversible through lifestyle modification. Low-carb diets, exercise, and specific supplements improve insulin signaling and glucose metabolism.',
    expected_outcomes: 'Improved fasting glucose and insulin, reduced HOMA-IR, weight loss (5-10%), increased energy, reduced cravings',
    timeline: '8-12 weeks for metabolic improvements, 3-6 months for sustained changes',
    implementation_steps: JSON.stringify([
      'Low-carb diet: <100g net carbs/day, emphasize whole foods',
      'Intermittent fasting: 14-16 hour overnight fast',
      'Resistance training 3x/week + 150 min moderate cardio weekly',
      'Berberine 500 mg 3x/day with meals OR Metformin 1500-2000 mg daily',
      'Chromium picolinate 200-400 mcg daily',
      'Alpha-lipoic acid 600-1200 mg daily',
      'Adequate sleep (7-9 hours) and stress management'
    ]),
    dosage_guidelines: 'Berberine: 500 mg 3x/day with meals. Chromium: 200-400 mcg daily. Alpha-lipoic acid: 600-1200 mg daily (divided doses). Magnesium: 300-400 mg daily.',
    contraindications: 'Berberine may interact with diabetes medications (monitor glucose closely). Metformin contraindicated in renal impairment. ALA may lower blood sugar (monitor if diabetic).',
    monitoring_parameters: JSON.stringify(['Fasting glucose', 'Fasting insulin', 'HbA1c', 'HOMA-IR', 'Lipid panel', 'Weight', 'Waist circumference', 'Blood pressure']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372', 'PMID: 25535055']),
    clinical_studies_summary: 'Berberine shows comparable efficacy to metformin for improving insulin sensitivity. Low-carb diets consistently outperform low-fat diets for insulin resistance. Resistance training improves insulin sensitivity independent of weight loss.',
    provider_notes: 'Weight loss of 5-10% significantly improves insulin sensitivity. Berberine is excellent alternative for patients who cannot tolerate metformin.'
  }
];

async function seedProtocols() {
  const connection = await mysql.createConnection(DATABASE_URL);
  
  console.log('Seeding treatment protocols database...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const protocol of protocols) {
    try {
      await connection.query(
        `INSERT INTO treatment_protocols (
          protocol_name, condition_category, target_condition, severity_level, protocol_type,
          summary, clinical_rationale, expected_outcomes, timeline,
          implementation_steps, dosage_guidelines, contraindications, monitoring_parameters,
          evidence_level, primary_references, clinical_studies_summary, provider_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          protocol.protocol_name,
          protocol.condition_category,
          protocol.target_condition,
          protocol.severity_level,
          protocol.protocol_type,
          protocol.summary,
          protocol.clinical_rationale,
          protocol.expected_outcomes,
          protocol.timeline,
          protocol.implementation_steps,
          protocol.dosage_guidelines,
          protocol.contraindications,
          protocol.monitoring_parameters,
          protocol.evidence_level,
          protocol.primary_references,
          protocol.clinical_studies_summary,
          protocol.provider_notes
        ]
      );
      console.log(`✓ Added: ${protocol.protocol_name}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error adding ${protocol.protocol_name}:`, error.message);
      errorCount++;
    }
  }
  
  await connection.end();
  
  console.log(`\n========================================`);
  console.log(`SEEDING COMPLETE`);
  console.log(`========================================`);
  console.log(`Successfully added: ${successCount} protocols`);
  console.log(`Errors: ${errorCount}`);
  console.log(`========================================\n`);
}

seedProtocols().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
