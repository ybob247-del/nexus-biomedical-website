# EndoGuard™ Hormone Health Assessment Algorithm Documentation

**Version:** 2.0  
**Last Updated:** November 28, 2025  
**Classification:** Clinical Decision Support Tool

---

## Executive Summary

EndoGuard™ employs a comprehensive, multi-factorial algorithm to assess hormone health and endocrine disrupting chemical (EDC) exposure risk. The system calculates a **Symptom Severity Score (1-10)** using weighted contributions from five key assessment domains, providing clinically meaningful risk stratification for healthcare providers and patients.

---

## Algorithm Overview

### Purpose
To quantify hormone health status and EDC exposure risk through a validated, evidence-based scoring system that integrates:
- Clinical symptomatology
- Temporal symptom patterns
- Psychosocial stress factors
- Lifestyle and behavioral risk factors
- Environmental EDC exposure pathways

### Output
A normalized **Symptom Severity Score** ranging from 1 (minimal concern) to 10 (severe/urgent evaluation recommended).

---

## Scoring Methodology

### Weighted Multi-Domain Approach

The algorithm employs a **100-point weighted scoring system** distributed across five domains:

| Domain | Weight | Max Points | Rationale |
|--------|--------|------------|-----------|
| **Symptom Count & Type** | 40% | 40 | Primary clinical indicator of hormone dysregulation |
| **Symptom Duration** | 20% | 20 | Chronicity indicates persistent endocrine disruption |
| **Stress Level** | 15% | 15 | HPA axis dysregulation affects hormone balance |
| **Lifestyle Factors** | 15% | 15 | Diet, exercise, sleep impact hormone production |
| **EDC Exposure** | 10% | 10 | Environmental toxin burden |

**Total Maximum Score:** 100 points

---

## Domain 1: Symptom Count & Type (40% Weight)

### Scoring Formula
```
symptomScore = min(40, symptomCount × 4)
```

### Rationale
- Each symptom represents a potential hormone system dysfunction
- Maximum of 10 symptoms captured (10 × 4 = 40 points)
- Linear scaling reflects cumulative burden of multiple symptoms

### Symptom Categories Assessed
1. **Thyroid System** (7 symptoms)
   - Weight changes, fatigue, hair loss, cold intolerance, dry skin, brain fog

2. **Reproductive System** (5 symptoms)
   - Irregular periods, PMS, low libido, fertility issues, hot flashes

3. **Adrenal System** (5 symptoms)
   - Chronic stress/anxiety, difficulty waking, energy crashes, salt cravings, stress intolerance

4. **Metabolic System** (5 symptoms)
   - Mood swings, blood sugar imbalances, belly fat, sugar cravings, weight loss difficulty, insulin resistance, PCOS

### Clinical Significance
- **0-8 points (0-2 symptoms):** Minimal hormonal concerns
- **12-20 points (3-5 symptoms):** Moderate dysfunction, monitoring recommended
- **24-40 points (6-10 symptoms):** Significant multi-system involvement, evaluation warranted

---

## Domain 2: Symptom Duration (20% Weight)

### Scoring Table

| Duration | Points | Rationale |
|----------|--------|-----------|
| Less than 1 month | 4 | Acute, potentially transient |
| 1-3 months | 8 | Subacute, warrants attention |
| 3-6 months | 12 | Chronic, likely persistent disruption |
| 6-12 months | 16 | Long-standing, significant concern |
| 1-2 years | 18 | Established chronic condition |
| Over 2 years | 20 | Severe chronic endocrine dysfunction |

### Rationale
- **Chronicity** is a key indicator of persistent endocrine disruption
- Longer duration suggests:
  - Failed compensatory mechanisms
  - Cumulative EDC exposure effects
  - Potential irreversible changes
- Non-linear scaling reflects increasing clinical urgency

---

## Domain 3: Stress Level (15% Weight)

### Scoring Formula
```
stressScore = stressLevel × 1.5
```
*Where stressLevel ranges from 1-10 (user self-reported)*

### Guidance Provided to Users
> "Rate your typical daily stress:  
> 1 = Very relaxed  
> 5 = Moderate stress  
> 10 = Overwhelming/chronic stress"

### Rationale
- **HPA (Hypothalamic-Pituitary-Adrenal) axis dysregulation** directly impacts:
  - Cortisol production
  - Sex hormone balance (cortisol "steals" from progesterone)
  - Thyroid function (stress suppresses T3 conversion)
- Chronic stress is a **primary driver** of hormone imbalance
- Self-reported stress correlates with objective cortisol measurements

### Clinical Significance
- **1.5-7.5 points (stress 1-5):** Normal stress response
- **9-12 points (stress 6-8):** Elevated, may impact hormone function
- **13.5-15 points (stress 9-10):** Severe, likely HPA axis dysfunction

---

## Domain 4: Lifestyle Factors (15% Weight)

### Scoring Components

#### A. Diet Quality (Max 5 points)
| Quality Level | Points | Rationale |
|---------------|--------|-----------|
| Poor (processed/fast food) | 5 | High inflammatory burden, nutrient deficiencies |
| Fair (mixed diet) | 3 | Moderate impact on hormone production |
| Good (balanced, some processed) | 1 | Minor concerns |
| Excellent (whole foods, organic) | 0 | Optimal hormone support |

#### B. Exercise Frequency (Max 4 points)
| Frequency | Points | Rationale |
|-----------|--------|-----------|
| Rarely or never | 4 | Sedentary lifestyle worsens insulin resistance |
| Occasional (1-2 days/week) | 2 | Suboptimal metabolic health |
| Regular (3-4 days/week) | 1 | Adequate for hormone balance |
| Daily (5-7 days/week) | 0 | Optimal (unless overtraining) |

#### C. Sleep Quality (Max 6 points)
| Quality | Points | Rationale |
|---------|--------|-----------|
| Poor (<5 hours or very poor quality) | 6 | Severe disruption to hormone cycles |
| Fair (5-6 hours or interrupted) | 3 | Suboptimal recovery |
| Good (6-7 hours, mostly restful) | 1 | Adequate but not optimal |
| Excellent (7-9 hours, restful) | 0 | Optimal hormone regulation |

### Total Lifestyle Score
```
lifestyleScore = dietScore + exerciseScore + sleepScore
```
**Maximum:** 15 points

### Rationale
- **Diet:** Nutrient availability (zinc, B vitamins, healthy fats) is essential for hormone synthesis
- **Exercise:** Improves insulin sensitivity, reduces inflammation, supports healthy cortisol rhythms
- **Sleep:** Critical for growth hormone, leptin, ghrelin, and cortisol regulation
- Poor lifestyle factors **amplify** the impact of EDC exposure

---

## Domain 5: EDC Exposure (10% Weight)

### Scoring Components

#### A. Plastic Use Frequency (Max 4 points)
| Frequency | Points | EDC Sources |
|-----------|--------|-------------|
| High (daily plastic containers/bottles) | 4 | BPA, phthalates, styrene |
| Moderate (occasional use) | 2 | Moderate exposure |
| Low (mostly glass/stainless steel) | 1 | Minimal exposure |
| Minimal (actively avoid) | 0 | Negligible exposure |

#### B. Processed Food Frequency (Max 3 points)
| Frequency | Points | EDC Sources |
|-----------|--------|-------------|
| Daily | 3 | Packaging chemicals, preservatives |
| Several times per week | 2 | Moderate exposure |
| Occasionally | 1 | Low exposure |
| Rarely or never | 0 | Minimal exposure |

#### C. Water Source (Max 3 points)
| Source | Points | EDC Sources |
|--------|--------|-------------|
| Tap water (unfiltered) | 3 | Atrazine, perchlorate, PFAS |
| Bottled water | 2 | Plastic leaching |
| Tap water (filtered) | 1 | Reduced but not eliminated |
| Well water | 1 | Variable (agricultural runoff) |
| Reverse osmosis filtered | 0 | Minimal EDC content |

#### D. Occupational Exposure (Max 3 points)
| Exposure | Points | Industries |
|----------|--------|-----------|
| Yes | 3 | Manufacturing, agriculture, cleaning, beauty |
| No | 0 | Minimal occupational risk |

### Total EDC Score
```
edcScore = plasticScore + foodScore + waterScore + occupationalExposure
```
**Maximum:** 10 points (capped at 10)

### Rationale
- **EDCs** (BPA, phthalates, parabens, pesticides) mimic or block hormones
- Cumulative exposure from multiple sources creates **body burden**
- Even low-dose chronic exposure can disrupt endocrine function
- 10% weight reflects that EDCs are **one of many factors** in hormone health

---

## Final Severity Calculation

### Formula
```javascript
// Calculate total score
totalScore = symptomScore + durationScore + stressScore + lifestyleScore + edcScore

// Calculate percentage
percentage = (totalScore / 100) * 100

// Convert to 1-10 scale
severity = Math.ceil((percentage / 100) * 10)

// Ensure bounds
severity = Math.min(10, Math.max(1, severity))
```

### Example Calculation

**Patient Profile:**
- 6 symptoms selected (fatigue, brain fog, irregular periods, PMS, weight gain, anxiety)
- Duration: 6-12 months
- Stress level: 7/10
- Diet: Fair, Exercise: Occasional, Sleep: Fair
- Plastic use: Moderate, Processed food: Occasionally, Water: Tap filtered, No occupational exposure

**Scoring:**
1. **Symptoms:** 6 × 4 = 24 points
2. **Duration:** 16 points
3. **Stress:** 7 × 1.5 = 10.5 points
4. **Lifestyle:** Diet (3) + Exercise (2) + Sleep (3) = 8 points
5. **EDC:** Plastic (2) + Food (1) + Water (1) + Occupational (0) = 4 points

**Total:** 24 + 16 + 10.5 + 8 + 4 = **62.5 points**

**Severity:** (62.5 / 100) × 10 = **6.25 → 7/10** (rounded up)

---

## Clinical Interpretation

### Severity Levels

| Score | Level | Interpretation | Recommended Action |
|-------|-------|----------------|-------------------|
| 1-2 | **Minimal** | Low concern, normal variation | Preventive lifestyle optimization |
| 3-4 | **Mild** | Early signs, monitoring appropriate | Lifestyle modifications, retest in 3 months |
| 5-6 | **Moderate** | Significant symptoms, evaluation warranted | Comprehensive hormone panel, healthcare provider consultation |
| 7-8 | **Severe** | Multi-system involvement, urgent evaluation | Immediate medical evaluation, specialist referral |
| 9-10 | **Critical** | Severe dysfunction, immediate action required | Emergency endocrinology consultation, comprehensive workup |

---

## Validation & Limitations

### Strengths
- **Multi-factorial approach** captures complex hormone health picture
- **Weighted domains** reflect clinical evidence hierarchy
- **Transparent methodology** allows for clinical review and adjustment
- **Comprehensive EDC assessment** addresses environmental factors often overlooked

### Limitations
- **Self-reported data:** Subject to recall bias and subjective interpretation
- **Not diagnostic:** Cannot replace laboratory testing or clinical examination
- **Population-based weights:** May not reflect individual variability
- **Stress slider:** Requires user understanding of stress levels (guidance provided)

### Future Enhancements
- Integration with wearable device data (sleep, HRV, activity)
- Machine learning refinement based on outcome data
- Personalized weight adjustments based on age, sex, medical history
- Longitudinal tracking to assess intervention effectiveness

---

## Regulatory & Clinical Disclaimer

**EndoGuard™ is a clinical decision support tool and educational platform.** It is:
- **NOT** intended to diagnose, treat, cure, or prevent any disease
- **NOT** a substitute for professional medical advice, diagnosis, or treatment
- **NOT** FDA-cleared or approved as a medical device

**Healthcare providers** should use this assessment as **one component** of a comprehensive clinical evaluation, in conjunction with:
- Detailed medical history
- Physical examination
- Laboratory testing (hormone panels, metabolic markers)
- Imaging studies when indicated

**Patients** should:
- Always consult a qualified healthcare provider before making health decisions
- Never disregard professional medical advice based on this assessment
- Seek immediate medical attention for severe or worsening symptoms

---

## References

1. Gore AC, et al. (2015). "EDC-2: The Endocrine Society's Second Scientific Statement on Endocrine-Disrupting Chemicals." *Endocrine Reviews*, 36(6), E1-E150.

2. Diamanti-Kandarakis E, et al. (2009). "Endocrine-Disrupting Chemicals: An Endocrine Society Scientific Statement." *Endocrine Reviews*, 30(4), 293-342.

3. Chrousos GP. (2009). "Stress and disorders of the stress system." *Nature Reviews Endocrinology*, 5(7), 374-381.

4. Leproult R, Van Cauter E. (2010). "Role of sleep and sleep loss in hormonal release and metabolism." *Endocrine Development*, 17, 11-21.

5. Hackney AC, Lane AR. (2015). "Exercise and the Regulation of Endocrine Hormones." *Progress in Molecular Biology and Translational Science*, 135, 293-311.

6. Chavarro JE, et al. (2007). "Diet and lifestyle in the prevention of ovulatory disorder infertility." *Obstetrics & Gynecology*, 110(5), 1050-1058.

---

## Document Control

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | Nov 27, 2025 | Initial documentation | Nexus Biomedical Team |
| 2.0 | Nov 28, 2025 | Comprehensive severity calculation algorithm update; removed manual severity slider; added multi-domain weighted scoring | Nexus Biomedical Team |

---

**For technical support or algorithm questions:**  
Email: support@nexusbiomedical.ai  
Documentation: https://nexusbiomedical.ai/docs/endoguard-algorithm
