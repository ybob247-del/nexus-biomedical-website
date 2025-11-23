// Test Recommendation Engine for EndoGuard
// Maps symptom patterns to recommended hormone tests

const testRecommendations = {
  thyroid_dysfunction: {
    name: "Thyroid Dysfunction",
    symptoms: [
      'Unexplained weight gain or loss',
      'Fatigue or low energy',
      'Hair loss or thinning',
      'Cold intolerance',
      'Dry skin',
      'Brain fog or difficulty concentrating'
    ],
    tests: [
      {
        name: 'TSH (Thyroid Stimulating Hormone)',
        priority: 'essential',
        cost: '$25-50',
        description: 'Measures thyroid function and is the first-line screening test for thyroid disorders.',
        rationale: 'Your symptoms of fatigue, weight changes, and cold intolerance suggest potential thyroid dysfunction. TSH is essential for diagnosing hypothyroidism or hyperthyroidism.',
        research_pmid: '28056690'
      },
      {
        name: 'Free T3 (Triiodothyronine)',
        priority: 'essential',
        cost: '$35-75',
        description: 'Measures the active form of thyroid hormone that regulates metabolism.',
        rationale: 'Free T3 provides critical information about active thyroid hormone levels that TSH alone may miss.',
        research_pmid: '29083758'
      },
      {
        name: 'Free T4 (Thyroxine)',
        priority: 'essential',
        cost: '$35-75',
        description: 'Measures thyroid hormone production by the thyroid gland.',
        rationale: 'Free T4 helps determine if thyroid hormone production is adequate and complements TSH testing.',
        research_pmid: '29083758'
      },
      {
        name: 'TPO Antibodies (Thyroid Peroxidase)',
        priority: 'recommended',
        cost: '$40-80',
        description: 'Detects autoimmune thyroid disease (Hashimoto\'s thyroiditis).',
        rationale: 'TPO antibodies identify autoimmune causes of thyroid dysfunction, which require different management approaches.',
        research_pmid: '26512965'
      },
      {
        name: 'Reverse T3',
        priority: 'optional',
        cost: '$50-100',
        description: 'Assesses thyroid hormone conversion and metabolic stress.',
        rationale: 'Reverse T3 can identify conversion issues that may explain persistent symptoms despite normal TSH.',
        research_pmid: '28056690'
      }
    ],
    totalCostEssential: '$95-200',
    totalCostAll: '$185-380'
  },

  pcos_reproductive: {
    name: "PCOS / Reproductive Hormone Imbalance",
    symptoms: [
      'Irregular menstrual cycles',
      'Heavy or painful periods',
      'PMS symptoms',
      'Fertility issues',
      'Blood sugar imbalances',
      'Increased belly fat',
      'Sugar cravings'
    ],
    tests: [
      {
        name: 'Total Testosterone',
        priority: 'essential',
        cost: '$30-60',
        description: 'Measures total testosterone levels, often elevated in PCOS.',
        rationale: 'Elevated testosterone is a hallmark of PCOS and contributes to symptoms like irregular periods and hirsutism.',
        research_pmid: '30215870'
      },
      {
        name: 'Free Testosterone',
        priority: 'essential',
        cost: '$40-80',
        description: 'Measures bioavailable testosterone not bound to proteins.',
        rationale: 'Free testosterone is the active form and provides more accurate assessment of androgen excess.',
        research_pmid: '30215870'
      },
      {
        name: 'DHEA-S (Dehydroepiandrosterone Sulfate)',
        priority: 'essential',
        cost: '$35-70',
        description: 'Measures adrenal androgen production.',
        rationale: 'DHEA-S helps differentiate between ovarian and adrenal sources of androgen excess.',
        research_pmid: '30215870'
      },
      {
        name: 'LH (Luteinizing Hormone)',
        priority: 'recommended',
        cost: '$30-60',
        description: 'Regulates ovulation and reproductive function.',
        rationale: 'Elevated LH:FSH ratio is characteristic of PCOS and indicates ovulatory dysfunction.',
        research_pmid: '30215870'
      },
      {
        name: 'FSH (Follicle Stimulating Hormone)',
        priority: 'recommended',
        cost: '$30-60',
        description: 'Regulates follicle development and ovulation.',
        rationale: 'FSH testing helps assess ovarian reserve and reproductive function.',
        research_pmid: '30215870'
      },
      {
        name: 'Fasting Insulin',
        priority: 'essential',
        cost: '$25-50',
        description: 'Measures insulin levels to detect insulin resistance.',
        rationale: 'Insulin resistance is present in 70-80% of PCOS cases and drives many symptoms.',
        research_pmid: '30215870'
      },
      {
        name: 'Fasting Glucose',
        priority: 'essential',
        cost: '$10-25',
        description: 'Screens for prediabetes and diabetes.',
        rationale: 'Women with PCOS have increased risk of type 2 diabetes; early detection is critical.',
        research_pmid: '30215870'
      },
      {
        name: 'HbA1c (Hemoglobin A1c)',
        priority: 'recommended',
        cost: '$20-40',
        description: 'Measures average blood sugar over 3 months.',
        rationale: 'HbA1c provides long-term glucose control assessment and diabetes screening.',
        research_pmid: '30215870'
      }
    ],
    totalCostEssential: '$140-285',
    totalCostAll: '$220-445'
  },

  male_hypogonadism: {
    name: "Male Hormone Deficiency (Low Testosterone)",
    symptoms: [
      'Low libido',
      'Fatigue or low energy',
      'Difficulty losing weight',
      'Mood swings'
    ],
    tests: [
      {
        name: 'Total Testosterone',
        priority: 'essential',
        cost: '$30-60',
        description: 'Measures total testosterone levels in blood.',
        rationale: 'Low testosterone is the primary cause of symptoms like low libido, fatigue, and reduced muscle mass.',
        research_pmid: '29442976'
      },
      {
        name: 'Free Testosterone',
        priority: 'essential',
        cost: '$40-80',
        description: 'Measures bioavailable testosterone not bound to SHBG.',
        rationale: 'Free testosterone is the active form and better correlates with symptoms than total testosterone.',
        research_pmid: '29442976'
      },
      {
        name: 'SHBG (Sex Hormone Binding Globulin)',
        priority: 'essential',
        cost: '$30-60',
        description: 'Protein that binds testosterone and affects bioavailability.',
        rationale: 'SHBG levels affect free testosterone availability and help interpret total testosterone results.',
        research_pmid: '29442976'
      },
      {
        name: 'LH (Luteinizing Hormone)',
        priority: 'recommended',
        cost: '$30-60',
        description: 'Stimulates testosterone production in testes.',
        rationale: 'LH helps determine if low testosterone is due to testicular or pituitary dysfunction.',
        research_pmid: '29442976'
      },
      {
        name: 'FSH (Follicle Stimulating Hormone)',
        priority: 'recommended',
        cost: '$30-60',
        description: 'Regulates sperm production and testicular function.',
        rationale: 'FSH assessment helps evaluate fertility and testicular health.',
        research_pmid: '29442976'
      },
      {
        name: 'Estradiol (E2)',
        priority: 'recommended',
        cost: '$40-80',
        description: 'Measures estrogen levels in men.',
        rationale: 'Elevated estradiol can cause symptoms and indicates testosterone-to-estrogen conversion.',
        research_pmid: '29442976'
      }
    ],
    totalCostEssential: '$100-200',
    totalCostAll: '$200-400'
  },

  adrenal_dysfunction: {
    name: "Adrenal Dysfunction / Chronic Stress",
    symptoms: [
      'Chronic stress or anxiety',
      'Difficulty waking up',
      'Afternoon energy crashes',
      'Salt cravings',
      'Difficulty handling stress',
      'Mood swings'
    ],
    tests: [
      {
        name: 'Cortisol (4-Point Saliva Test)',
        priority: 'essential',
        cost: '$150-250',
        description: 'Measures cortisol rhythm throughout the day (morning, noon, evening, night).',
        rationale: 'Your symptoms suggest disrupted cortisol patterns. The 4-point test reveals daily cortisol rhythm abnormalities.',
        research_pmid: '28056690'
      },
      {
        name: 'DHEA-S (Dehydroepiandrosterone Sulfate)',
        priority: 'essential',
        cost: '$35-70',
        description: 'Measures adrenal androgen production and stress resilience.',
        rationale: 'DHEA-S reflects adrenal reserve and helps assess chronic stress impact.',
        research_pmid: '28056690'
      },
      {
        name: 'Morning Serum Cortisol',
        priority: 'recommended',
        cost: '$25-50',
        description: 'Measures cortisol levels in the morning (peak time).',
        rationale: 'Morning cortisol screening can identify severe adrenal insufficiency or excess.',
        research_pmid: '28056690'
      }
    ],
    totalCostEssential: '$185-320',
    totalCostAll: '$210-370'
  },

  metabolic_syndrome: {
    name: "Metabolic Syndrome / Insulin Resistance",
    symptoms: [
      'Blood sugar imbalances',
      'Increased belly fat',
      'Sugar cravings',
      'Difficulty losing weight',
      'Insulin resistance',
      'Unexplained weight gain or loss'
    ],
    tests: [
      {
        name: 'Fasting Insulin',
        priority: 'essential',
        cost: '$25-50',
        description: 'Measures insulin levels after overnight fast.',
        rationale: 'Elevated fasting insulin is the earliest marker of insulin resistance, often preceding glucose abnormalities.',
        research_pmid: '30215870'
      },
      {
        name: 'Fasting Glucose',
        priority: 'essential',
        cost: '$10-25',
        description: 'Measures blood sugar after overnight fast.',
        rationale: 'Fasting glucose screens for prediabetes and diabetes.',
        research_pmid: '30215870'
      },
      {
        name: 'HbA1c (Hemoglobin A1c)',
        priority: 'essential',
        cost: '$20-40',
        description: 'Measures average blood sugar over past 3 months.',
        rationale: 'HbA1c provides long-term glucose control assessment and diabetes risk stratification.',
        research_pmid: '30215870'
      },
      {
        name: 'Lipid Panel (Total Cholesterol, LDL, HDL, Triglycerides)',
        priority: 'recommended',
        cost: '$30-60',
        description: 'Measures cholesterol and triglyceride levels.',
        rationale: 'Lipid abnormalities often accompany insulin resistance and increase cardiovascular risk.',
        research_pmid: '30215870'
      },
      {
        name: 'HOMA-IR (Homeostatic Model Assessment)',
        priority: 'optional',
        cost: 'Calculated from fasting glucose and insulin',
        description: 'Calculated index of insulin resistance.',
        rationale: 'HOMA-IR quantifies insulin resistance severity using fasting glucose and insulin values.',
        research_pmid: '30215870'
      }
    ],
    totalCostEssential: '$55-115',
    totalCostAll: '$85-175'
  }
};

// Function to generate test recommendations based on symptoms
function generateTestRecommendations(symptoms, systemsAffected) {
  const recommendations = [];

  // Check for thyroid symptoms
  const thyroidSymptoms = testRecommendations.thyroid_dysfunction.symptoms;
  const thyroidMatches = symptoms.filter(s => thyroidSymptoms.includes(s)).length;
  if (thyroidMatches >= 2 || systemsAffected.includes('Thyroid')) {
    recommendations.push(testRecommendations.thyroid_dysfunction);
  }

  // Check for PCOS/reproductive symptoms
  const pcosSymptoms = testRecommendations.pcos_reproductive.symptoms;
  const pcosMatches = symptoms.filter(s => pcosSymptoms.includes(s)).length;
  if (pcosMatches >= 2 || systemsAffected.includes('Reproductive')) {
    recommendations.push(testRecommendations.pcos_reproductive);
  }

  // Check for male hypogonadism symptoms
  const maleSymptoms = testRecommendations.male_hypogonadism.symptoms;
  const maleMatches = symptoms.filter(s => maleSymptoms.includes(s)).length;
  if (maleMatches >= 2) {
    recommendations.push(testRecommendations.male_hypogonadism);
  }

  // Check for adrenal symptoms
  const adrenalSymptoms = testRecommendations.adrenal_dysfunction.symptoms;
  const adrenalMatches = symptoms.filter(s => adrenalSymptoms.includes(s)).length;
  if (adrenalMatches >= 2 || systemsAffected.includes('Adrenal')) {
    recommendations.push(testRecommendations.adrenal_dysfunction);
  }

  // Check for metabolic symptoms
  const metabolicSymptoms = testRecommendations.metabolic_syndrome.symptoms;
  const metabolicMatches = symptoms.filter(s => metabolicSymptoms.includes(s)).length;
  if (metabolicMatches >= 2 || systemsAffected.includes('Metabolic')) {
    recommendations.push(testRecommendations.metabolic_syndrome);
  }

  return recommendations;
}

module.exports = {
  testRecommendations,
  generateTestRecommendations
};
