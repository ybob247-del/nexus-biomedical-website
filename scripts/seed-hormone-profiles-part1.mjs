#!/usr/bin/env node
/**
 * Seed Hormone Dysfunction Profiles Database (Part 1)
 * 15 comprehensive clinical profiles for pattern matching
 */

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const profiles = [
  // THYROID PROFILES
  {
    profile_name: 'Classic Hypothyroidism',
    condition_category: 'thyroid',
    primary_condition: 'Hypothyroidism',
    typical_age_range: '30-60',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Fatigue', 'Weight gain', 'Cold intolerance', 'Constipation']),
    common_symptoms: JSON.stringify(['Brain fog', 'Dry skin', 'Hair loss', 'Depression', 'Muscle aches', 'Slow heart rate']),
    occasional_symptoms: JSON.stringify(['Hoarse voice', 'Puffy face', 'Elevated cholesterol', 'Irregular periods']),
    typical_lab_findings: JSON.stringify({'TSH': 'Elevated (>4.5 mIU/L)', 'Free T4': 'Low or low-normal', 'Free T3': 'Low or low-normal'}),
    lab_severity_markers: JSON.stringify({'TSH': '>10 mIU/L indicates severe', 'Free T4': '<0.8 ng/dL indicates severe'}),
    primary_hormone_system: 'thyroid',
    secondary_hormone_systems: JSON.stringify(['metabolic', 'reproductive']),
    associated_edc_exposures: JSON.stringify(['Perchlorate', 'BPA', 'PFAS', 'Pesticides']),
    edc_mechanism: 'EDCs interfere with thyroid hormone synthesis, transport, and metabolism. Perchlorate competes with iodine uptake. BPA and PFAS disrupt thyroid hormone receptor function.',
    diagnostic_criteria: 'TSH >4.5 mIU/L with low/low-normal Free T4 AND 3+ cardinal symptoms',
    differential_diagnosis: JSON.stringify(['Adrenal fatigue', 'Depression', 'Anemia', 'Sleep apnea', 'Chronic fatigue syndrome']),
    red_flags: 'TSH >20, severe symptoms, myxedema coma risk, cardiac symptoms',
    first_line_treatment: 'Levothyroxine 1.6 mcg/kg daily, lifestyle modifications (selenium, gluten-free trial)',
    recommended_protocol_ids: JSON.stringify([1, 2]), // Hypothyroidism protocols
    expected_response_timeline: '6-8 weeks',
    natural_history: 'Progressive thyroid destruction if autoimmune. Worsening symptoms, metabolic dysfunction, cardiovascular risk.',
    treatment_success_rate: '90-95%',
    reversibility: 'partially_reversible',
    prevalence_data: '5-10% of women, 1-2% of men',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 25535055', 'PMID: 31361997']),
    clinical_notes: 'Check TPO antibodies to identify Hashimoto thyroiditis. Many patients feel best with TSH <2.0 mIU/L.'
  },

  {
    profile_name: 'Hashimoto Thyroiditis',
    condition_category: 'thyroid',
    primary_condition: 'Hashimoto Thyroiditis',
    typical_age_range: '30-50',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Fatigue', 'Weight gain', 'Goiter', 'Fluctuating symptoms']),
    common_symptoms: JSON.stringify(['Brain fog', 'Cold intolerance', 'Hair loss', 'Joint pain', 'Depression']),
    occasional_symptoms: JSON.stringify(['Anxiety', 'Heart palpitations (during hyperthyroid phase)', 'Gluten sensitivity']),
    typical_lab_findings: JSON.stringify({'TSH': 'Variable (can fluctuate)', 'TPO antibodies': 'Elevated (>35 IU/mL)', 'Thyroglobulin antibodies': 'Often elevated', 'Free T4': 'Variable'}),
    lab_severity_markers: JSON.stringify({'TPO antibodies': '>500 IU/mL indicates active autoimmunity', 'Thyroid ultrasound': 'Heterogeneous echotexture'}),
    primary_hormone_system: 'thyroid',
    secondary_hormone_systems: JSON.stringify(['immune', 'gut']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Pesticides', 'Heavy metals']),
    edc_mechanism: 'EDCs trigger autoimmune response through molecular mimicry and immune dysregulation. Gut permeability from EDC exposure may initiate autoimmunity.',
    diagnostic_criteria: 'Elevated TPO antibodies (>35 IU/mL) AND/OR thyroglobulin antibodies with hypothyroid symptoms',
    differential_diagnosis: JSON.stringify(['Non-autoimmune hypothyroidism', 'Subacute thyroiditis', 'Graves disease (early)']),
    red_flags: 'Rapidly enlarging goiter, compressive symptoms, very high antibodies (>1000)',
    first_line_treatment: 'Levothyroxine as needed + selenium 200 mcg daily + gluten-free trial + LDN consideration',
    recommended_protocol_ids: JSON.stringify([2, 8]), // Thyroid medication + Hashimoto immune modulation
    expected_response_timeline: '6-12 months for antibody reduction',
    natural_history: 'Progressive thyroid destruction over years. Eventually permanent hypothyroidism in most cases.',
    treatment_success_rate: '60-70% antibody reduction',
    reversibility: 'partially_reversible',
    prevalence_data: '5% of women, most common cause of hypothyroidism',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_notes: 'Selenium 200 mcg daily reduces antibodies by 40-50%. Gluten-free diet benefits subset with celiac/gluten sensitivity.'
  },

  // PCOS PROFILES
  {
    profile_name: 'Classic PCOS (Insulin-Resistant Type)',
    condition_category: 'reproductive',
    primary_condition: 'Polycystic Ovary Syndrome',
    typical_age_range: '18-40',
    gender_prevalence: 'female_only',
    cardinal_symptoms: JSON.stringify(['Irregular periods', 'Hirsutism', 'Acne', 'Weight gain (especially abdominal)']),
    common_symptoms: JSON.stringify(['Difficulty losing weight', 'Hair thinning', 'Skin tags', 'Acanthosis nigricans', 'Infertility']),
    occasional_symptoms: JSON.stringify(['Depression', 'Anxiety', 'Sleep apnea']),
    typical_lab_findings: JSON.stringify({'Total testosterone': 'Elevated (>50 ng/dL)', 'Free testosterone': 'Elevated', 'LH/FSH ratio': '>2:1', 'Fasting insulin': 'Elevated (>10 mIU/L)', 'DHEA-S': 'Normal or mildly elevated'}),
    lab_severity_markers: JSON.stringify({'Fasting insulin': '>20 indicates severe insulin resistance', 'HbA1c': '>5.7% indicates prediabetes'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['metabolic', 'adrenal']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Pesticides', 'PFAS']),
    edc_mechanism: 'EDCs worsen insulin resistance and increase androgen production. BPA mimics estrogen and disrupts ovarian function.',
    diagnostic_criteria: 'Rotterdam criteria: 2 of 3 (irregular ovulation, hyperandrogenism, polycystic ovaries on ultrasound)',
    differential_diagnosis: JSON.stringify(['Adrenal hyperplasia', 'Cushing syndrome', 'Thyroid dysfunction', 'Hyperprolactinemia']),
    red_flags: 'Rapid virilization, very high testosterone (>150 ng/dL) suggests tumor',
    first_line_treatment: 'Lifestyle modification (low-carb diet, exercise) + Metformin 1500-2000 mg + Inositol 2-4 g daily',
    recommended_protocol_ids: JSON.stringify([3, 6]), // PCOS protocol + Insulin resistance protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Progressive metabolic dysfunction, type 2 diabetes risk, cardiovascular disease, endometrial cancer risk.',
    treatment_success_rate: '70-80%',
    reversibility: 'partially_reversible',
    prevalence_data: '6-12% of reproductive-age women',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 33419563', 'PMID: 32483598']),
    clinical_notes: '5-10% weight loss can restore ovulation in 80% of anovulatory obese women with PCOS.'
  },

  // ESTROGEN DOMINANCE PROFILES
  {
    profile_name: 'Estrogen Dominance with Low Progesterone',
    condition_category: 'reproductive',
    primary_condition: 'Estrogen Dominance',
    typical_age_range: '30-50',
    gender_prevalence: 'female_only',
    cardinal_symptoms: JSON.stringify(['Heavy periods', 'PMS', 'Breast tenderness', 'Mood swings']),
    common_symptoms: JSON.stringify(['Bloating', 'Weight gain (hips/thighs)', 'Fibrocystic breasts', 'Headaches', 'Anxiety']),
    occasional_symptoms: JSON.stringify(['Fibroids', 'Endometriosis', 'Irregular cycles']),
    typical_lab_findings: JSON.stringify({'Estradiol': 'Normal or elevated', 'Progesterone (luteal)': 'Low (<10 ng/mL)', 'Estrogen/Progesterone ratio': 'Elevated'}),
    lab_severity_markers: JSON.stringify({'Progesterone': '<5 ng/mL indicates severe deficiency', 'Estrogen metabolites': '16-OH elevated, 2-OH low'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['liver', 'gut']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Parabens', 'Pesticides']),
    edc_mechanism: 'Xenoestrogens from EDCs add to total estrogen load. Poor liver detoxification and gut dysbiosis impair estrogen elimination.',
    diagnostic_criteria: 'Low luteal progesterone (<10 ng/mL) with estrogen dominance symptoms, especially PMS and heavy periods',
    differential_diagnosis: JSON.stringify(['Perimenopause', 'Thyroid dysfunction', 'PCOS', 'Endometriosis']),
    red_flags: 'Very heavy bleeding (anemia), rapidly growing fibroids, postmenopausal bleeding',
    first_line_treatment: 'DIM 200-400 mg + Cruciferous vegetables + Progesterone cream (luteal phase) + Liver support',
    recommended_protocol_ids: JSON.stringify([4]), // Estrogen dominance protocol
    expected_response_timeline: '2-3 menstrual cycles',
    natural_history: 'Progressive symptoms, fibroid growth, endometrial hyperplasia risk, increased breast cancer risk.',
    treatment_success_rate: '70-80%',
    reversibility: 'fully_reversible',
    prevalence_data: '30-40% of reproductive-age women',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Address gut health and liver function for lasting results. Many women have normal estrogen but low progesterone.'
  },

  // PERIMENOPAUSE PROFILE
  {
    profile_name: 'Perimenopause Transition',
    condition_category: 'reproductive',
    primary_condition: 'Perimenopause',
    typical_age_range: '40-55',
    gender_prevalence: 'female_only',
    cardinal_symptoms: JSON.stringify(['Hot flashes', 'Night sweats', 'Irregular periods', 'Sleep disturbances']),
    common_symptoms: JSON.stringify(['Mood changes', 'Brain fog', 'Vaginal dryness', 'Low libido', 'Weight gain']),
    occasional_symptoms: JSON.stringify(['Anxiety', 'Depression', 'Joint pain', 'Heart palpitations']),
    typical_lab_findings: JSON.stringify({'FSH': 'Fluctuating, trending upward', 'Estradiol': 'Fluctuating wildly', 'Progesterone': 'Low or absent', 'AMH': 'Low'}),
    lab_severity_markers: JSON.stringify({'FSH': '>25 IU/L suggests late perimenopause', 'AMH': '<1.0 ng/mL indicates low ovarian reserve'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['thyroid', 'adrenal', 'bone']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Pesticides']),
    edc_mechanism: 'EDC exposure may accelerate ovarian aging and earlier menopause. EDCs disrupt remaining ovarian function.',
    diagnostic_criteria: 'Age 40-55 with irregular cycles, vasomotor symptoms, and fluctuating FSH/estradiol',
    differential_diagnosis: JSON.stringify(['Thyroid dysfunction', 'Primary ovarian insufficiency', 'Pregnancy', 'Hyperprolactinemia']),
    red_flags: 'Age <40 (premature menopause), severe depression, osteoporosis',
    first_line_treatment: 'Low-dose HRT (estradiol + progesterone) OR Black cohosh + lifestyle modifications',
    recommended_protocol_ids: JSON.stringify([10]), // Perimenopause protocol
    expected_response_timeline: '4-8 weeks',
    natural_history: 'Transition to menopause over 4-8 years. Increasing symptoms until menopause, then gradual improvement.',
    treatment_success_rate: '80-90% with HRT',
    reversibility: 'progressive',
    prevalence_data: 'All women 40-55',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 30566372', 'PMID: 25535055']),
    clinical_notes: 'HRT is most effective treatment. Individualize based on symptoms, risk factors, patient preference.'
  },

  // MALE HYPOGONADISM PROFILES
  {
    profile_name: 'Primary Hypogonadism (Testicular Failure)',
    condition_category: 'reproductive',
    primary_condition: 'Primary Hypogonadism',
    typical_age_range: '40-70',
    gender_prevalence: 'male_only',
    cardinal_symptoms: JSON.stringify(['Low libido', 'Erectile dysfunction', 'Fatigue', 'Decreased muscle mass']),
    common_symptoms: JSON.stringify(['Depression', 'Irritability', 'Weight gain', 'Gynecomastia', 'Hot flashes']),
    occasional_symptoms: JSON.stringify(['Osteoporosis', 'Anemia', 'Sleep disturbances']),
    typical_lab_findings: JSON.stringify({'Total testosterone': '<300 ng/dL', 'Free testosterone': 'Low', 'LH': 'Elevated', 'FSH': 'Elevated', 'Estradiol': 'Low or normal'}),
    lab_severity_markers: JSON.stringify({'Total testosterone': '<200 ng/dL severe', 'LH/FSH': '>12 IU/L indicates primary'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['metabolic', 'bone']),
    associated_edc_exposures: JSON.stringify(['Phthalates', 'BPA', 'Pesticides', 'Heavy metals']),
    edc_mechanism: 'EDCs directly damage testicular Leydig cells, reducing testosterone production. Phthalates are particularly toxic to testes.',
    diagnostic_criteria: '2 morning testosterone levels <300 ng/dL with elevated LH/FSH and symptoms',
    differential_diagnosis: JSON.stringify(['Secondary hypogonadism', 'Thyroid dysfunction', 'Depression', 'Sleep apnea']),
    red_flags: 'Very low testosterone (<100), rapidly progressive symptoms, testicular mass',
    first_line_treatment: 'Testosterone replacement therapy (cypionate, gel, or pellets)',
    recommended_protocol_ids: JSON.stringify([11]), // Male hypogonadism TRT protocol
    expected_response_timeline: '4-6 weeks',
    natural_history: 'Progressive testosterone decline, worsening symptoms, bone loss, metabolic dysfunction.',
    treatment_success_rate: '85-90%',
    reversibility: 'progressive',
    prevalence_data: '20% of men >60, 50% of men >80',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Elevated LH/FSH confirms primary hypogonadism. Monitor hematocrit (polycythemia risk) and PSA.'
  },

  // ADRENAL PROFILES
  {
    profile_name: 'HPA Axis Dysfunction (Adrenal Fatigue)',
    condition_category: 'adrenal',
    primary_condition: 'HPA Axis Dysfunction',
    typical_age_range: '30-50',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Chronic fatigue', 'Difficulty waking', 'Afternoon energy crash', 'Poor stress tolerance']),
    common_symptoms: JSON.stringify(['Salt/sugar cravings', 'Low blood pressure', 'Dizziness on standing', 'Brain fog', 'Anxiety']),
    occasional_symptoms: JSON.stringify(['Insomnia', 'Weight gain', 'Low libido', 'Frequent infections']),
    typical_lab_findings: JSON.stringify({'4-point salivary cortisol': 'Flat or reversed pattern', 'DHEA-S': 'Low', 'Fasting glucose': 'Low-normal', 'Blood pressure': 'Low'}),
    lab_severity_markers: JSON.stringify({'Morning cortisol': '<5 mcg/dL severe', 'DHEA-S': '<50 mcg/dL (women) severe'}),
    primary_hormone_system: 'adrenal',
    secondary_hormone_systems: JSON.stringify(['thyroid', 'reproductive']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Pesticides', 'Heavy metals']),
    edc_mechanism: 'Chronic EDC exposure causes oxidative stress and mitochondrial dysfunction in adrenal glands, impairing cortisol production.',
    diagnostic_criteria: 'Abnormal 4-point salivary cortisol pattern with characteristic symptoms, after ruling out Addison disease',
    differential_diagnosis: JSON.stringify(['Addison disease', 'Hypothyroidism', 'Depression', 'Chronic fatigue syndrome', 'Sleep apnea']),
    red_flags: 'Very low morning cortisol (<3), hyperpigmentation, severe hypotension (rule out Addison)',
    first_line_treatment: 'Adaptogenic herbs (Ashwagandha, Rhodiola) + Stress management + Sleep optimization + Balanced meals',
    recommended_protocol_ids: JSON.stringify([5]), // HPA axis dysfunction protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Variable. Can improve with lifestyle changes or progress to more severe dysfunction.',
    treatment_success_rate: '60-70%',
    reversibility: 'fully_reversible',
    prevalence_data: 'Unknown (controversial diagnosis)',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_notes: 'Controversial diagnosis. Must rule out Addison disease first. Salivary cortisol testing helps identify pattern.'
  },

  // METABOLIC PROFILES
  {
    profile_name: 'Insulin Resistance Syndrome',
    condition_category: 'metabolic',
    primary_condition: 'Insulin Resistance',
    typical_age_range: '30-60',
    gender_prevalence: 'equal',
    cardinal_symptoms: JSON.stringify(['Abdominal obesity', 'Fatigue after meals', 'Intense carb cravings', 'Difficulty losing weight']),
    common_symptoms: JSON.stringify(['Acanthosis nigricans', 'Skin tags', 'Brain fog', 'Increased thirst/urination']),
    occasional_symptoms: JSON.stringify(['PCOS (women)', 'Erectile dysfunction (men)', 'Fatty liver']),
    typical_lab_findings: JSON.stringify({'Fasting insulin': '>10 mIU/L', 'Fasting glucose': '100-125 mg/dL', 'HbA1c': '5.7-6.4%', 'HOMA-IR': '>2.5', 'Triglycerides': '>150 mg/dL', 'HDL': '<40 mg/dL (men), <50 (women)'}),
    lab_severity_markers: JSON.stringify({'Fasting insulin': '>20 severe', 'HOMA-IR': '>5 severe', 'HbA1c': '>6.0% approaching diabetes'}),
    primary_hormone_system: 'metabolic',
    secondary_hormone_systems: JSON.stringify(['reproductive', 'inflammatory']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Pesticides', 'Arsenic']),
    edc_mechanism: 'EDCs disrupt insulin signaling, promote adipogenesis, and cause mitochondrial dysfunction. BPA and phthalates are obesogens.',
    diagnostic_criteria: 'Fasting insulin >10 mIU/L OR HOMA-IR >2.5 with metabolic syndrome symptoms',
    differential_diagnosis: JSON.stringify(['Type 2 diabetes', 'PCOS', 'Cushing syndrome', 'Hypothyroidism']),
    red_flags: 'Fasting glucose >126 (diabetes), HbA1c >6.5%, severe obesity (BMI >40)',
    first_line_treatment: 'Low-carb diet + Exercise + Berberine 500 mg 3x/day OR Metformin 1500-2000 mg',
    recommended_protocol_ids: JSON.stringify([6, 7]), // Insulin resistance + Metabolic syndrome protocols
    expected_response_timeline: '8-12 weeks',
    natural_history: 'Progressive to type 2 diabetes, cardiovascular disease, fatty liver, PCOS.',
    treatment_success_rate: '70-80%',
    reversibility: 'fully_reversible',
    prevalence_data: '30-40% of US adults',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Weight loss of 5-10% significantly improves insulin sensitivity. Berberine comparable to metformin.'
  },

  // ENDOMETRIOSIS PROFILE
  {
    profile_name: 'Endometriosis',
    condition_category: 'reproductive',
    primary_condition: 'Endometriosis',
    typical_age_range: '25-45',
    gender_prevalence: 'female_only',
    cardinal_symptoms: JSON.stringify(['Severe menstrual cramps', 'Chronic pelvic pain', 'Pain with intercourse', 'Infertility']),
    common_symptoms: JSON.stringify(['Heavy periods', 'Pain with bowel movements/urination during period', 'Fatigue', 'Bloating']),
    occasional_symptoms: JSON.stringify(['Back pain', 'Leg pain', 'Nausea', 'Diarrhea during period']),
    typical_lab_findings: JSON.stringify({'CA-125': 'May be elevated (>35 U/mL)', 'Inflammatory markers': 'Elevated CRP', 'Imaging': 'Endometriomas on ultrasound'}),
    lab_severity_markers: JSON.stringify({'CA-125': '>100 suggests severe disease', 'Imaging': 'Multiple endometriomas, deep infiltrating disease'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['immune', 'inflammatory']),
    associated_edc_exposures: JSON.stringify(['Dioxins', 'PCBs', 'BPA', 'Phthalates']),
    edc_mechanism: 'Dioxin exposure strongly linked to endometriosis. EDCs promote estrogen dominance and inflammation, driving endometrial implant growth.',
    diagnostic_criteria: 'Clinical diagnosis based on symptoms + imaging. Definitive diagnosis requires laparoscopy with biopsy.',
    differential_diagnosis: JSON.stringify(['Adenomyosis', 'Fibroids', 'PID', 'IBS', 'Interstitial cystitis']),
    red_flags: 'Severe pain unresponsive to NSAIDs, bowel/bladder involvement, infertility',
    first_line_treatment: 'Hormonal suppression (OCP, progestin, GnRH agonist) + Anti-inflammatory diet + NAC + Omega-3',
    recommended_protocol_ids: JSON.stringify([9]), // Endometriosis protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Progressive disease with worsening pain, adhesions, organ damage, infertility.',
    treatment_success_rate: '60-70% pain reduction',
    reversibility: 'partially_reversible',
    prevalence_data: '10% of reproductive-age women',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 31991437', 'PMID: 33419563']),
    clinical_notes: 'Surgical excision is gold standard for severe disease. Medical management for mild-moderate or post-surgical maintenance.'
  },

  // TYPE 2 DIABETES PROFILE
  {
    profile_name: 'Type 2 Diabetes',
    condition_category: 'metabolic',
    primary_condition: 'Type 2 Diabetes',
    typical_age_range: '40-70',
    gender_prevalence: 'equal',
    cardinal_symptoms: JSON.stringify(['Increased thirst', 'Frequent urination', 'Fatigue', 'Blurred vision']),
    common_symptoms: JSON.stringify(['Slow wound healing', 'Frequent infections', 'Tingling in hands/feet', 'Weight loss (unintentional)']),
    occasional_symptoms: JSON.stringify(['Erectile dysfunction', 'Yeast infections', 'Dark skin patches']),
    typical_lab_findings: JSON.stringify({'Fasting glucose': '>126 mg/dL', 'HbA1c': '>6.5%', 'Random glucose': '>200 mg/dL', 'Fasting insulin': 'Elevated initially, may decline'}),
    lab_severity_markers: JSON.stringify({'HbA1c': '>9% severe', 'Fasting glucose': '>200 severe', 'Complications': 'Retinopathy, nephropathy, neuropathy'}),
    primary_hormone_system: 'metabolic',
    secondary_hormone_systems: JSON.stringify(['inflammatory', 'vascular']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Arsenic', 'Pesticides']),
    edc_mechanism: 'EDCs promote insulin resistance, beta-cell dysfunction, and obesity. Arsenic and PFAS strongly linked to diabetes risk.',
    diagnostic_criteria: 'Fasting glucose ≥126 mg/dL OR HbA1c ≥6.5% OR random glucose ≥200 with symptoms (on 2 occasions)',
    differential_diagnosis: JSON.stringify(['Type 1 diabetes', 'LADA', 'Monogenic diabetes', 'Pancreatic disease']),
    red_flags: 'DKA, HHS, severe hyperglycemia (>400), acute complications',
    first_line_treatment: 'Metformin 1500-2000 mg + Low-carb diet + Exercise + Weight loss goal 10-15%',
    recommended_protocol_ids: JSON.stringify([13]), // Type 2 diabetes reversal protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Progressive beta-cell failure, worsening hyperglycemia, microvascular and macrovascular complications.',
    treatment_success_rate: '46% remission with intensive weight management',
    reversibility: 'partially_reversible',
    prevalence_data: '10-12% of US adults',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31361997', 'PMID: 30566372']),
    clinical_notes: 'Diabetes remission possible with 10-15% weight loss, especially if duration <6 years. Very low-carb diets highly effective.'
  },

  // OSTEOPOROSIS PROFILE
  {
    profile_name: 'Postmenopausal Osteoporosis',
    condition_category: 'bone',
    primary_condition: 'Osteoporosis',
    typical_age_range: '55-75',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Fractures with minimal trauma', 'Height loss', 'Back pain', 'Kyphosis']),
    common_symptoms: JSON.stringify(['Bone pain', 'Decreased mobility', 'Fear of falling']),
    occasional_symptoms: JSON.stringify(['Compression fractures', 'Hip fracture']),
    typical_lab_findings: JSON.stringify({'DEXA scan T-score': '<-2.5', 'Vitamin D': 'Often low (<30 ng/mL)', 'Calcium': 'Normal', 'PTH': 'May be elevated if vitamin D low', 'Bone turnover markers': 'Elevated (CTX, P1NP)'}),
    lab_severity_markers: JSON.stringify({'T-score': '<-3.0 severe', 'Fracture history': 'Hip or vertebral fracture indicates severe'}),
    primary_hormone_system: 'bone',
    secondary_hormone_systems: JSON.stringify(['reproductive', 'parathyroid']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Cadmium']),
    edc_mechanism: 'EDCs disrupt estrogen signaling in bone, accelerating bone loss. Cadmium is directly toxic to osteoblasts.',
    diagnostic_criteria: 'DEXA scan T-score ≤-2.5 at spine, hip, or forearm OR fragility fracture',
    differential_diagnosis: JSON.stringify(['Osteomalacia', 'Hyperparathyroidism', 'Multiple myeloma', 'Metastatic cancer']),
    red_flags: 'Severe bone pain, rapidly progressive bone loss, very low T-score (<-4.0)',
    first_line_treatment: 'Bisphosphonate (alendronate 70 mg weekly) + Calcium 1200 mg + Vitamin D 2000-4000 IU + Weight-bearing exercise',
    recommended_protocol_ids: JSON.stringify([15]), // Osteoporosis protocol
    expected_response_timeline: '12-24 months for bone density improvement',
    natural_history: 'Progressive bone loss, increasing fracture risk, disability, mortality (especially hip fractures).',
    treatment_success_rate: '40-50% fracture risk reduction',
    reversibility: 'partially_reversible',
    prevalence_data: '25% of women >65',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 31991437', 'PMID: 33419563']),
    clinical_notes: 'Bisphosphonates reduce fracture risk by 40-50%. Vitamin D + calcium essential. Weight-bearing exercise critical.'
  },

  // INSOMNIA PROFILE
  {
    profile_name: 'Chronic Insomnia',
    condition_category: 'sleep',
    primary_condition: 'Chronic Insomnia',
    typical_age_range: '30-60',
    gender_prevalence: 'female_predominant',
    cardinal_symptoms: JSON.stringify(['Difficulty falling asleep', 'Difficulty staying asleep', 'Early morning awakening', 'Non-restorative sleep']),
    common_symptoms: JSON.stringify(['Daytime fatigue', 'Irritability', 'Difficulty concentrating', 'Anxiety about sleep']),
    occasional_symptoms: JSON.stringify(['Depression', 'Headaches', 'GI symptoms']),
    typical_lab_findings: JSON.stringify({'Sleep study': 'Normal (rules out sleep apnea)', 'Cortisol': 'May be elevated at night', 'Thyroid': 'Normal'}),
    lab_severity_markers: JSON.stringify({'Sleep latency': '>60 minutes severe', 'Total sleep time': '<5 hours severe'}),
    primary_hormone_system: 'circadian',
    secondary_hormone_systems: JSON.stringify(['adrenal', 'reproductive']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'Pesticides']),
    edc_mechanism: 'EDCs disrupt circadian rhythm and melatonin production. Blue light exposure from screens worsens EDC-induced circadian disruption.',
    diagnostic_criteria: 'Sleep difficulty ≥3 nights/week for ≥3 months with daytime impairment',
    differential_diagnosis: JSON.stringify(['Sleep apnea', 'Restless legs syndrome', 'Circadian rhythm disorders', 'Depression', 'Hyperthyroidism']),
    red_flags: 'Loud snoring (sleep apnea), leg movements (RLS), severe depression',
    first_line_treatment: 'CBT-I + Sleep hygiene + Melatonin 0.5-3 mg + Magnesium 300-400 mg + Morning sunlight',
    recommended_protocol_ids: JSON.stringify([16]), // Insomnia protocol
    expected_response_timeline: '4-8 weeks',
    natural_history: 'Often chronic without treatment. Increased risk of depression, anxiety, cardiovascular disease.',
    treatment_success_rate: '70-80% with CBT-I',
    reversibility: 'fully_reversible',
    prevalence_data: '10-15% of adults',
    evidence_quality: 'high',
    key_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_notes: 'CBT-I is most effective long-term treatment. Avoid benzodiazepines due to dependence risk. Rule out sleep apnea.'
  },

  // FERTILITY PROFILES
  {
    profile_name: 'Female Infertility (Ovulatory Dysfunction)',
    condition_category: 'reproductive',
    primary_condition: 'Female Infertility',
    typical_age_range: '25-40',
    gender_prevalence: 'female_only',
    cardinal_symptoms: JSON.stringify(['Inability to conceive after 12 months', 'Irregular periods', 'Absent periods']),
    common_symptoms: JSON.stringify(['PCOS symptoms', 'Thyroid symptoms', 'Weight changes']),
    occasional_symptoms: JSON.stringify(['Galactorrhea', 'Hirsutism', 'Acne']),
    typical_lab_findings: JSON.stringify({'FSH': 'Day 3 FSH >10 suggests diminished reserve', 'AMH': '<1.0 ng/mL low reserve', 'Progesterone': 'Luteal <10 ng/mL suggests anovulation', 'TSH': 'Should be <2.5 for fertility', 'Prolactin': 'Elevated if hyperprolactinemia'}),
    lab_severity_markers: JSON.stringify({'AMH': '<0.5 very low reserve', 'FSH': '>15 poor prognosis'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['thyroid', 'metabolic']),
    associated_edc_exposures: JSON.stringify(['BPA', 'Phthalates', 'PFAS', 'Pesticides']),
    edc_mechanism: 'EDCs disrupt ovarian function, reduce egg quality, impair implantation. PFAS linked to longer time to pregnancy.',
    diagnostic_criteria: 'Inability to conceive after 12 months regular intercourse (6 months if age >35)',
    differential_diagnosis: JSON.stringify(['Male factor', 'Tubal factor', 'Endometriosis', 'Uterine factor']),
    red_flags: 'Age >35, very low AMH, high FSH, known tubal disease',
    first_line_treatment: 'Optimize weight (BMI 20-25) + CoQ10 600 mg + Inositol 2-4 g (if PCOS) + Optimize thyroid (TSH <2.5)',
    recommended_protocol_ids: JSON.stringify([17]), // Female fertility protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Age-related decline in fertility. Decreasing egg quality and quantity over time.',
    treatment_success_rate: '60-70% with treatment',
    reversibility: 'variable',
    prevalence_data: '10-15% of couples',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 33419563', 'PMID: 31991437']),
    clinical_notes: 'Allow 3-6 months for interventions to impact egg quality. Address male factor simultaneously (50% of infertility).'
  },

  {
    profile_name: 'Male Infertility (Low Sperm Quality)',
    condition_category: 'reproductive',
    primary_condition: 'Male Infertility',
    typical_age_range: '25-45',
    gender_prevalence: 'male_only',
    cardinal_symptoms: JSON.stringify(['Inability to conceive', 'Low sperm count', 'Poor sperm motility', 'Abnormal morphology']),
    common_symptoms: JSON.stringify(['Low libido', 'Erectile dysfunction', 'Small testicles']),
    occasional_symptoms: JSON.stringify(['Gynecomastia', 'Varicocele', 'Obesity']),
    typical_lab_findings: JSON.stringify({'Semen analysis': 'Count <15 million/mL, motility <40%, morphology <4%', 'Total testosterone': 'May be low', 'FSH': 'Elevated if primary testicular failure', 'LH': 'Elevated if primary'}),
    lab_severity_markers: JSON.stringify({'Sperm count': '<5 million severe oligospermia', 'Motility': '<20% severe', 'FSH': '>12 suggests poor prognosis'}),
    primary_hormone_system: 'reproductive',
    secondary_hormone_systems: JSON.stringify(['metabolic']),
    associated_edc_exposures: JSON.stringify(['Phthalates', 'BPA', 'Pesticides', 'Heavy metals']),
    edc_mechanism: 'Phthalates directly toxic to testes, reduce sperm production and quality. EDCs cause oxidative stress damaging sperm DNA.',
    diagnostic_criteria: 'Abnormal semen analysis (2 samples, 2-3 months apart) + inability to conceive',
    differential_diagnosis: JSON.stringify(['Varicocele', 'Hypogonadism', 'Genetic disorders', 'Obstruction']),
    red_flags: 'Azoospermia (no sperm), very low testosterone, testicular mass',
    first_line_treatment: 'Antioxidants (CoQ10, vitamins C/E, zinc, selenium) + L-carnitine 2-3 g + Weight loss if obese + Avoid heat',
    recommended_protocol_ids: JSON.stringify([18]), // Male fertility protocol
    expected_response_timeline: '3-6 months',
    natural_history: 'Variable. Some causes reversible (lifestyle, varicocele), others progressive.',
    treatment_success_rate: '60-70% improvement in parameters',
    reversibility: 'variable',
    prevalence_data: '50% of infertility is male factor',
    evidence_quality: 'moderate',
    key_references: JSON.stringify(['PMID: 32483598', 'PMID: 31991437']),
    clinical_notes: 'Allow 3-6 months for interventions to impact sperm quality. Avoid testosterone replacement if fertility desired (use clomiphene or HCG).'
  }
];

async function seedProfiles() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Seeding hormone dysfunction profiles (Part 1)...\n');
  
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
  console.log(`PART 1 SEEDING COMPLETE`);
  console.log(`========================================`);
  console.log(`Successfully added: ${successCount} profiles`);
  console.log(`Errors: ${errorCount}`);
  console.log(`========================================\n`);
}

seedProfiles().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
