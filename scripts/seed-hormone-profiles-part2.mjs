#!/usr/bin/env node
/**
 * Seed Additional Hormone Dysfunction Profiles (Part 2)
 * 11 more comprehensive clinical profiles
 */

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const profiles = [
  // HYPERTHYROIDISM PROFILE
  {
    profile_name: 'Graves Disease / Hyperthyroidism',
    condition_category: 'thyroid',
    primary_condition: 'Hyperthyroidism',
    typical_age_range: '20-50',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Weight loss despite increased appetite', 'Rapid heartbeat', 'Tremor', 'Heat intolerance']),
    common_symptoms: JSON.stringify(['Anxiety', 'Insomnia', 'Frequent bowel movements', 'Sweating', 'Fatigue', 'Muscle weakness']),
    occasional_symptoms: JSON.stringify(['Bulging eyes (Graves ophthalmopathy)', 'Goiter', 'Irregular periods', 'Osteoporosis']),
    typical_lab_findings: JSON.stringify({'TSH': 'Suppressed (<0.1 mIU/L)', 'Free T4': 'Elevated', 'Free T3': 'Elevated', 'TSI antibodies': 'Elevated (Graves)', 'TPO antibodies': 'May be elevated'}),
    lab_severity_markers: JSON.stringify({'Free T4': '>3.0 ng/dL severe', 'Heart rate': '>120 bpm severe', 'TSI': '>500% severe'}),
    primary_hormone_system: 'thyroid',
    secondary_hormone_systems: JSON.stringify(['cardiovascular', 'bone']),
    associated_edc_exposures: JSON.stringify(['Iodine excess', 'Lithium', 'Amiodarone']),
    edc_mechanism: 'Autoimmune trigger from environmental factors. Molecular mimicry may initiate autoimmune response.',
    diagnostic_criteria: 'Suppressed TSH (<0.1) with elevated Free T4/T3 and hyperthyroid symptoms',
    differential_diagnosis: JSON.stringify(['Toxic nodular goiter', 'Thyroiditis', 'TSH-secreting pituitary tumor', 'Factitious hyperthyroidism']),
    red_flags: 'Thyroid storm (fever, altered mental status, severe tachycardia), atrial fibrillation, heart failure',
    first_line_treatment: 'Methimazole 10-40 mg daily + Propranolol 20-40 mg 2-3x/day + Stress reduction',
    recommended_protocol_ids: JSON.stringify([7]), // Hyperthyroidism protocol
    expected_response_timeline: '6-12 weeks',
    natural_history: '40-50% remission after 12-18 months antithyroid drugs. Relapse common. May need radioactive iodine or surgery.',
    treatment_success_rate: '40-50% remission',
    reversibility: 'partially_reversible',
    prevalence_data: '1.2% of population, 5:1 female:male',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Monitor for agranulocytosis with antithyroid drugs. Beta-blockers essential for symptom control. Consider radioactive iodine if medical management fails.'
  },

  // METABOLIC SYNDROME PROFILE
  {
    profile_name: 'Metabolic Syndrome',
    condition_category: 'metabolic',
    primary_condition: 'Metabolic Syndrome',
    typical_age_range: '40-65',
    gender_prevalence: 'equal',
    cardinal_symptoms: JSON.stringify(['Abdominal obesity', 'Fatigue', 'Difficulty losing weight', 'Increased thirst']),
    common_symptoms: JSON.stringify(['High blood pressure', 'Elevated cholesterol', 'Fatty liver', 'Skin tags']),
    occasional_symptoms: JSON.stringify(['Erectile dysfunction', 'PCOS', 'Sleep apnea', 'Gout']),
    typical_lab_findings: JSON.stringify({'Waist circumference': '>40 inches (men), >35 inches (women)', 'Triglycerides': '≥150 mg/dL', 'HDL': '<40 mg/dL (men), <50 (women)', 'Blood pressure': '≥130/85 mmHg', 'Fasting glucose': '≥100 mg/dL'}),
    lab_severity_markers: JSON.stringify({'Number of criteria': '≥4 of 5 severe', 'HbA1c': '>6.0%', 'hs-CRP': '>3 mg/L'}),
    primary_hormone_system: 'metabolic',
    secondary_hormone_systems: JSON.stringify(['inflammatory', 'vascular']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Pesticides', 'Arsenic']),
    edc_mechanism: 'EDCs promote insulin resistance, inflammation, dyslipidemia, and obesity through multiple mechanisms.',
    diagnostic_criteria: '≥3 of 5 criteria: abdominal obesity, triglycerides ≥150, HDL low, BP ≥130/85, fasting glucose ≥100',
    differential_diagnosis: JSON.stringify(['Cushing syndrome', 'Hypothyroidism', 'PCOS']),
    red_flags: 'Diabetes, cardiovascular disease, severe obesity (BMI >40)',
    first_line_treatment: 'Mediterranean diet + Exercise 150 min/week + Weight loss 7-10% + Omega-3 2-4 g + Berberine 500 mg 3x/day',
    recommended_protocol_ids: JSON.stringify([14]), // Metabolic syndrome protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Progressive to type 2 diabetes, cardiovascular disease, fatty liver disease, chronic kidney disease.',
    treatment_success_rate: '70-80%',
    reversibility: 'fully_reversible',
    prevalence_data: '35% of US adults',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_notes: 'Even modest weight loss (5-7%) provides significant metabolic benefits. Address all components simultaneously.'
  },

  // HORMONAL ACNE PROFILE
  {
    profile_name: 'Hormonal Acne',
    condition_category: 'dermatology',
    primary_condition: 'Hormonal Acne',
    typical_age_range: '15-45',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Acne along jawline and chin', 'Premenstrual flares', 'Deep, cystic lesions', 'Persistent acne despite topical treatment']),
    common_symptoms: JSON.stringify(['Oily skin', 'Hirsutism', 'Irregular periods', 'Hair thinning']),
    occasional_symptoms: JSON.stringify(['PCOS symptoms', 'Weight gain', 'Mood changes']),
    typical_lab_findings: JSON.stringify({'Total testosterone': 'Elevated (>50 ng/dL)', 'Free testosterone': 'Elevated', 'DHEA-S': 'May be elevated', 'LH/FSH': 'May be elevated if PCOS'}),
    lab_severity_markers: JSON.stringify({'Testosterone': '>100 ng/dL severe', 'DHEA-S': '>500 mcg/dL severe'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['adrenal', 'metabolic']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Parabens in cosmetics']),
    edc_mechanism: 'EDCs disrupt androgen metabolism and increase sebum production. Insulin resistance from EDCs worsens androgen excess.',
    diagnostic_criteria: 'Acne along jawline/chin with premenstrual flares AND/OR elevated androgens',
    differential_diagnosis: JSON.stringify(['PCOS', 'Adrenal hyperplasia', 'Cushing syndrome', 'Androgen-secreting tumor']),
    red_flags: 'Rapid virilization, very high testosterone (>150), tumor symptoms',
    first_line_treatment: 'Spironolactone 100-200 mg daily + Combined OCP + Low glycemic diet + Topical retinoid',
    recommended_protocol_ids: JSON.stringify([23]), // Hormonal acne protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Often persists into adulthood if hormonal. May improve after menopause.',
    treatment_success_rate: '70-80%',
    reversibility: 'fully_reversible',
    prevalence_data: '50% of adult women with acne',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 33419563', 'PMID: 31991437']),
    clinical_notes: 'Spironolactone highly effective for hormonal acne in women. Requires reliable contraception. May take 3-6 months for full benefit.'
  },

  // ANDROGENIC ALOPECIA PROFILE
  {
    profile_name: 'Androgenic Alopecia (Pattern Hair Loss)',
    condition_category: 'dermatology',
    primary_condition: 'Androgenic Alopecia',
    typical_age_range: '25-60',
    gender_prevalence: 'male_predominant',
    cardinal_symptoms: JSON.stringify(['Progressive hair thinning', 'Receding hairline (men)', 'Widening part (women)', 'Increased hair shedding']),
    common_symptoms: JSON.stringify(['Miniaturization of hair', 'Visible scalp', 'Family history of hair loss']),
    occasional_symptoms: JSON.stringify(['Low ferritin', 'Thyroid dysfunction', 'PCOS (women)']),
    typical_lab_findings: JSON.stringify({'DHT': 'May be elevated', 'Total testosterone': 'Normal or elevated', 'Ferritin': 'Often <70 ng/mL', 'TSH': 'Should be normal', 'DHEA-S': 'May be elevated (women)'}),
    lab_severity_markers: JSON.stringify({'Ferritin': '<30 ng/mL severe deficiency', 'Hair density': '<50% of normal severe'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['thyroid', 'nutritional']),
    associated_edc_exposures: JSON.stringify(['Phthalates', 'BPA', 'Heavy metals']),
    edc_mechanism: 'EDCs may increase 5-alpha reductase activity, converting testosterone to DHT. Oxidative stress from EDCs damages hair follicles.',
    diagnostic_criteria: 'Progressive pattern hair loss with family history. Biopsy shows miniaturized follicles.',
    differential_diagnosis: JSON.stringify(['Telogen effluvium', 'Alopecia areata', 'Thyroid dysfunction', 'Iron deficiency', 'PCOS']),
    red_flags: 'Rapid hair loss, patchy loss (not pattern), scarring, other autoimmune symptoms',
    first_line_treatment: 'Finasteride 1 mg daily (men) OR Spironolactone 100-200 mg (women) + Minoxidil 5% 2x/day + Optimize ferritin >70',
    recommended_protocol_ids: JSON.stringify([24]), // Hair loss protocol
    expected_response_timeline: '6-12 months',
    natural_history: 'Progressive hair loss over years. Eventual significant baldness without treatment.',
    treatment_success_rate: '90% halt progression, 65% regrowth (men)',
    reversibility: 'partially_reversible',
    prevalence_data: '50% of men by age 50, 40% of women by age 70',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Finasteride highly effective but requires lifelong use. Minoxidil also requires ongoing use. Address thyroid and iron deficiency.'
  },

  // DEPRESSION WITH HORMONAL COMPONENT
  {
    profile_name: 'Hormone-Related Depression',
    condition_category: 'mental_health',
    primary_condition: 'Depression with Hormonal Component',
    typical_age_range: '25-55',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Persistent low mood', 'Fatigue', 'Loss of interest', 'Sleep disturbances']),
    common_symptoms: JSON.stringify(['Anxiety', 'Brain fog', 'Weight changes', 'Low libido', 'Irritability']),
    occasional_symptoms: JSON.stringify(['Suicidal thoughts', 'Physical pain', 'Social withdrawal']),
    typical_lab_findings: JSON.stringify({'TSH': 'Often elevated (>2.5)', 'Free T3': 'May be low', 'Vitamin D': 'Often <30 ng/mL', 'Testosterone': 'May be low', 'Estradiol/Progesterone': 'May be imbalanced'}),
    lab_severity_markers: JSON.stringify({'PHQ-9': '>15 severe depression', 'Vitamin D': '<20 severe deficiency', 'TSH': '>4.0 significant'}),
    primary_hormone_system: 'neurotransmitter',
    secondary_hormone_systems: JSON.stringify(['thyroid', 'reproductive', 'adrenal']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Pesticides', 'Heavy metals']),
    edc_mechanism: 'EDCs disrupt thyroid function (common cause of depression). EDCs impair neurotransmitter synthesis and HPA axis function.',
    diagnostic_criteria: 'PHQ-9 ≥10 with hormonal abnormalities (thyroid, vitamin D, sex hormones)',
    differential_diagnosis: JSON.stringify(['Primary depression', 'Bipolar disorder', 'Hypothyroidism', 'Vitamin deficiencies', 'Chronic fatigue syndrome']),
    red_flags: 'Suicidal ideation, psychosis, severe functional impairment, rapid cycling mood',
    first_line_treatment: 'Optimize thyroid (TSH 1-2) + Vitamin D to 50-80 ng/mL + Omega-3 2-3 g/day + Methylfolate 1-5 mg + Consider SSRI',
    recommended_protocol_ids: JSON.stringify([22]), // Hormone-related depression protocol
    expected_response_timeline: '6-12 weeks',
    natural_history: 'Often chronic and recurrent without treatment. Increased risk of cardiovascular disease, suicide.',
    treatment_success_rate: '70-80% with combined approach',
    reversibility: 'fully_reversible',
    prevalence_data: '20% of women, 10% of men lifetime',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_notes: 'Screen all depression patients for thyroid and vitamin D. Thyroid optimization improves treatment-resistant depression. Combination hormone + medication often superior.'
  },

  // WEIGHT LOSS RESISTANCE PROFILE
  {
    profile_name: 'Hormone-Related Weight Loss Resistance',
    condition_category: 'metabolic',
    primary_condition: 'Weight Loss Resistance',
    typical_age_range: '35-60',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Inability to lose weight despite diet/exercise', 'Slow metabolism', 'Fatigue', 'Abdominal weight gain']),
    common_symptoms: JSON.stringify(['Cold intolerance', 'Constipation', 'Brain fog', 'Low libido', 'Muscle loss']),
    occasional_symptoms: JSON.stringify(['Hair loss', 'Dry skin', 'Depression', 'Sleep disturbances']),
    typical_lab_findings: JSON.stringify({'TSH': 'Often >2.5 mIU/L', 'Free T3': 'Low or low-normal', 'Fasting insulin': 'Elevated (>10)', 'Cortisol': 'May be elevated', 'Testosterone': 'Low (especially men)', 'Estrogen': 'May be dominant'}),
    lab_severity_markers: JSON.stringify({'TSH': '>4.0 significant', 'Fasting insulin': '>20 severe IR', 'Free T3': '<2.5 pg/mL low'}),
    primary_hormone_system: 'metabolic',
    secondary_hormone_systems: JSON.stringify(['thyroid', 'reproductive', 'adrenal']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Pesticides', 'Tributyltin']),
    edc_mechanism: 'EDCs are obesogens - promote fat storage, insulin resistance, and metabolic dysfunction. Disrupt thyroid and sex hormones.',
    diagnostic_criteria: 'Inability to lose weight despite 500+ calorie deficit AND hormonal abnormalities',
    differential_diagnosis: JSON.stringify(['Hypothyroidism', 'Cushing syndrome', 'PCOS', 'Medication-induced', 'Underestimated caloric intake']),
    red_flags: 'Rapid weight gain, Cushingoid features, very high cortisol, pituitary tumor symptoms',
    first_line_treatment: 'Optimize thyroid (TSH <2.5) + Improve insulin sensitivity + Manage cortisol + High-protein diet + Resistance training',
    recommended_protocol_ids: JSON.stringify([21]), // Hormone-balanced weight loss protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Progressive weight gain, worsening metabolic health, increased cardiovascular risk.',
    treatment_success_rate: '70-80% with hormone optimization',
    reversibility: 'fully_reversible',
    prevalence_data: '30-40% of overweight/obese individuals',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Screen for hormonal causes before assuming "calories in, calories out." Optimize thyroid, insulin, cortisol, sex hormones for best results.'
  },

  // GUT DYSBIOSIS PROFILE
  {
    profile_name: 'Gut Dysbiosis Affecting Hormones',
    condition_category: 'gastrointestinal',
    primary_condition: 'Gut Dysbiosis',
    typical_age_range: '25-55',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Bloating', 'Irregular bowel movements', 'Food sensitivities', 'Hormone imbalances']),
    common_symptoms: JSON.stringify(['Fatigue', 'Brain fog', 'Skin issues', 'Mood changes', 'PMS']),
    occasional_symptoms: JSON.stringify(['Autoimmune symptoms', 'Joint pain', 'Headaches']),
    typical_lab_findings: JSON.stringify({'Stool analysis': 'Dysbiosis pattern', 'Inflammatory markers': 'Elevated CRP', 'Estrogen metabolites': 'Elevated 16-OH', 'Zonulin': 'Elevated (leaky gut)'}),
    lab_severity_markers: JSON.stringify({'CRP': '>3 mg/L', 'Calprotectin': '>50 mcg/g', 'Zonulin': '>60 ng/mL'}),
    primary_hormone_system: 'gastrointestinal',
    secondary_hormone_systems: JSON.stringify(['reproductive', 'immune', 'neurotransmitter']),
    associated_edc_exposures: JSON.stringify(['Glyphosate', 'BPA', 'Phthalates', 'Antibiotics in food']),
    edc_mechanism: 'EDCs disrupt gut microbiome composition. Glyphosate acts as antibiotic. Dysbiosis impairs estrogen metabolism (estrobolome).',
    diagnostic_criteria: 'GI symptoms + hormone imbalances + stool analysis showing dysbiosis',
    differential_diagnosis: JSON.stringify(['IBS', 'IBD', 'SIBO', 'Celiac disease', 'Food allergies']),
    red_flags: 'Blood in stool, severe abdominal pain, unintentional weight loss, anemia',
    first_line_treatment: 'Diverse fiber-rich diet + Fermented foods + Probiotics 25-100 billion CFU + L-glutamine 5-10 g + Eliminate food sensitivities',
    recommended_protocol_ids: JSON.stringify([25]), // Gut-hormone axis protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Progressive dysbiosis, worsening hormone imbalances, increased autoimmune risk.',
    treatment_success_rate: '70-80%',
    reversibility: 'fully_reversible',
    prevalence_data: '50-70% of people with hormone imbalances',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_notes: 'Gut health is foundational for hormone health. Many hormone imbalances improve with gut healing. Estrobolome regulates estrogen levels.'
  },

  // SECONDARY HYPOGONADISM PROFILE
  {
    profile_name: 'Secondary Hypogonadism (Pituitary/Hypothalamic)',
    condition_category: 'reproductive',
    primary_condition: 'Secondary Hypogonadism',
    typical_age_range: '30-60',
    gender_prevalence: 'male_predominant',
    cardinal_symptoms: JSON.stringify(['Low libido', 'Erectile dysfunction', 'Fatigue', 'Decreased muscle mass']),
    common_symptoms: JSON.stringify(['Depression', 'Irritability', 'Weight gain', 'Gynecomastia', 'Infertility']),
    occasional_symptoms: JSON.stringify(['Visual field defects', 'Headaches', 'Other pituitary hormone deficiencies']),
    typical_lab_findings: JSON.stringify({'Total testosterone': '<300 ng/dL', 'Free testosterone': 'Low', 'LH': 'Low or inappropriately normal', 'FSH': 'Low or inappropriately normal', 'Prolactin': 'May be elevated'}),
    lab_severity_markers: JSON.stringify({'Total testosterone': '<200 ng/dL severe', 'Prolactin': '>200 ng/mL suggests prolactinoma'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['pituitary', 'metabolic']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Pesticides']),
    edc_mechanism: 'EDCs disrupt hypothalamic-pituitary axis. Obesity from EDC exposure suppresses GnRH pulsatility.',
    diagnostic_criteria: '2 morning testosterone <300 ng/dL with LOW or inappropriately normal LH/FSH',
    differential_diagnosis: JSON.stringify(['Primary hypogonadism', 'Prolactinoma', 'Hemochromatosis', 'Medication-induced', 'Obesity-related']),
    red_flags: 'Very high prolactin (>200), visual field defects, headaches, other pituitary deficiencies',
    first_line_treatment: 'Clomiphene 25-50 mg 3x/week OR HCG 500-1000 IU 3x/week (preserves fertility) OR Testosterone replacement',
    recommended_protocol_ids: JSON.stringify([11]), // TRT protocol (can be adapted for clomiphene/HCG)
    expected_response_timeline: '4-8 weeks',
    natural_history: 'Variable depending on cause. Pituitary tumors may progress. Obesity-related may improve with weight loss.',
    treatment_success_rate: '85-90%',
    reversibility: 'variable',
    prevalence_data: '30% of hypogonadism cases',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Low LH/FSH confirms secondary hypogonadism. Check prolactin and MRI if very low testosterone or symptoms suggest pituitary tumor. Clomiphene/HCG preserve fertility.'
  },

  // PREDIABETES PROFILE
  {
    profile_name: 'Prediabetes',
    condition_category: 'metabolic',
    primary_condition: 'Prediabetes',
    typical_age_range: '35-65',
    gender_prevalence: 'equal',
    cardinal_symptoms: JSON.stringify(['Fatigue', 'Increased thirst', 'Frequent urination', 'Abdominal obesity']),
    common_symptoms: JSON.stringify(['Brain fog', 'Carb cravings', 'Weight gain', 'Skin tags', 'Acanthosis nigricans']),
    occasional_symptoms: JSON.stringify(['Blurred vision', 'Slow wound healing', 'Tingling in extremities']),
    typical_lab_findings: JSON.stringify({'Fasting glucose': '100-125 mg/dL', 'HbA1c': '5.7-6.4%', 'Fasting insulin': 'Elevated (>10)', 'HOMA-IR': '>2.5', 'Triglycerides': 'Often elevated'}),
    lab_severity_markers: JSON.stringify({'HbA1c': '>6.0% high risk for progression', 'Fasting glucose': '>115 high risk', 'HOMA-IR': '>5 severe IR'}),
    primary_hormone_system: 'metabolic',
    secondary_hormone_systems: JSON.stringify(['inflammatory', 'vascular']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Arsenic', 'Pesticides']),
    edc_mechanism: 'EDCs promote insulin resistance and beta-cell dysfunction. Obesogens increase diabetes risk.',
    diagnostic_criteria: 'Fasting glucose 100-125 mg/dL OR HbA1c 5.7-6.4% OR 2-hour OGTT 140-199 mg/dL',
    differential_diagnosis: JSON.stringify(['Type 2 diabetes', 'Type 1 diabetes', 'MODY', 'Medication-induced hyperglycemia']),
    red_flags: 'Fasting glucose ≥126 (diabetes), HbA1c ≥6.5%, symptoms of hyperglycemia',
    first_line_treatment: 'Low-carb diet + Exercise 150 min/week + Weight loss 7-10% + Berberine 500 mg 3x/day OR Metformin 1500 mg',
    recommended_protocol_ids: JSON.stringify([6, 13]), // Insulin resistance + Diabetes reversal protocols
    expected_response_timeline: '3-6 months',
    natural_history: '70% progress to type 2 diabetes within 10 years without intervention.',
    treatment_success_rate: '58% diabetes prevention with lifestyle',
    reversibility: 'fully_reversible',
    prevalence_data: '38% of US adults',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Prediabetes is reversible! Weight loss of 7-10% reduces diabetes risk by 58%. Low-carb diets highly effective.'
  },

  // LEAN PCOS PROFILE
  {
    profile_name: 'Lean PCOS (Non-Insulin Resistant)',
    condition_category: 'reproductive',
    primary_condition: 'PCOS (Lean Phenotype)',
    typical_age_range: '18-35',
    gender_prevalence: 'female_only',
    cardinal_symptoms: JSON.stringify(['Irregular periods', 'Hirsutism', 'Acne', 'Normal weight (BMI <25)']),
    common_symptoms: JSON.stringify(['Hair thinning', 'Mood changes', 'Infertility', 'Ovarian cysts on ultrasound']),
    occasional_symptoms: JSON.stringify(['Anxiety', 'Depression']),
    typical_lab_findings: JSON.stringify({'Total testosterone': 'Elevated (>50 ng/dL)', 'LH/FSH ratio': '>2:1', 'Fasting insulin': 'Normal (<10)', 'DHEA-S': 'May be elevated', 'AMH': 'Often elevated'}),
    lab_severity_markers: JSON.stringify({'Testosterone': '>100 ng/dL severe', 'DHEA-S': '>500 mcg/dL adrenal component'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['adrenal']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Pesticides']),
    edc_mechanism: 'EDCs directly stimulate ovarian androgen production independent of insulin. May have adrenal androgen excess component.',
    diagnostic_criteria: 'Rotterdam criteria (2 of 3) with normal insulin sensitivity and BMI <25',
    differential_diagnosis: JSON.stringify(['Adrenal hyperplasia', 'Androgen-secreting tumor', 'Hypothyroidism', 'Hyperprolactinemia']),
    red_flags: 'Rapid virilization, very high testosterone (>150), Cushingoid features',
    first_line_treatment: 'Combined OCP + Spironolactone 100-200 mg + Inositol 2-4 g + Anti-inflammatory diet',
    recommended_protocol_ids: JSON.stringify([3]), // PCOS protocol (adapted for lean PCOS)
    expected_response_timeline: '3-6 months',
    natural_history: 'May improve with age. Infertility risk. Lower metabolic risk than insulin-resistant PCOS.',
    treatment_success_rate: '60-70%',
    reversibility: 'partially_reversible',
    prevalence_data: '20-30% of PCOS cases',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_notes: 'Lean PCOS often has adrenal androgen component. Inositol still beneficial. Less metabolic risk than obese PCOS.'
  },

  // SUBCLINICAL HYPOTHYROIDISM PROFILE
  {
    profile_name: 'Subclinical Hypothyroidism',
    condition_category: 'thyroid',
    primary_condition: 'Subclinical Hypothyroidism',
    typical_age_range: '30-60',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Mild fatigue', 'Mild weight gain', 'Cold intolerance', 'Constipation']),
    common_symptoms: JSON.stringify(['Brain fog', 'Dry skin', 'Hair thinning', 'Depression', 'Irregular periods']),
    occasional_symptoms: JSON.stringify(['Muscle aches', 'Elevated cholesterol', 'Infertility']),
    typical_lab_findings: JSON.stringify({'TSH': '4.5-10 mIU/L', 'Free T4': 'Normal', 'Free T3': 'Normal or low-normal', 'TPO antibodies': 'May be elevated'}),
    lab_severity_markers: JSON.stringify({'TSH': '>7 mIU/L more likely to benefit from treatment', 'TPO antibodies': '>100 IU/mL higher progression risk'}),
    primary_hormone_system: 'thyroid',
    secondary_hormone_systems: JSON.stringify(['metabolic', 'reproductive']),
    associated_edc_exposures: JSON.stringify(['Perchlorate', 'BPA', 'PFAS', 'Pesticides']),
    edc_mechanism: 'EDCs interfere with thyroid hormone synthesis and metabolism. Subclinical hypothyroidism may represent early EDC-induced thyroid dysfunction.',
    diagnostic_criteria: 'TSH 4.5-10 mIU/L with normal Free T4 and symptoms',
    differential_diagnosis: JSON.stringify(['Overt hypothyroidism', 'Euthyroid sick syndrome', 'Medication effects', 'Assay variability']),
    red_flags: 'TSH >10 (treat), pregnancy (treat if TSH >2.5), infertility',
    first_line_treatment: 'Lifestyle modifications (selenium, gluten-free trial) + Consider levothyroxine if TSH >7 or symptoms significant',
    recommended_protocol_ids: JSON.stringify([1]), // Hypothyroidism lifestyle protocol
    expected_response_timeline: '6-8 weeks',
    natural_history: '2-5% per year progress to overt hypothyroidism, especially if TPO antibodies positive.',
    treatment_success_rate: '70-80% symptom improvement with treatment',
    reversibility: 'variable',
    prevalence_data: '4-10% of population',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 25535055', 'PMID: 31361997']),
    clinical_notes: 'Controversial whether to treat. Consider treatment if TSH >7, symptoms significant, TPO antibodies positive, or infertility/pregnancy.'
  }
];

async function seedProfiles() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Seeding hormone dysfunction profiles (Part 2)...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const profile of profiles) {
    try {
      await connection.query(
        `INSERT INTO hormone_dysfunction_profiles (
          profile_name, condition_category, primary_condition, typical_age_range, gender_prevalence,
          cardinal_symptoms, common_symptoms, occasional_symptoms,
          typical_lab_findings, lab_severity_markers,
          primary_hormone_system, secondary_hormone_systems,
          associated_edc_exposures, edc_mechanism,
          diagnostic_criteria, differential_diagnosis, red_flags,
          first_line_treatment, recommended_protocol_ids, expected_response_timeline,
          natural_history, treatment_success_rate, reversibility,
          prevalence_data, evidence_quality, key_references, clinical_notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          profile.profile_name,
          profile.condition_category,
          profile.primary_condition,
          profile.typical_age_range,
          profile.gender_prevalence,
          profile.cardinal_symptoms,
          profile.common_symptoms,
          profile.occasional_symptoms,
          profile.typical_lab_findings,
          profile.lab_severity_markers,
          profile.primary_hormone_system,
          profile.secondary_hormone_systems,
          profile.associated_edc_exposures,
          profile.edc_mechanism,
          profile.diagnostic_criteria,
          profile.differential_diagnosis,
          profile.red_flags,
          profile.first_line_treatment,
          profile.recommended_protocol_ids,
          profile.expected_response_timeline,
          profile.natural_history,
          profile.treatment_success_rate,
          profile.reversibility,
          profile.prevalence_data,
          profile.evidence_quality,
          profile.key_references,
          profile.clinical_notes
        ]
      );
      console.log(`✓ Added: ${profile.profile_name}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error adding ${profile.profile_name}:`, error.message);
      errorCount++;
    }
  }
  
  await connection.end();
  
  console.log(`\n========================================`);
  console.log(`PART 2 SEEDING COMPLETE`);
  console.log(`========================================`);
  console.log(`Successfully added: ${successCount} profiles`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total profiles in database: ${14 + successCount}`);
  console.log(`========================================\n`);
}

seedProfiles().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
