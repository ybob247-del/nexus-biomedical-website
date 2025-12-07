# EndoGuard AI Testing Guide for Owner

**Document Version:** 1.0  
**Last Updated:** December 7, 2025  
**Purpose:** Step-by-step guide for testing the AI-powered EndoGuard assessment system

---

## Overview

EndoGuard now uses **genuine GPT-4 AI analysis** to analyze symptoms, lifestyle factors, and hormonal patterns. This guide will help you test the AI system and understand what happens behind the scenes for your YC interview preparation.

---

## Quick Access URLs

**Production Website:** https://www.nexusbiomedical.ai  
**EndoGuard Assessment:** https://www.nexusbiomedical.ai/endoguard/assessment  
**Spanish Version:** https://www.nexusbiomedical.ai/es/endoguard

---

## Testing Steps

### Step 1: Access the Assessment

1. Navigate to https://www.nexusbiomedical.ai
2. Click **"Get Started"** or **"Start Free Assessment"** on the EndoGuard card
3. You will be taken to the assessment page (no login required for testing)

### Step 2: Complete the Assessment

Fill out all 6 steps with realistic data. Here's a recommended test scenario:

**Step 1: Basic Information**
- Age: 35
- Biological Sex: Female
- Height: 5'6"
- Weight: 150 lbs

**Step 2: Symptoms (Select Multiple)**
- Fatigue or low energy
- Difficulty losing weight
- Irregular menstrual cycles
- Mood swings or irritability
- Brain fog or difficulty concentrating
- Hair thinning or loss

**Step 3: Lifestyle Factors**
- Diet Quality: 6/10
- Exercise Frequency: 3 times per week
- Sleep Quality: 5/10
- Stress Level: 7/10

**Step 4: EDC Exposure**
- Plastic Use: Frequently use plastic containers
- Food Sources: Mix of organic and conventional
- Water Source: Tap water (unfiltered)
- Occupational Exposure: Office environment

**Step 5: Health History**
- Previous diagnosis: None
- Current medications: None
- Family history: Thyroid issues (mother)

**Step 6: Review & Submit**
- Review your answers
- Click **"Complete Assessment"**

### Step 3: Wait for AI Analysis

After clicking "Complete Assessment," you'll see a loading screen with messages like:

- "Analyzing your symptoms..."
- "Generating AI-powered insights..."
- "Creating personalized recommendations..."

**Expected Wait Time:** 20-30 seconds (this is GPT-4 processing your data in real-time)

### Step 4: Review AI Results

The results page will display multiple sections. Look for the **purple gradient AI section** labeled:

**"🤖 AI-Powered Clinical Analysis (GPT-4)"**

This section contains:

1. **Clinical Reasoning** - GPT-4's analysis of your symptom patterns
2. **Confidence Score** - How confident the AI is in its analysis (e.g., "80% confidence")
3. **Identified Hormone Systems** - Which systems are affected (e.g., "Reproductive, Thyroid, Metabolic")
4. **Personalized Lifestyle Recommendations** - 4-6 specific actions tailored to your symptoms
5. **Supplement Recommendations** - Evidence-based supplements with dosages and cautions
6. **EDC Reduction Actions** - Specific steps to reduce endocrine disruptor exposure

### Step 5: Verify AI is Real (Not Hardcoded)

To prove the AI is genuinely analyzing your data and not showing hardcoded responses:

**Test 1: Different Symptoms**
- Complete the assessment again with DIFFERENT symptoms (e.g., select "Cold intolerance" and "Dry skin" instead of "Fatigue")
- The AI analysis should be COMPLETELY DIFFERENT

**Test 2: Male vs Female**
- Change biological sex to "Male" and select male-specific symptoms (e.g., "Erectile dysfunction," "Decreased muscle mass")
- The AI should identify different hormone systems (e.g., "Reproductive - Testosterone deficiency")

**Test 3: Severity Variation**
- Complete assessment with only 2-3 mild symptoms
- Complete assessment with 8-10 severe symptoms
- The AI confidence scores and recommendations should vary significantly

---

## What to Look For (YC Interview Prep)

### 1. AI Clinical Reasoning Quality

**Good AI Response Example:**
> "Based on the constellation of symptoms including fatigue, weight gain resistance, irregular cycles, and cold intolerance, the pattern suggests potential hypothyroidism with possible estrogen dominance. The combination of these symptoms, particularly with family history of thyroid issues, warrants thyroid function testing (TSH, Free T4, Free T3) and sex hormone evaluation."

**What Makes This Good:**
- Connects multiple symptoms into a pattern
- References medical terminology correctly
- Suggests appropriate next steps
- Considers family history

### 2. Personalized Recommendations

The AI should generate recommendations that are:
- **Specific** - Not generic advice like "eat healthy"
- **Contextual** - Based on YOUR specific symptoms and lifestyle
- **Actionable** - Clear steps you can take immediately
- **Evidence-based** - References medical research when appropriate

**Example:**
> "Given your reported stress level of 7/10 and cortisol-related symptoms, implement daily meditation (10-15 minutes) or deep breathing exercises. Research shows mindfulness practices can reduce cortisol levels by 20-30% within 8 weeks."

### 3. Supplement Recommendations

Look for:
- **Specific dosages** (e.g., "Vitamin D3: 2000-4000 IU daily")
- **Cautions** (e.g., "Consult healthcare provider if taking blood thinners")
- **Timing** (e.g., "Take with food for better absorption")
- **Quality notes** (e.g., "Choose methylated B12 for better bioavailability")

---

## Testing Spanish Language Support

### Step 1: Switch to Spanish

1. Click the language toggle in the header (EN | **ES**)
2. Navigate to https://www.nexusbiomedical.ai/es/endoguard
3. Complete the assessment in Spanish

### Step 2: Verify AI Responses

The AI analysis should be generated in **Spanish**, including:
- Clinical reasoning (in Spanish)
- Lifestyle recommendations (in Spanish)
- Supplement recommendations (in Spanish)
- EDC reduction actions (in Spanish)

**Note:** The AI uses the same GPT-4 model but generates responses in the user's selected language.

---

## Common Issues & Troubleshooting

### Issue 1: "Assessment Failed" Error

**Cause:** OpenAI API key not configured or rate limit exceeded  
**Solution:** Check Vercel environment variables for `OPENAI_API_KEY`

### Issue 2: AI Section Not Showing

**Cause:** Assessment completed before AI integration was deployed  
**Solution:** Complete a NEW assessment after deployment

### Issue 3: AI Responses Seem Generic

**Cause:** Insufficient symptom data provided  
**Solution:** Select at least 5-6 symptoms and provide detailed lifestyle information

### Issue 4: Long Wait Time (>60 seconds)

**Cause:** OpenAI API slowness or timeout  
**Solution:** Refresh page and try again. System has 25-second timeout with graceful fallback.

---

## Behind the Scenes: How AI Works

### 1. Data Collection

When you complete the assessment, the system collects:
- Demographics (age, sex, BMI)
- Selected symptoms (categorized by hormone system)
- Lifestyle factors (diet, exercise, sleep, stress)
- EDC exposure levels (plastic use, food sources, water quality)
- Health history (previous diagnoses, medications, family history)

### 2. AI Processing

The data is sent to GPT-4 with a specialized medical prompt that includes:

**System Prompt:**
> "You are a clinical hormone health specialist analyzing patient symptom patterns. Provide evidence-based insights about potential hormonal imbalances based on symptoms, lifestyle factors, and EDC exposure. Focus on thyroid, cortisol, reproductive, and metabolic health."

**User Prompt (Example):**
> "Patient: 35-year-old female, BMI 24.5. Symptoms: fatigue, weight gain resistance, irregular cycles, mood swings, brain fog, hair thinning. Lifestyle: moderate diet quality (6/10), exercises 3x/week, poor sleep (5/10), high stress (7/10). EDC exposure: frequent plastic use, mixed organic/conventional food, unfiltered tap water. Family history: maternal thyroid issues. Analyze symptom patterns and provide clinical reasoning."

### 3. AI Response Generation

GPT-4 generates three separate analyses:

**A. Symptom Pattern Analysis**
- Identifies likely hormonal imbalances
- Provides clinical reasoning
- Assigns confidence score (0-100%)
- Lists affected hormone systems

**B. Personalized Recommendations**
- 4-6 lifestyle modifications specific to symptoms
- 2-4 supplement recommendations with dosages
- 3-5 EDC reduction actions
- All tailored to the individual's data

**C. Test Rationale** (if applicable)
- Explains WHY specific lab tests are recommended
- Connects symptoms to biomarkers
- Provides expected findings

### 4. Response Integration

The AI-generated insights are combined with the rule-based risk scoring to create a comprehensive assessment:

- **Risk Score (0-100):** Calculated using weighted algorithm (40% symptoms, 20% duration, 15% stress, 15% lifestyle, 10% EDC)
- **AI Clinical Analysis:** GPT-4 generated insights
- **Test Recommendations:** Hybrid of rule-based + AI rationale
- **Personalized Action Plan:** AI-generated recommendations

---

## YC Interview Talking Points

### What Makes EndoGuard's AI Unique

**1. Hybrid Intelligence**
- Combines rule-based medical algorithms with GPT-4 AI analysis
- Rule-based scoring ensures clinical validity
- AI provides personalization and contextual insights

**2. Evidence-Based Prompts**
- AI prompts are designed by medical professionals
- Focus on hormone systems (thyroid, cortisol, reproductive, metabolic)
- Trained to reference medical literature and research

**3. Bilingual Support**
- Same AI model generates insights in English or Spanish
- Addresses healthcare access barriers for Hispanic populations
- First-mover advantage in bilingual AI health platforms

**4. Privacy-First Design**
- No patient names or identifiable information sent to AI
- Pseudonymous assessment data only
- HIPAA-ready infrastructure (not a covered entity)

### How to Explain the AI Architecture

**Simple Explanation:**
> "EndoGuard uses GPT-4 to analyze symptom patterns and generate personalized hormone health insights. When a user completes our assessment, we send their anonymized symptoms, lifestyle factors, and EDC exposure data to OpenAI's API with a specialized medical prompt. GPT-4 identifies potential hormonal imbalances, explains the clinical reasoning, and generates tailored recommendations. This happens in real-time, taking about 25 seconds per assessment."

**Technical Explanation:**
> "We've built a three-layer AI architecture: (1) Data normalization layer that structures user input into medical categories, (2) GPT-4 analysis layer with specialized prompts for symptom pattern recognition and recommendation generation, and (3) Integration layer that combines AI insights with our rule-based risk scoring algorithm. The system uses OpenAI's GPT-4 API with temperature 0.7 for balanced creativity and accuracy, and includes fallback mechanisms for API failures."

### Addressing Potential Questions

**Q: How do you ensure AI accuracy?**
> "We use a hybrid approach. Our rule-based algorithm (validated against medical literature) calculates the risk score, while GPT-4 provides contextual analysis and personalization. We also include medical disclaimers and encourage users to consult healthcare providers. In the future, we plan to validate AI recommendations against clinical outcomes."

**Q: What if OpenAI's API goes down?**
> "We have graceful degradation. If the AI fails, users still receive their risk score, test recommendations, and rule-based guidance. The AI insights are an enhancement, not a dependency. We also have 25-second timeouts and error handling to ensure the user experience isn't disrupted."

**Q: How do you prevent hallucinations?**
> "We use structured prompts with clear medical guidelines, temperature settings that balance creativity with accuracy, and we never ask the AI to diagnose conditions—only to analyze patterns and suggest next steps. We also include disclaimers that AI insights are not medical advice."

**Q: Can you show me the AI in action?**
> "Absolutely. Let me complete a quick assessment right now and show you the AI-generated insights. You'll see the clinical reasoning, confidence scores, and personalized recommendations appear in real-time."

---

## Next Steps After Testing

### 1. Document Your Findings

Create a simple test log:
- Date/time of test
- Symptoms selected
- AI insights received
- Quality assessment (1-10)
- Any issues encountered

### 2. Prepare Demo Scenarios

Create 3-4 pre-filled assessment scenarios for YC demo:
- **Scenario 1:** PCOS (polycystic ovary syndrome) symptoms
- **Scenario 2:** Hypothyroidism symptoms
- **Scenario 3:** Perimenopause symptoms
- **Scenario 4:** Male low testosterone symptoms

### 3. Practice Your Pitch

Be ready to:
- Explain the AI architecture in 60 seconds
- Show a live demo of the assessment
- Discuss how AI differentiates you from competitors
- Address concerns about AI accuracy and safety

### 4. Update YC Application

Add specific details:
- "Uses GPT-4 for real-time symptom pattern analysis"
- "Generates personalized recommendations in 25 seconds"
- "Bilingual AI support (English/Spanish)"
- "Hybrid intelligence: rule-based + AI"

---

## Support & Questions

If you encounter any issues during testing or have questions about the AI system:

1. Check the **AI_Implementation_Documentation.md** file for technical details
2. Review the test suite results in **tests/ai-endoguard.test.js**
3. Check Vercel logs for API errors or timeouts
4. Contact support at support@nexusbiomedical.ai

---

**Good luck with your YC application! The AI system is production-ready and defensible.** 🚀
