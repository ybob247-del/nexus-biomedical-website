/**
 * RxGuard™ API Endpoint: Check Drug Interactions
 * Analyze interactions between multiple drugs using RxNorm and FDA data
 * 
 * POST /api/rxguard/check-interactions
 * Body: { "rxcuis": ["153165", "197361", "42347"] }
 */

import { getDrugInteractions, getDrugInfo } from '../../server/services/rxnorm.mjs';
import { analyzeInteractionRisk } from '../../server/services/openfda.mjs';
import openaiService from '../../server/services/openai-direct.mjs';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { rxcuis } = req.body;
    
    if (!rxcuis || !Array.isArray(rxcuis) || rxcuis.length < 2) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Body must contain "rxcuis" array with at least 2 drug RxCUIs' 
      });
    }
    
    if (rxcuis.length > 20) {
      return res.status(400).json({ 
        error: 'Too many drugs',
        message: 'Maximum 20 drugs can be checked at once' 
      });
    }
    
    // Get drug names for all RxCUIs
    const drugNames = [];
    const drugDetails = {};
    
    for (const rxcui of rxcuis) {
      const info = await getDrugInfo(rxcui);
      if (info) {
        drugNames.push(info.name);
        drugDetails[rxcui] = {
          rxcui,
          name: info.name,
          synonym: info.synonym
        };
      }
    }
    
    // Get interactions from RxNorm
    const rxnormInteractions = await getDrugInteractions(rxcuis);
    
    // Get real-world adverse event analysis from FDA
    const fdaRiskAnalysis = await analyzeInteractionRisk(drugNames);
    
    // Categorize interactions by severity
    const majorInteractions = [];
    const moderateInteractions = [];
    const minorInteractions = [];
    
    rxnormInteractions.forEach(interaction => {
      const severity = interaction.severity?.toLowerCase() || 'n/a';
      
      const interactionData = {
        drug1: interaction.drug1,
        drug2: interaction.drug2,
        severity: interaction.severity,
        description: interaction.description,
        source: interaction.source
      };
      
      if (severity.includes('high') || severity.includes('major') || severity.includes('contraindicated')) {
        majorInteractions.push(interactionData);
      } else if (severity.includes('moderate')) {
        moderateInteractions.push(interactionData);
      } else {
        minorInteractions.push(interactionData);
      }
    });
    
    // Calculate overall risk score
    const baseScore = fdaRiskAnalysis.riskScore || 0;
    const interactionPenalty = (majorInteractions.length * 15) + (moderateInteractions.length * 5);
    const overallRiskScore = Math.min(100, baseScore + interactionPenalty);
    
    // Determine risk level
    let riskLevel = 'LOW';
    if (overallRiskScore >= 70 || majorInteractions.length > 0) {
      riskLevel = 'HIGH';
    } else if (overallRiskScore >= 40 || moderateInteractions.length > 0) {
      riskLevel = 'MODERATE';
    }
    
    // Generate AI-powered clinical insights
    let aiInsights = null;
    try {
      const medications = Object.values(drugDetails).map(d => ({ name: d.name }));
      aiInsights = await openaiService.analyzeDrugInteractions(medications);
    } catch (aiError) {
      console.warn('AI analysis failed:', aiError.message);
      // Continue without AI insights
    }
    
    // Generate recommendations
    const recommendations = [];
    
    if (majorInteractions.length > 0) {
      recommendations.push({
        priority: 'URGENT',
        message: `${majorInteractions.length} major drug interaction(s) detected. Consult healthcare provider immediately.`,
        action: 'Contact your doctor or pharmacist before taking these medications together.'
      });
    }
    
    if (moderateInteractions.length > 0) {
      recommendations.push({
        priority: 'IMPORTANT',
        message: `${moderateInteractions.length} moderate interaction(s) detected. Medical supervision recommended.`,
        action: 'Discuss these interactions with your healthcare provider.'
      });
    }
    
    if (fdaRiskAnalysis.totalReports > 50) {
      recommendations.push({
        priority: 'INFO',
        message: `${fdaRiskAnalysis.totalReports} adverse event reports found for this drug combination in FDA database.`,
        action: 'Review the most common reported reactions below.'
      });
    }
    
    if (recommendations.length === 0) {
      recommendations.push({
        priority: 'INFO',
        message: 'No major interactions detected in our database.',
        action: 'Always consult your healthcare provider about your medications.'
      });
    }
    
    return res.status(200).json({
      success: true,
      analysis: {
        drugsChecked: rxcuis.length,
        drugDetails,
        interactionsSummary: {
          total: rxnormInteractions.length,
          major: majorInteractions.length,
          moderate: moderateInteractions.length,
          minor: minorInteractions.length
        },
        riskAssessment: {
          overallScore: overallRiskScore,
          riskLevel,
          fdaReports: fdaRiskAnalysis.totalReports,
          seriousReports: fdaRiskAnalysis.seriousCount,
          hospitalizations: fdaRiskAnalysis.hospitalizationCount
        },
        interactions: {
          major: majorInteractions,
          moderate: moderateInteractions,
          minor: minorInteractions
        },
        adverseEvents: {
          topReactions: fdaRiskAnalysis.topReactions || [],
          totalReports: fdaRiskAnalysis.totalReports || 0
        },
        recommendations,
        aiInsights: aiInsights || null
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Interaction check error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
