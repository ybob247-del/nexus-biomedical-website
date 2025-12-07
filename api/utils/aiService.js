/**
 * AI Service - GPT-4 Integration for EndoGuard
 * Provides genuine AI-powered hormone health analysis
 */

import https from 'https';

/**
 * Call OpenAI GPT-4 API using raw HTTPS
 * (Bypasses SDK issues with project-scoped keys)
 */
async function callOpenAI(messages, options = {}) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  const requestBody = JSON.stringify({
    model: options.model || 'gpt-4',
    messages: messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.maxTokens || 1500,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    }, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (response.error) {
            reject(new Error(`OpenAI API Error: ${response.error.message}`));
            return;
          }

          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse OpenAI response: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`OpenAI API request failed: ${error.message}`));
    });

    req.write(requestBody);
    req.end();
  });
}

/**
 * AI-Powered Symptom Pattern Analysis
 * Uses GPT-4 to identify hormone patterns from symptoms
 */
export async function analyzeSymptomPatterns(symptoms, demographics) {
  const { age, gender, biologicalSex } = demographics;
  
  const systemPrompt = `You are an expert endocrinologist analyzing hormone health symptoms. Provide clinical insights based on symptom patterns.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations outside the JSON structure.

Your response must be a JSON object with this exact structure:
{
  "primaryPattern": "string describing the dominant hormone pattern",
  "affectedSystems": ["array", "of", "hormone", "systems"],
  "clinicalReasoning": "detailed explanation of why these symptoms suggest this pattern",
  "confidence": number between 0 and 1,
  "redFlags": ["array of concerning symptoms requiring immediate medical attention"],
  "differentialDiagnosis": ["array of possible conditions to rule out"]
}`;

  const userPrompt = `Analyze these hormone health symptoms for a ${age}-year-old ${biologicalSex || gender}:

Symptoms: ${symptoms.join(', ')}

Provide AI-powered pattern recognition to identify the most likely hormone imbalance pattern and affected systems.`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.3, maxTokens: 800 });

    const content = response.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('[AI Service] Symptom pattern analysis failed:', error);
    // Fallback to indicate AI attempted but failed
    return {
      primaryPattern: 'Unable to generate AI analysis',
      affectedSystems: [],
      clinicalReasoning: 'AI analysis unavailable - using rule-based assessment',
      confidence: 0,
      redFlags: [],
      differentialDiagnosis: [],
      aiError: error.message
    };
  }
}

/**
 * AI-Powered Personalized Recommendations
 * Uses GPT-4 to generate tailored health recommendations
 */
export async function generatePersonalizedRecommendations(assessmentData) {
  const { symptoms, edcRisk, lifestyle, demographics, hormonePattern } = assessmentData;
  
  const systemPrompt = `You are a functional medicine practitioner specializing in hormone health. Generate personalized, evidence-based recommendations.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks, no explanations outside the JSON structure.

Your response must be a JSON object with this exact structure:
{
  "lifestyle": [
    {
      "category": "string (diet/exercise/sleep/stress)",
      "recommendation": "specific actionable advice",
      "rationale": "why this helps hormone health",
      "priority": "high/medium/low",
      "timeframe": "when to expect results"
    }
  ],
  "supplements": [
    {
      "supplement": "name",
      "dosage": "recommended amount",
      "rationale": "hormone health benefit",
      "cautions": "any warnings or contraindications"
    }
  ],
  "edcReduction": [
    {
      "action": "specific change to make",
      "impact": "how this reduces EDC exposure",
      "priority": "high/medium/low"
    }
  ],
  "nextSteps": [
    "prioritized action items in order"
  ]
}`;

  const userPrompt = `Generate personalized recommendations for:

Demographics: ${demographics.age}yo ${demographics.biologicalSex || demographics.gender}
Symptoms: ${symptoms.join(', ')}
EDC Risk Score: ${edcRisk.riskScore}/100
Lifestyle: Sleep ${lifestyle.sleepQuality}, Exercise ${lifestyle.exerciseFrequency}, Diet ${lifestyle.dietQuality}, Stress ${lifestyle.stressLevel}/10
AI-Identified Pattern: ${hormonePattern?.primaryPattern || 'Not analyzed'}

Provide actionable, evidence-based recommendations tailored to this individual's specific situation.`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.7, maxTokens: 1200 });

    const content = response.choices[0].message.content.trim();
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('[AI Service] Recommendation generation failed:', error);
    return {
      lifestyle: [],
      supplements: [],
      edcReduction: [],
      nextSteps: [],
      aiError: error.message
    };
  }
}

/**
 * AI-Powered Test Recommendation Reasoning
 * Uses GPT-4 to explain WHY specific tests are recommended
 */
export async function generateTestRationale(symptoms, hormonePattern, demographics) {
  const systemPrompt = `You are a clinical pathologist explaining lab test recommendations. Provide clear, evidence-based rationale.

IMPORTANT: Respond ONLY with valid JSON. No markdown, no code blocks.

Your response must be a JSON object with this exact structure:
{
  "testingStrategy": "overall approach to testing",
  "priorityTests": [
    {
      "testName": "name of test panel",
      "markers": ["specific", "biomarkers"],
      "clinicalRationale": "why these markers based on symptoms",
      "expectedFindings": "what results might show",
      "priority": "urgent/high/medium/low"
    }
  ],
  "timingRecommendations": "when to test (fasting, time of day, menstrual cycle considerations)",
  "interpretationGuidance": "how to understand results"
}`;

  const userPrompt = `Recommend lab tests for:

Patient: ${demographics.age}yo ${demographics.biologicalSex || demographics.gender}
Symptoms: ${symptoms.join(', ')}
AI-Identified Pattern: ${hormonePattern?.primaryPattern || 'Unknown'}
Affected Systems: ${hormonePattern?.affectedSystems?.join(', ') || 'Unknown'}

Explain which lab tests are most important and why, based on the symptom pattern.`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], { temperature: 0.4, maxTokens: 1000 });

    const content = response.choices[0].message.content.trim();
    const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    return JSON.parse(jsonContent);
  } catch (error) {
    console.error('[AI Service] Test rationale generation failed:', error);
    return {
      testingStrategy: 'Standard hormone panel approach',
      priorityTests: [],
      timingRecommendations: 'Fasting morning draw recommended',
      interpretationGuidance: 'Consult with healthcare provider',
      aiError: error.message
    };
  }
}

export default {
  analyzeSymptomPatterns,
  generatePersonalizedRecommendations,
  generateTestRationale
};
