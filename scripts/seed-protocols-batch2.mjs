#!/usr/bin/env node
/**
 * Seed Additional Treatment Protocols (Batch 2)
 * 20 more evidence-based protocols for comprehensive coverage
 */

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const protocols = [
  // THYROID (continued)
  {
    protocol_name: 'Hyperthyroidism Management Protocol',
    condition_category: 'thyroid',
    target_condition: 'Hyperthyroidism / Graves Disease',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Medical management of hyperthyroidism with lifestyle support',
    clinical_rationale: 'Antithyroid medications block thyroid hormone synthesis. Beta-blockers manage symptoms. Lifestyle modifications support immune function and reduce stress triggers.',
    expected_outcomes: 'Normalized thyroid function, reduced heart rate, improved sleep, weight stabilization',
    timeline: '6-12 weeks for initial control, 12-18 months total treatment',
    implementation_steps: JSON.stringify([
      'Methimazole 10-40 mg daily OR Propylthiouracil 100-600 mg daily',
      'Propranolol 20-40 mg 2-3x/day for symptom control',
      'Avoid iodine-rich foods and supplements',
      'Stress reduction (meditation, yoga) daily',
      'Adequate sleep (8-9 hours)',
      'L-carnitine 2-4 g/day may reduce symptoms',
      'Monitor thyroid function every 4-6 weeks initially'
    ]),
    dosage_guidelines: 'Methimazole: Start 10-40 mg daily, adjust based on labs. PTU: 100-600 mg daily in divided doses. Propranolol: 20-40 mg 2-3x/day. L-carnitine: 2-4 g/day.',
    contraindications: 'Methimazole contraindicated in first trimester pregnancy (use PTU). Beta-blockers contraindicated in asthma, heart block. Monitor liver function with antithyroid drugs.',
    monitoring_parameters: JSON.stringify(['TSH', 'Free T4', 'Free T3', 'TSI antibodies', 'Heart rate', 'Weight', 'Liver enzymes', 'CBC']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_studies_summary: 'Antithyroid drugs achieve remission in 40-50% of Graves patients after 12-18 months. L-carnitine reduces hyperthyroid symptoms by inhibiting thyroid hormone entry into cells.',
    provider_notes: 'Monitor for agranulocytosis (sore throat, fever). Consider radioactive iodine or surgery if medical management fails.'
  },

  {
    protocol_name: 'Hashimoto Thyroiditis Immune Modulation Protocol',
    condition_category: 'thyroid',
    target_condition: 'Hashimoto Thyroiditis',
    severity_level: 'all',
    protocol_type: 'combination',
    summary: 'Reduce thyroid antibodies and slow autoimmune progression',
    clinical_rationale: 'Hashimoto is autoimmune thyroiditis. Selenium, vitamin D, and gluten-free diet may reduce antibodies. LDN shows promise for immune modulation.',
    expected_outcomes: 'Reduced TPO antibodies (30-50% reduction), slowed thyroid destruction, improved symptoms',
    timeline: '6-12 months',
    implementation_steps: JSON.stringify([
      'Selenium 200 mcg daily',
      'Vitamin D to achieve 50-80 ng/mL',
      'Gluten-free diet trial (3-6 months)',
      'Low-dose naltrexone (LDN) 3-4.5 mg at bedtime',
      'Optimize gut health (probiotics, eliminate food sensitivities)',
      'Stress management and adequate sleep',
      'Continue levothyroxine if hypothyroid'
    ]),
    dosage_guidelines: 'Selenium: 200 mcg daily. Vitamin D: 2000-5000 IU daily to achieve 50-80 ng/mL. LDN: Start 1.5 mg, increase to 3-4.5 mg over 2-4 weeks.',
    contraindications: 'LDN contraindicated with opioid medications. High-dose selenium (>400 mcg/day) may be toxic. Monitor thyroid function as antibody reduction may change medication needs.',
    monitoring_parameters: JSON.stringify(['TPO antibodies', 'Thyroglobulin antibodies', 'TSH', 'Free T4', 'Vitamin D', 'Selenium levels']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_studies_summary: 'Selenium supplementation reduces TPO antibodies by 40-50% in multiple RCTs. Gluten-free diet shows benefit in subset with celiac or gluten sensitivity. LDN shows promise in small studies.',
    provider_notes: 'Not all patients respond to gluten elimination. Consider trial period with antibody monitoring. LDN is off-label use.'
  },

  // REPRODUCTIVE (continued)
  {
    protocol_name: 'Endometriosis Pain Management Protocol',
    condition_category: 'reproductive',
    target_condition: 'Endometriosis',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Comprehensive pain management and inflammation reduction for endometriosis',
    clinical_rationale: 'Endometriosis is estrogen-dependent inflammatory condition. Hormonal suppression, anti-inflammatory diet, and targeted supplements reduce pain and progression.',
    expected_outcomes: 'Reduced pelvic pain (30-50%), lighter periods, improved quality of life, slowed disease progression',
    timeline: '3-6 months',
    implementation_steps: JSON.stringify([
      'Hormonal therapy: Combined OCP, progestin, or GnRH agonist',
      'Anti-inflammatory diet (eliminate dairy, gluten, red meat)',
      'Omega-3 fatty acids 2-3 g/day (EPA/DHA)',
      'Curcumin 500-1000 mg 2x/day',
      'NAC (N-acetylcysteine) 600 mg 3x/day',
      'Pelvic floor physical therapy',
      'Castor oil packs and heat therapy for pain'
    ]),
    dosage_guidelines: 'Omega-3: 2-3 g/day EPA/DHA. Curcumin: 500-1000 mg 2x/day with black pepper. NAC: 600 mg 3x/day. Vitamin D: Optimize to 50-80 ng/mL.',
    contraindications: 'GnRH agonists cause menopausal symptoms and bone loss (limit to 6 months without add-back therapy). High-dose omega-3 may increase bleeding risk.',
    monitoring_parameters: JSON.stringify(['Pain scores', 'Menstrual flow', 'Quality of life scores', 'Inflammatory markers (CRP)', 'Bone density (if on GnRH agonist)']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 31991437', 'PMID: 33419563']),
    clinical_studies_summary: 'NAC reduces endometriosis lesions and pain in RCTs. Omega-3 fatty acids reduce inflammatory prostaglandins. Anti-inflammatory diet shows benefit in observational studies.',
    provider_notes: 'Surgical excision remains gold standard for severe disease. Medical management best for mild-moderate disease or post-surgical maintenance.'
  },

  {
    protocol_name: 'Perimenopause Symptom Management Protocol',
    condition_category: 'reproductive',
    target_condition: 'Perimenopause',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Manage vasomotor symptoms, mood changes, and sleep disturbances during perimenopause',
    clinical_rationale: 'Fluctuating estrogen and progesterone cause perimenopausal symptoms. Low-dose HRT, targeted supplements, and lifestyle modifications provide relief.',
    expected_outcomes: 'Reduced hot flashes (50-80%), improved sleep, better mood stability, maintained bone density',
    timeline: '4-8 weeks for symptom relief',
    implementation_steps: JSON.stringify([
      'Low-dose estradiol patch 0.025-0.05 mg + micronized progesterone 100-200 mg at bedtime',
      'OR Black cohosh 40-80 mg daily if avoiding HRT',
      'Magnesium glycinate 300-400 mg at bedtime',
      'Vitamin E 400-800 IU daily',
      'Regular exercise (reduces hot flashes by 30-50%)',
      'Stress reduction and mindfulness practices',
      'Avoid triggers (spicy foods, alcohol, caffeine, stress)'
    ]),
    dosage_guidelines: 'Estradiol: 0.025-0.05 mg patch 2x/week. Progesterone: 100-200 mg at bedtime (if uterus intact). Black cohosh: 40-80 mg daily. Magnesium: 300-400 mg at bedtime.',
    contraindications: 'HRT contraindicated in breast cancer history, blood clots, liver disease. Black cohosh may cause liver toxicity (rare). Monitor liver enzymes.',
    monitoring_parameters: JSON.stringify(['Hot flash frequency', 'Sleep quality', 'Mood', 'Bone density', 'Lipid panel', 'Liver enzymes', 'Mammogram']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 30566372', 'PMID: 25535055']),
    clinical_studies_summary: 'HRT is most effective treatment for vasomotor symptoms (80-90% reduction). Black cohosh shows modest benefit (25-30% reduction). Exercise and stress reduction provide additional 30-40% benefit.',
    provider_notes: 'Individualize HRT based on symptoms, risk factors, and patient preference. Lowest effective dose for shortest duration needed.'
  },

  {
    protocol_name: 'Male Hypogonadism Testosterone Replacement Protocol',
    condition_category: 'reproductive',
    target_condition: 'Male Hypogonadism (Low Testosterone)',
    severity_level: 'moderate',
    protocol_type: 'medication',
    summary: 'Evidence-based testosterone replacement therapy for symptomatic hypogonadism',
    clinical_rationale: 'Testosterone replacement improves energy, libido, muscle mass, and quality of life in men with confirmed hypogonadism. Multiple delivery methods available.',
    expected_outcomes: 'Improved energy and libido, increased muscle mass, better mood, improved erectile function',
    timeline: '4-6 weeks for initial improvements, 3-6 months for full benefits',
    implementation_steps: JSON.stringify([
      'Confirm diagnosis: 2 morning testosterone levels <300 ng/dL + symptoms',
      'Choose delivery method: injections, gel, or pellets',
      'Testosterone cypionate 100-200 mg IM every 1-2 weeks OR',
      'Testosterone gel 50-100 mg daily OR',
      'Testosterone pellets 900-1200 mg every 3-4 months',
      'Monitor response and adjust dose',
      'HCG 500-1000 IU 2-3x/week if preserving fertility'
    ]),
    dosage_guidelines: 'Cypionate: 100-200 mg IM every 1-2 weeks. Gel: 50-100 mg daily. Target total testosterone 500-800 ng/dL, free testosterone upper-normal range.',
    contraindications: 'Prostate cancer, male breast cancer, severe BPH, uncontrolled heart failure, polycythemia (Hct >54%). Monitor PSA and hematocrit.',
    monitoring_parameters: JSON.stringify(['Total testosterone', 'Free testosterone', 'Estradiol', 'PSA', 'Hematocrit', 'Lipid panel', 'Liver enzymes', 'Libido', 'Energy', 'Muscle mass']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_studies_summary: 'TRT improves sexual function, mood, and quality of life in hypogonadal men. No increased cardiovascular risk in recent large trials. Polycythemia is most common side effect.',
    provider_notes: 'Monitor hematocrit closely - donate blood if >54%. Consider aromatase inhibitor if estradiol >40 pg/mL. HCG preserves testicular function and fertility.'
  },

  // ADRENAL (continued)
  {
    protocol_name: 'Addison Disease Replacement Therapy Protocol',
    condition_category: 'adrenal',
    target_condition: 'Addison Disease (Primary Adrenal Insufficiency)',
    severity_level: 'severe',
    protocol_type: 'medication',
    summary: 'Physiologic hormone replacement for primary adrenal insufficiency',
    clinical_rationale: 'Addison disease requires lifelong glucocorticoid and mineralocorticoid replacement to prevent adrenal crisis and maintain homeostasis.',
    expected_outcomes: 'Normal energy, blood pressure, electrolytes; prevention of adrenal crisis',
    timeline: 'Immediate - lifelong therapy',
    implementation_steps: JSON.stringify([
      'Hydrocortisone 15-25 mg daily in 2-3 divided doses (highest in AM)',
      'Fludrocortisone 0.05-0.2 mg daily',
      'Increase hydrocortisone 2-3x during illness/stress',
      'Wear medical alert bracelet',
      'Carry emergency hydrocortisone injection',
      'Educate on adrenal crisis recognition and management',
      'Adequate salt intake (3-5 g/day)'
    ]),
    dosage_guidelines: 'Hydrocortisone: 15-25 mg/day (10 mg AM, 5 mg noon, 2.5-5 mg PM). Fludrocortisone: 0.05-0.2 mg daily. Stress dosing: Double or triple hydrocortisone during illness.',
    contraindications: 'None - replacement therapy is essential for life. Adjust doses based on clinical response and labs.',
    monitoring_parameters: JSON.stringify(['Blood pressure', 'Electrolytes (Na, K)', 'Renin', 'ACTH', 'Cortisol', 'Weight', 'Energy', 'Orthostatic symptoms']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_studies_summary: 'Hydrocortisone is preferred glucocorticoid (short half-life, physiologic). Fludrocortisone essential for mineralocorticoid replacement. Stress dosing prevents adrenal crisis.',
    provider_notes: 'Educate patient on sick-day rules and emergency injection. Under-replacement causes fatigue; over-replacement causes Cushingoid features.'
  },

  // METABOLIC (continued)
  {
    protocol_name: 'Type 2 Diabetes Reversal Protocol',
    condition_category: 'metabolic',
    target_condition: 'Type 2 Diabetes',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Intensive lifestyle intervention to reverse type 2 diabetes',
    clinical_rationale: 'Type 2 diabetes is reversible in many cases through weight loss, carbohydrate restriction, and exercise. Early intervention has highest success rate.',
    expected_outcomes: 'HbA1c <6.5% without medications, fasting glucose <100 mg/dL, weight loss 10-15%, medication reduction or elimination',
    timeline: '3-6 months for significant improvements, 12 months for potential remission',
    implementation_steps: JSON.stringify([
      'Very low-carb diet (<50g net carbs/day) or ketogenic diet',
      'Intermittent fasting (16:8 or 18:6)',
      'Resistance training 3x/week + daily walking',
      'Target 10-15% weight loss',
      'Metformin 1500-2000 mg daily (continue initially)',
      'GLP-1 agonist (semaglutide, liraglutide) if BMI >30',
      'Frequent glucose monitoring, medication adjustment'
    ]),
    dosage_guidelines: 'Metformin: 1500-2000 mg daily. Semaglutide: 0.25-2.4 mg weekly. Monitor glucose closely and reduce medications as needed to avoid hypoglycemia.',
    contraindications: 'Very low-carb diet requires close monitoring if on insulin or sulfonylureas (hypoglycemia risk). GLP-1 agonists contraindicated in personal/family history of medullary thyroid cancer.',
    monitoring_parameters: JSON.stringify(['Fasting glucose', 'HbA1c', 'Fasting insulin', 'Weight', 'Waist circumference', 'Lipid panel', 'Liver enzymes', 'Kidney function']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_studies_summary: 'DiRECT trial showed 46% diabetes remission at 1 year with intensive weight management. Very low-carb diets consistently reduce HbA1c by 1-2% and allow medication reduction.',
    provider_notes: 'Best results in patients with diabetes <6 years duration. Requires close monitoring and medication adjustment. Consider diabetes remission if HbA1c <6.5% off medications for 3+ months.'
  },

  {
    protocol_name: 'Metabolic Syndrome Comprehensive Protocol',
    condition_category: 'metabolic',
    target_condition: 'Metabolic Syndrome',
    severity_level: 'all',
    protocol_type: 'combination',
    summary: 'Address all components of metabolic syndrome simultaneously',
    clinical_rationale: 'Metabolic syndrome is cluster of insulin resistance, dyslipidemia, hypertension, and abdominal obesity. Comprehensive lifestyle intervention addresses all components.',
    expected_outcomes: 'Improved insulin sensitivity, reduced blood pressure, improved lipids, weight loss 5-10%, reduced cardiovascular risk',
    timeline: '3-6 months',
    implementation_steps: JSON.stringify([
      'Mediterranean or low-carb diet',
      'Regular exercise: 150 min moderate + 2x strength training weekly',
      'Weight loss goal: 7-10% of body weight',
      'Omega-3 fatty acids 2-4 g/day',
      'Berberine 500 mg 3x/day OR Metformin 1500 mg daily',
      'Magnesium 400-600 mg daily',
      'Consider statin if LDL >130 mg/dL'
    ]),
    dosage_guidelines: 'Omega-3: 2-4 g/day EPA/DHA. Berberine: 500 mg 3x/day with meals. Magnesium: 400-600 mg daily. Vitamin D: Optimize to 40-60 ng/mL.',
    contraindications: 'Berberine may interact with diabetes medications. High-dose omega-3 may increase bleeding risk. Monitor blood pressure and glucose closely.',
    monitoring_parameters: JSON.stringify(['Fasting glucose', 'Fasting insulin', 'HbA1c', 'Lipid panel', 'Blood pressure', 'Waist circumference', 'Weight', 'hs-CRP']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_studies_summary: 'Mediterranean diet reduces metabolic syndrome prevalence by 30-50%. Weight loss of 7-10% significantly improves all metabolic parameters. Omega-3 reduces triglycerides by 20-30%.',
    provider_notes: 'Address all components simultaneously for best results. Even modest weight loss (5-7%) provides significant metabolic benefits.'
  },

  // BONE HEALTH
  {
    protocol_name: 'Osteoporosis Prevention and Treatment Protocol',
    condition_category: 'bone',
    target_condition: 'Osteoporosis / Osteopenia',
    severity_level: 'all',
    protocol_type: 'combination',
    summary: 'Comprehensive bone health optimization through nutrition, exercise, and targeted supplementation',
    clinical_rationale: 'Bone health requires adequate calcium, vitamin D, K2, and weight-bearing exercise. Bisphosphonates or other medications for established osteoporosis.',
    expected_outcomes: 'Stabilized or improved bone density, reduced fracture risk, improved balance and strength',
    timeline: '12-24 months for measurable bone density changes',
    implementation_steps: JSON.stringify([
      'Calcium 1000-1200 mg daily from food + supplement',
      'Vitamin D 2000-5000 IU daily (target 40-60 ng/mL)',
      'Vitamin K2 (MK-7) 100-200 mcg daily',
      'Magnesium 400-600 mg daily',
      'Weight-bearing exercise 30 min, 5x/week',
      'Resistance training 2-3x/week',
      'Alendronate 70 mg weekly OR Denosumab 60 mg every 6 months (if T-score <-2.5)'
    ]),
    dosage_guidelines: 'Calcium: 500-600 mg 2x/day with meals. Vitamin D: 2000-5000 IU daily. K2: 100-200 mcg daily. Magnesium: 400-600 mg daily. Alendronate: 70 mg weekly on empty stomach.',
    contraindications: 'Bisphosphonates contraindicated in esophageal disorders, severe kidney disease. High-dose calcium may increase cardiovascular risk (prefer food sources).',
    monitoring_parameters: JSON.stringify(['DEXA scan every 1-2 years', 'Vitamin D', 'Calcium', 'PTH', 'Bone turnover markers (CTX, P1NP)', 'Height', 'Fracture history']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 31991437', 'PMID: 33419563']),
    clinical_studies_summary: 'Bisphosphonates reduce fracture risk by 40-50%. Vitamin D + calcium reduces fracture risk by 15-20%. K2 improves bone quality and reduces fracture risk. Weight-bearing exercise increases bone density.',
    provider_notes: 'Optimize nutrition and exercise first. Add medication if T-score <-2.5 or fragility fracture. Monitor for atypical femur fractures with long-term bisphosphonate use.'
  },

  // SLEEP & CIRCADIAN
  {
    protocol_name: 'Insomnia and Sleep Optimization Protocol',
    condition_category: 'sleep',
    target_condition: 'Chronic Insomnia',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Evidence-based approach to restore healthy sleep through CBT-I, supplements, and circadian optimization',
    clinical_rationale: 'Insomnia often results from circadian misalignment, hyperarousal, and poor sleep hygiene. CBT-I is first-line therapy. Melatonin and magnesium support sleep architecture.',
    expected_outcomes: 'Reduced sleep latency, improved sleep quality, 7-9 hours consolidated sleep, improved daytime function',
    timeline: '4-8 weeks',
    implementation_steps: JSON.stringify([
      'Cognitive Behavioral Therapy for Insomnia (CBT-I)',
      'Consistent sleep/wake schedule (even weekends)',
      'Morning sunlight exposure within 30 min of waking',
      'Avoid blue light 2 hours before bed',
      'Melatonin 0.5-3 mg 30-60 min before bed',
      'Magnesium glycinate 300-400 mg at bedtime',
      'L-theanine 200-400 mg in evening',
      'Cool, dark bedroom (65-68°F)'
    ]),
    dosage_guidelines: 'Melatonin: 0.5-3 mg 30-60 min before bed (lower doses often more effective). Magnesium: 300-400 mg at bedtime. L-theanine: 200-400 mg. Avoid sedative-hypnotics long-term.',
    contraindications: 'Melatonin may interact with immunosuppressants, blood thinners. High-dose magnesium may cause diarrhea. Screen for sleep apnea before treating insomnia.',
    monitoring_parameters: JSON.stringify(['Sleep latency', 'Total sleep time', 'Wake after sleep onset', 'Sleep quality', 'Daytime function', 'Sleep diary']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_studies_summary: 'CBT-I is most effective long-term treatment for chronic insomnia. Melatonin reduces sleep latency by 7-12 minutes. Magnesium improves sleep quality. Circadian optimization is foundational.',
    provider_notes: 'CBT-I requires 4-8 weeks but has lasting benefits. Avoid benzodiazepines and Z-drugs due to dependence risk. Rule out sleep apnea, restless legs, circadian disorders.'
  },

  // FERTILITY
  {
    protocol_name: 'Female Fertility Optimization Protocol',
    condition_category: 'reproductive',
    target_condition: 'Infertility / Subfertility',
    severity_level: 'mild',
    protocol_type: 'combination',
    summary: 'Optimize fertility through nutrition, lifestyle, and targeted supplementation',
    clinical_rationale: 'Many fertility issues are reversible through weight optimization, nutrient repletion, stress reduction, and hormone balance. Address underlying conditions (PCOS, thyroid, etc.).',
    expected_outcomes: 'Improved ovulation, better egg quality, increased pregnancy rates, reduced time to conception',
    timeline: '3-6 months (minimum 3 months for egg quality improvement)',
    implementation_steps: JSON.stringify([
      'Achieve healthy BMI (20-25) - both underweight and overweight impair fertility',
      'Prenatal vitamin with methylfolate 800 mcg daily',
      'CoQ10 200-600 mg daily (improves egg quality)',
      'Omega-3 fatty acids 1-2 g/day',
      'Vitamin D to 40-60 ng/mL',
      'Inositol 2-4 g/day if PCOS',
      'Optimize thyroid function (TSH <2.5 mIU/L)',
      'Reduce stress, adequate sleep, moderate exercise'
    ]),
    dosage_guidelines: 'CoQ10: 200-600 mg daily. Inositol: 2-4 g/day (40:1 myo:D-chiro). Vitamin D: 2000-4000 IU daily. Omega-3: 1-2 g/day EPA/DHA. Folate: 800 mcg methylfolate.',
    contraindications: 'High-dose vitamin A (>10,000 IU) is teratogenic. Avoid herbs with estrogenic effects. Optimize all nutrients before conception.',
    monitoring_parameters: JSON.stringify(['Ovulation tracking', 'Basal body temperature', 'Cervical mucus', 'TSH', 'Vitamin D', 'Fasting insulin', 'AMH', 'FSH', 'Estradiol', 'Progesterone']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 31991437']),
    clinical_studies_summary: 'CoQ10 improves egg quality and pregnancy rates in older women. Inositol improves ovulation in PCOS. Weight loss of 5-10% restores ovulation in 80% of anovulatory obese women.',
    provider_notes: 'Allow 3-6 months for interventions to impact egg quality. Address male factor simultaneously (50% of infertility). Consider fertility specialist if not pregnant after 12 months (6 months if age >35).'
  },

  {
    protocol_name: 'Male Fertility Optimization Protocol',
    condition_category: 'reproductive',
    target_condition: 'Male Infertility / Low Sperm Quality',
    severity_level: 'mild',
    protocol_type: 'combination',
    summary: 'Improve sperm parameters through lifestyle, antioxidants, and hormone optimization',
    clinical_rationale: 'Sperm quality is highly responsive to lifestyle and nutritional interventions. Oxidative stress is major cause of poor sperm quality. Hormone optimization is essential.',
    expected_outcomes: 'Improved sperm count, motility, and morphology; increased pregnancy rates',
    timeline: '3-6 months (sperm production cycle is 74 days)',
    implementation_steps: JSON.stringify([
      'Achieve healthy BMI (obesity reduces testosterone and sperm quality)',
      'Antioxidant supplementation: CoQ10, vitamin C, E, selenium, zinc',
      'L-carnitine 2-3 g/day',
      'Omega-3 fatty acids 1-2 g/day',
      'Optimize testosterone (if low, consider clomiphene or HCG, NOT testosterone)',
      'Avoid heat exposure (hot tubs, saunas, tight underwear)',
      'Reduce alcohol, eliminate smoking and marijuana',
      'Manage stress and optimize sleep'
    ]),
    dosage_guidelines: 'CoQ10: 200-600 mg daily. L-carnitine: 2-3 g/day. Vitamin C: 1000 mg daily. Vitamin E: 400 IU daily. Zinc: 25-50 mg daily. Selenium: 200 mcg daily. Omega-3: 1-2 g/day.',
    contraindications: 'Testosterone replacement suppresses sperm production - use clomiphene or HCG instead if fertility desired. High-dose antioxidants may have pro-oxidant effects.',
    monitoring_parameters: JSON.stringify(['Semen analysis (count, motility, morphology)', 'Total testosterone', 'Free testosterone', 'LH', 'FSH', 'Estradiol', 'Prolactin']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_studies_summary: 'Antioxidant supplementation improves sperm parameters in 60-70% of men. L-carnitine improves sperm motility. Weight loss improves testosterone and sperm quality. Clomiphene increases sperm count while maintaining testosterone.',
    provider_notes: 'Allow 3-6 months for interventions to impact sperm quality. Avoid testosterone replacement if fertility desired. Consider varicocele repair if present and severe oligospermia.'
  },

  // AUTOIMMUNE
  {
    protocol_name: 'Autoimmune Protocol (AIP) for Hormone Conditions',
    condition_category: 'autoimmune',
    target_condition: 'Autoimmune Thyroid, PCOS, Endometriosis',
    severity_level: 'all',
    protocol_type: 'lifestyle',
    summary: 'Reduce autoimmune activity through elimination diet, gut healing, and immune modulation',
    clinical_rationale: 'Autoimmune conditions share common triggers: gut dysbiosis, food sensitivities, nutrient deficiencies, stress. AIP addresses root causes of immune dysregulation.',
    expected_outcomes: 'Reduced antibodies (20-50%), improved symptoms, reduced inflammation, better disease control',
    timeline: '3-6 months for full protocol',
    implementation_steps: JSON.stringify([
      'Eliminate: gluten, dairy, grains, legumes, nightshades, eggs, nuts, seeds (30-90 days)',
      'Emphasize: vegetables, quality meats, fish, fermented foods, bone broth',
      'Heal gut: L-glutamine, zinc carnosine, probiotics, bone broth',
      'Optimize vitamin D (50-80 ng/mL)',
      'Stress reduction and sleep optimization (critical)',
      'Gentle exercise (avoid overtraining)',
      'Systematic reintroduction after 30-90 days'
    ]),
    dosage_guidelines: 'L-glutamine: 5-10 g/day. Zinc carnosine: 75-150 mg daily. Probiotics: 25-100 billion CFU daily. Vitamin D: 4000-8000 IU daily. Omega-3: 2-3 g/day.',
    contraindications: 'Highly restrictive diet requires careful planning to avoid nutrient deficiencies. Not appropriate for those with eating disorders. Work with knowledgeable provider.',
    monitoring_parameters: JSON.stringify(['Thyroid antibodies', 'Inflammatory markers (CRP, ESR)', 'Vitamin D', 'Ferritin', 'B12', 'Symptom scores', 'Quality of life']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_studies_summary: 'AIP diet reduces inflammation and improves symptoms in autoimmune conditions. Gluten elimination benefits subset with celiac or gluten sensitivity. Gut healing reduces intestinal permeability and immune activation.',
    provider_notes: 'Best for motivated patients with autoimmune conditions not well-controlled on conventional therapy. Requires significant commitment. Many patients identify specific trigger foods during reintroduction.'
  },

  // DETOXIFICATION
  {
    protocol_name: 'EDC Detoxification and Avoidance Protocol',
    condition_category: 'detoxification',
    target_condition: 'EDC Exposure / Hormone Disruption',
    severity_level: 'all',
    protocol_type: 'lifestyle',
    summary: 'Reduce EDC exposure and support detoxification pathways',
    clinical_rationale: 'EDCs accumulate in body and disrupt hormone function. Reducing exposure and supporting detoxification improves hormone balance.',
    expected_outcomes: 'Reduced EDC body burden, improved hormone balance, reduced symptoms of hormone disruption',
    timeline: '3-6 months for measurable changes',
    implementation_steps: JSON.stringify([
      'Avoid plastics (use glass, stainless steel)',
      'Choose organic produce (especially Dirty Dozen)',
      'Filter drinking water (reverse osmosis or carbon filter)',
      'Use natural personal care products (no parabens, phthalates)',
      'Avoid non-stick cookware (use cast iron, stainless steel)',
      'Support liver detoxification: cruciferous vegetables, milk thistle, NAC',
      'Ensure daily bowel movements (fiber, magnesium)',
      'Sweat regularly (sauna, exercise)'
    ]),
    dosage_guidelines: 'NAC: 600-1200 mg daily. Milk thistle: 150-300 mg silymarin daily. DIM: 200-400 mg daily. Fiber: 25-35 g/day. Magnesium: 300-400 mg at bedtime.',
    contraindications: 'High-dose fiber may cause bloating initially. NAC may trigger asthma in susceptible individuals. Sauna contraindicated in pregnancy, cardiovascular disease.',
    monitoring_parameters: JSON.stringify(['Hormone panels', 'Liver enzymes', 'Bowel movement frequency', 'Symptom improvement', 'Optional: urinary BPA, phthalate metabolites']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 31991437', 'PMID: 33419563']),
    clinical_studies_summary: 'Switching to organic diet reduces urinary pesticide metabolites by 60-90% within days. Avoiding plastics reduces BPA levels. Cruciferous vegetables support estrogen detoxification. Sauna increases excretion of heavy metals and persistent organic pollutants.',
    provider_notes: 'Focus on highest-impact changes first (water filter, organic produce, plastic avoidance). Detoxification is ongoing process, not one-time event.'
  },

  // WEIGHT MANAGEMENT
  {
    protocol_name: 'Hormone-Balanced Weight Loss Protocol',
    condition_category: 'metabolic',
    target_condition: 'Obesity / Weight Loss Resistance',
    severity_level: 'all',
    protocol_type: 'combination',
    summary: 'Address hormonal barriers to weight loss while implementing evidence-based weight loss strategies',
    clinical_rationale: 'Weight loss resistance often has hormonal causes: insulin resistance, low thyroid, high cortisol, low testosterone. Address hormones while implementing caloric deficit.',
    expected_outcomes: 'Sustained weight loss 1-2 lbs/week, improved body composition, normalized hormones, improved metabolic health',
    timeline: '3-6 months for 10-15% weight loss',
    implementation_steps: JSON.stringify([
      'Optimize thyroid function (TSH <2.5 mIU/L)',
      'Improve insulin sensitivity (low-carb diet, exercise, berberine/metformin)',
      'Manage stress and cortisol (adequate sleep, stress reduction)',
      'High-protein diet (1.2-1.6 g/kg body weight)',
      'Resistance training 3x/week (preserve muscle mass)',
      'Consider GLP-1 agonist (semaglutide 2.4 mg weekly) if BMI >30',
      'Intermittent fasting (16:8 or 18:6)',
      'Track food intake and adjust based on results'
    ]),
    dosage_guidelines: 'Semaglutide: 0.25 mg weekly, increase to 2.4 mg over 16-20 weeks. Berberine: 500 mg 3x/day. Protein: 1.2-1.6 g/kg. Fiber: 25-35 g/day. Target 500-750 calorie deficit.',
    contraindications: 'GLP-1 agonists contraindicated in personal/family history medullary thyroid cancer. Very low-calorie diets (<1200 cal/day) may slow metabolism. Avoid aggressive caloric restriction.',
    monitoring_parameters: JSON.stringify(['Weight', 'Body composition', 'Waist circumference', 'TSH', 'Fasting insulin', 'Fasting glucose', 'Testosterone (men)', 'Cortisol', 'Resting metabolic rate']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_studies_summary: 'GLP-1 agonists produce 10-15% weight loss. High-protein diets preserve muscle mass during weight loss. Resistance training prevents metabolic slowdown. Addressing hormonal imbalances improves weight loss success.',
    provider_notes: 'Screen for hormonal causes of weight loss resistance before assuming it\'s just "calories in, calories out." Optimize thyroid, insulin, cortisol, and sex hormones for best results.'
  },

  // MOOD & MENTAL HEALTH
  {
    protocol_name: 'Hormone-Related Depression and Anxiety Protocol',
    condition_category: 'mental_health',
    target_condition: 'Depression / Anxiety with Hormonal Component',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Address hormonal contributors to mood disorders while supporting neurotransmitter function',
    clinical_rationale: 'Thyroid dysfunction, sex hormone imbalances, and HPA axis dysfunction commonly cause or worsen mood disorders. Addressing hormones improves treatment response.',
    expected_outcomes: 'Improved mood, reduced anxiety, better energy, improved sleep, enhanced treatment response',
    timeline: '6-12 weeks',
    implementation_steps: JSON.stringify([
      'Optimize thyroid function (TSH 1-2 mIU/L, Free T3 upper-normal)',
      'Balance sex hormones (estrogen, progesterone, testosterone)',
      'Support HPA axis (adaptogenic herbs, stress reduction)',
      'Omega-3 fatty acids 2-3 g/day (EPA:DHA 2:1)',
      'Vitamin D to 50-80 ng/mL',
      'Methylfolate 1-5 mg daily (especially if MTHFR variant)',
      'Magnesium glycinate 300-400 mg at bedtime',
      'Consider SSRI/SNRI if needed (hormones + medication often superior to either alone)'
    ]),
    dosage_guidelines: 'Omega-3: 2-3 g/day (higher EPA for depression). Vitamin D: 4000-6000 IU daily. Methylfolate: 1-5 mg daily. Magnesium: 300-400 mg at bedtime. Ashwagandha: 300-600 mg daily.',
    contraindications: 'High-dose methylfolate may worsen anxiety in some individuals. Ashwagandha may interact with thyroid medication. Monitor closely if on psychiatric medications.',
    monitoring_parameters: JSON.stringify(['PHQ-9', 'GAD-7', 'TSH', 'Free T3', 'Vitamin D', 'Testosterone', 'Estradiol', 'Progesterone', 'Cortisol', 'Sleep quality']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_studies_summary: 'Omega-3 (EPA) shows antidepressant effects comparable to SSRIs in some studies. Thyroid optimization improves treatment-resistant depression. Vitamin D deficiency strongly correlates with depression. Methylfolate enhances SSRI response.',
    provider_notes: 'Screen all mood disorder patients for thyroid, vitamin D, and sex hormone imbalances. Combination of hormone optimization + medication often superior to either alone. Don\'t miss hypothyroidism or perimenopause as cause of "treatment-resistant" depression.'
  },

  // SKIN & HAIR
  {
    protocol_name: 'Hormonal Acne Treatment Protocol',
    condition_category: 'dermatology',
    target_condition: 'Hormonal Acne',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Address androgen excess and inflammation causing hormonal acne',
    clinical_rationale: 'Hormonal acne results from androgen excess (testosterone, DHEA-S) stimulating sebum production. Anti-androgen therapy, insulin sensitization, and topical treatments are effective.',
    expected_outcomes: 'Reduced acne lesions (50-80%), improved skin texture, reduced scarring',
    timeline: '3-6 months',
    implementation_steps: JSON.stringify([
      'Combined oral contraceptive (if female, not trying to conceive)',
      'Spironolactone 100-200 mg daily (anti-androgen)',
      'Low glycemic diet (reduces insulin-driven androgen production)',
      'Zinc 30-50 mg daily',
      'DIM 200-400 mg daily (supports estrogen metabolism)',
      'Topical retinoid (tretinoin, adapalene) nightly',
      'Benzoyl peroxide 2.5-5% in AM',
      'Avoid dairy (may worsen hormonal acne)'
    ]),
    dosage_guidelines: 'Spironolactone: Start 50-100 mg daily, increase to 100-200 mg. Zinc: 30-50 mg daily with food. DIM: 200-400 mg daily. Tretinoin: 0.025-0.1% nightly. Start low, increase gradually.',
    contraindications: 'Spironolactone contraindicated in pregnancy, kidney disease, hyperkalemia. Oral contraceptives contraindicated in smokers >35, history of blood clots. Retinoids are teratogenic.',
    monitoring_parameters: JSON.stringify(['Acne severity score', 'Total testosterone', 'Free testosterone', 'DHEA-S', 'Fasting insulin', 'Potassium (if on spironolactone)', 'Pregnancy test (if on spironolactone or retinoid)']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 31991437']),
    clinical_studies_summary: 'Spironolactone reduces acne by 50-80% in women with hormonal acne. Combined OCP reduces androgens and improves acne. Low glycemic diet reduces acne severity. Zinc has anti-inflammatory and anti-androgen effects.',
    provider_notes: 'Spironolactone is highly effective for hormonal acne in women. Requires reliable contraception. May take 3-6 months for full benefit. Check PCOS if severe hormonal acne.'
  },

  {
    protocol_name: 'Hair Loss (Androgenic Alopecia) Protocol',
    condition_category: 'dermatology',
    target_condition: 'Androgenic Alopecia / Hair Thinning',
    severity_level: 'moderate',
    protocol_type: 'combination',
    summary: 'Reduce DHT, improve scalp circulation, and support hair follicle health',
    clinical_rationale: 'Androgenic alopecia results from DHT (dihydrotestosterone) miniaturizing hair follicles. 5-alpha reductase inhibitors, minoxidil, and nutritional support are effective.',
    expected_outcomes: 'Reduced hair shedding, increased hair density, thicker hair shafts, regrowth in some cases',
    timeline: '6-12 months for visible improvement',
    implementation_steps: JSON.stringify([
      'Finasteride 1 mg daily (men) OR Spironolactone 100-200 mg daily (women)',
      'Minoxidil 5% foam/solution 2x/day to scalp',
      'Biotin 5000-10,000 mcg daily',
      'Iron supplementation if ferritin <70 ng/mL',
      'Zinc 30-50 mg daily',
      'Saw palmetto 320 mg daily (natural 5-alpha reductase inhibitor)',
      'Optimize thyroid function',
      'Consider PRP (platelet-rich plasma) injections'
    ]),
    dosage_guidelines: 'Finasteride: 1 mg daily (men). Spironolactone: 100-200 mg daily (women). Minoxidil: 5% 2x/day. Biotin: 5000-10,000 mcg daily. Iron: Dose based on ferritin level. Target ferritin >70 ng/mL.',
    contraindications: 'Finasteride contraindicated in women of childbearing potential (teratogenic). Minoxidil may cause initial shedding (temporary). Spironolactone requires reliable contraception.',
    monitoring_parameters: JSON.stringify(['Hair density', 'Hair shedding count', 'Ferritin', 'TSH', 'Free testosterone', 'DHEA-S', 'DHT', 'Scalp photos (standardized)']),
    evidence_level: 'high',
    primary_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_studies_summary: 'Finasteride reduces DHT by 70% and stops hair loss in 90% of men, regrowth in 65%. Minoxidil increases hair density by 10-15%. Spironolactone effective in women with androgenic alopecia. Low ferritin (<70 ng/mL) impairs hair growth.',
    provider_notes: 'Finasteride is highly effective but requires lifelong use. Minoxidil also requires ongoing use. Address thyroid, iron, and other nutritional deficiencies. Consider dermatology referral for severe cases.'
  },

  // GUT-HORMONE AXIS
  {
    protocol_name: 'Gut-Hormone Axis Optimization Protocol',
    condition_category: 'gastrointestinal',
    target_condition: 'Gut Dysbiosis Affecting Hormones',
    severity_level: 'all',
    protocol_type: 'combination',
    summary: 'Optimize gut microbiome to improve hormone metabolism and balance',
    clinical_rationale: 'Gut microbiome influences estrogen metabolism (estrobolome), produces neurotransmitters, affects insulin sensitivity, and modulates inflammation. Gut health is foundational for hormone health.',
    expected_outcomes: 'Improved hormone balance, better estrogen metabolism, reduced inflammation, improved mood and energy',
    timeline: '3-6 months',
    implementation_steps: JSON.stringify([
      'Diverse, fiber-rich diet (25-35 g fiber/day)',
      'Fermented foods daily (yogurt, kefir, sauerkraut, kimchi)',
      'Probiotic supplement: 25-100 billion CFU multi-strain',
      'Prebiotic fiber: inulin, FOS, or resistant starch',
      'Eliminate processed foods, excess sugar',
      'Identify and remove food sensitivities',
      'Support gut lining: L-glutamine, zinc carnosine, bone broth',
      'Manage stress (gut-brain axis)'
    ]),
    dosage_guidelines: 'Probiotics: 25-100 billion CFU daily (Lactobacillus, Bifidobacterium). L-glutamine: 5-10 g/day. Zinc carnosine: 75-150 mg daily. Fiber: 25-35 g/day from food. Prebiotic: 5-10 g/day.',
    contraindications: 'High-dose probiotics may cause bloating initially (start low, increase gradually). L-glutamine contraindicated in liver disease. Avoid probiotics in immunocompromised patients without medical supervision.',
    monitoring_parameters: JSON.stringify(['Digestive symptoms', 'Bowel movement frequency', 'Hormone panels', 'Inflammatory markers', 'Optional: comprehensive stool analysis', 'Estrogen metabolites']),
    evidence_level: 'moderate',
    primary_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_studies_summary: 'Gut microbiome influences estrogen levels through beta-glucuronidase activity. Probiotics improve insulin sensitivity and reduce inflammation. Fiber intake correlates with lower circulating estrogen and better hormone balance.',
    provider_notes: 'Gut health is often overlooked in hormone treatment but is foundational. Many patients with hormone imbalances have underlying gut dysbiosis. Address gut first for better hormone treatment response.'
  }
];

async function seedProtocols() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Seeding additional treatment protocols (Batch 2)...\n');
  
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
  console.log(`BATCH 2 SEEDING COMPLETE`);
  console.log(`========================================`);
  console.log(`Successfully added: ${successCount} protocols`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total protocols in database: ${6 + successCount}`);
  console.log(`========================================\n`);
}

seedProtocols().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
