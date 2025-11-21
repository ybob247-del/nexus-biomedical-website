/**
 * OpenAI Service
 * Shared service for all platforms to interact with OpenAI API
 */

import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Test OpenAI API connectivity
 */
export async function testOpenAIConnection() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "API connection successful"' }],
      max_tokens: 10
    });

    return {
      success: true,
      message: response.choices[0].message.content
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Enhanced drug interaction analysis for RxGuard™
 */
export async function analyzeDrugInteractions(drugs, interactions) {
  const prompt = `You are a clinical pharmacist AI assistant. Analyze the following drug interaction data and provide:
1. A clear, patient-friendly explanation of the interaction risks
2. Specific recommendations for the patient
3. Alternative medications to consider (if applicable)
4. When to seek immediate medical attention

Drugs: ${drugs.join(', ')}

Interaction Data:
${JSON.stringify(interactions, null, 2)}

Provide a concise, actionable response in plain language that a patient can understand.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a clinical pharmacist AI providing drug safety guidance. Always emphasize consulting with healthcare providers.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI analysis unavailable. Please consult with your pharmacist or physician.';
  }
}

/**
 * Personalized hormone health recommendations for EndoGuard™
 */
export async function generateHormoneRecommendations(assessmentData, results) {
  const prompt = `You are a women's health specialist AI. Based on this hormone health assessment, provide personalized recommendations:

Assessment Data:
- Symptoms: ${assessmentData.symptoms?.join(', ') || 'None reported'}
- EDC Exposure Score: ${results.edcScore}/100
- Hormone System Affected: ${results.hormoneSystem}
- Risk Level: ${results.riskLevel}

Provide:
1. Lifestyle modifications (diet, exercise, stress management)
2. EDC avoidance strategies specific to their exposure sources
3. Supplement considerations (mention consulting healthcare provider)
4. When to seek medical evaluation
5. Timeline for expected improvements

Keep recommendations practical, evidence-based, and empowering.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a women\'s health specialist providing evidence-based hormone health guidance.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.4
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI recommendations unavailable. Please consult with your healthcare provider.';
  }
}

/**
 * Caregiver support and care planning for ElderWatch™
 */
export async function generateCarePlan(seniorData, assessment) {
  const prompt = `You are a geriatric care specialist AI. Create a personalized care plan for this senior:

Senior Information:
- Age: ${seniorData.age}
- Mobility Level: ${seniorData.mobilityLevel}
- Cognitive Status: ${seniorData.cognitiveStatus}
- Fall Risk: ${assessment.fallRisk.level}
- Medical Conditions: ${seniorData.medicalConditions?.join(', ') || 'None reported'}

Assessment Results:
- Fall Risk Score: ${assessment.fallRisk.score}/100
- Cognitive Score: ${assessment.cognitiveHealth.score}/100
- Key Concerns: ${assessment.fallRisk.factors.join(', ')}

Provide a comprehensive care plan including:
1. Immediate priorities
2. Fall prevention strategies
3. Cognitive support activities
4. Medication management tips
5. Caregiver self-care recommendations
6. Resources and support services

Make it actionable and compassionate.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a geriatric care specialist providing compassionate, evidence-based care guidance.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 700,
      temperature: 0.4
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI care plan unavailable. Please consult with a geriatric care specialist.';
  }
}

/**
 * Parent education for PediCalc Pro™
 */
export async function explainPediatricDosing(medication, dosageResult, childAge) {
  const prompt = `You are a pediatric pharmacist AI. Explain this medication dosing to a parent in simple, reassuring terms:

Medication: ${medication}
Child Age: ${childAge} months (${(childAge / 12).toFixed(1)} years)
Calculated Dose: ${dosageResult.dosing.recommendedDose} mg
Frequency: ${dosageResult.dosing.frequency}
Liquid Volume: ${dosageResult.dosing.volumePerDose || 'N/A'}

Safety Checks:
- Age appropriate: ${dosageResult.safety.ageAppropriate ? 'Yes' : 'No'}
- Safe dose: ${dosageResult.safety.isSafe ? 'Yes' : 'No'}
- Warnings: ${dosageResult.safety.warnings.join(', ')}

Provide:
1. How to give the medication correctly
2. What to expect (how long until it works)
3. What to watch for (side effects)
4. When to call the doctor
5. Storage and handling tips

Use simple language that reduces parental anxiety while ensuring safety.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a pediatric pharmacist providing clear, reassuring medication guidance to parents.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI explanation unavailable. Please consult with your pediatrician or pharmacist.';
  }
}

/**
 * Clinical trial eligibility interpretation for ClinicalIQ™
 */
export async function interpretTrialEligibility(trial, patientProfile, matchResult) {
  const prompt = `You are a clinical research coordinator AI. Help this patient understand their clinical trial match:

Trial: ${trial.title}
Phase: ${trial.phase}
Condition: ${trial.conditions.join(', ')}

Patient Profile:
- Condition: ${patientProfile.condition}
- Age: ${patientProfile.age}
- Location: ${patientProfile.location}

Match Score: ${matchResult.matchScore}/100
Criteria Met: ${matchResult.criteriaMet.join(', ')}
Criteria Not Met: ${matchResult.criteriaNotMet.join(', ')}

Provide:
1. Why this trial might be a good match
2. What the patient needs to know about the trial
3. Questions to ask the research coordinator
4. Next steps if interested
5. Realistic expectations about participation

Be encouraging but realistic.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a clinical research coordinator helping patients understand clinical trial opportunities.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.4
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI interpretation unavailable. Please contact the trial coordinator directly.';
  }
}

/**
 * Regulatory guidance for ReguReady™
 */
export async function provideRegulatoryGuidance(deviceInfo, pathwayAssessment) {
  const prompt = `You are an FDA regulatory affairs specialist AI. Provide strategic guidance for this medical device submission:

Device: ${deviceInfo.deviceName}
Class: ${deviceInfo.deviceClass}
Intended Use: ${deviceInfo.intendedUse}

Recommended Pathway: ${pathwayAssessment.recommendedPathway}
Timeline: ${pathwayAssessment.estimatedTimeline}
Cost: ${pathwayAssessment.estimatedCost}

Provide:
1. Strategic recommendations for this pathway
2. Common pitfalls to avoid
3. Key success factors
4. When to engage with FDA (Pre-Sub meetings)
5. Resource allocation priorities

Be practical and strategic.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an FDA regulatory affairs specialist providing strategic submission guidance.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 600,
      temperature: 0.4
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI guidance unavailable. Please consult with a regulatory affairs professional.';
  }
}

/**
 * Skin condition explanation for SkinScan Pro™
 */
export async function explainSkinCondition(analysis, topPrediction) {
  const prompt = `You are a dermatologist AI. Explain this skin analysis to a patient:

Analysis Results:
- Risk Level: ${analysis.riskAssessment.overallRisk}
- Urgency: ${analysis.riskAssessment.urgency}
- ABCDE Scores: A=${analysis.abcdeAnalysis.scores.asymmetry}, B=${analysis.abcdeAnalysis.scores.border}, C=${analysis.abcdeAnalysis.scores.color}, D=${analysis.abcdeAnalysis.scores.diameter}mm, E=${analysis.abcdeAnalysis.scores.evolving}
- Concerns: ${analysis.abcdeAnalysis.concerns.join(', ')}

Most Likely Condition: ${topPrediction.name}
Category: ${topPrediction.category}
Probability: ${topPrediction.probability}%

Provide:
1. What this condition typically is
2. Why the AI flagged these concerns
3. What the patient should do next
4. Timeline for dermatologist visit
5. What to monitor before the appointment

Be clear but not alarmist. Emphasize that AI is a screening tool, not a diagnosis.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a dermatologist providing clear, balanced skin health guidance. Always emphasize professional evaluation.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'AI explanation unavailable. Please consult with a board-certified dermatologist.';
  }
}

/**
 * Universal healthcare chatbot
 */
export async function chatbotResponse(userMessage, platform, context = {}) {
  const systemPrompts = {
    rxguard: 'You are a clinical pharmacist AI assistant for RxGuard™, a drug interaction checker. Help users understand medication safety. Always recommend consulting healthcare providers.',
    endoguard: 'You are a women\'s health specialist AI for EndoGuard™, a hormone health platform. Provide evidence-based guidance on hormones and EDC exposure.',
    elderwatch: 'You are a geriatric care specialist AI for ElderWatch™. Provide compassionate guidance to caregivers of elderly patients.',
    pedicalc: 'You are a pediatric pharmacist AI for PediCalc Pro™. Help parents safely administer medications to children.',
    clinicaliq: 'You are a clinical research coordinator AI for ClinicalIQ™. Help patients understand clinical trial opportunities.',
    reguready: 'You are an FDA regulatory affairs specialist AI for ReguReady™. Guide medical device companies through regulatory pathways.',
    skinscan: 'You are a dermatologist AI for SkinScan Pro™. Help users understand skin health and when to seek professional evaluation.'
  };

  const systemPrompt = systemPrompts[platform.toLowerCase()] || 'You are a helpful healthcare AI assistant.';

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];

    // Add context if provided
    if (context.previousMessages) {
      messages.splice(1, 0, ...context.previousMessages);
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.5
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Chatbot error:', error);
    return 'I apologize, but I\'m having trouble responding right now. Please try again or contact support.';
  }
}

export default {
  testOpenAIConnection,
  analyzeDrugInteractions,
  generateHormoneRecommendations,
  generateCarePlan,
  explainPediatricDosing,
  interpretTrialEligibility,
  provideRegulatoryGuidance,
  explainSkinCondition,
  chatbotResponse
};
