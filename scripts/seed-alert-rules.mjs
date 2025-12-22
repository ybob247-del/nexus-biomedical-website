#!/usr/bin/env node
/**
 * Seed Alert Rules Database
 * Intelligent default rules for care gap detection
 */

import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const rules = [
  // TIME-BASED ALERTS
  {
    rule_name: 'Missed 30-Day Follow-Up',
    alert_type: 'missed_followup',
    alert_priority: 'medium',
    condition_type: 'time_based',
    condition_criteria: JSON.stringify({
      days_since_last_assessment: 30,
      has_active_protocol: true
    }),
    alert_title_template: 'Patient {{patient_name}} missed 30-day follow-up',
    alert_description_template: 'Patient has not completed a follow-up assessment in 30 days despite having an active treatment protocol.',
    recommended_actions_template: JSON.stringify([
      'Send follow-up reminder to patient',
      'Schedule follow-up appointment',
      'Check in on protocol adherence',
      'Review treatment progress'
    ]),
    is_active: true,
    check_frequency_days: 1
  },

  {
    rule_name: 'Missed 60-Day Follow-Up',
    alert_type: 'missed_followup',
    alert_priority: 'high',
    condition_type: 'time_based',
    condition_criteria: JSON.stringify({
      days_since_last_assessment: 60,
      has_active_protocol: true
    }),
    alert_title_template: 'URGENT: Patient {{patient_name}} missed 60-day follow-up',
    alert_description_template: 'Patient has not completed a follow-up assessment in 60 days. Risk of treatment abandonment.',
    recommended_actions_template: JSON.stringify([
      'Contact patient immediately',
      'Assess barriers to follow-up',
      'Consider protocol modification',
      'Evaluate if patient needs additional support'
    ]),
    is_active: true,
    check_frequency_days: 1
  },

  {
    rule_name: 'No Progress Tracking for 14 Days',
    alert_type: 'no_progress_tracking',
    alert_priority: 'low',
    condition_type: 'time_based',
    condition_criteria: JSON.stringify({
      days_since_last_progress_entry: 14,
      has_active_protocol: true
    }),
    alert_title_template: 'Patient {{patient_name}} not tracking progress',
    alert_description_template: 'Patient has not logged any progress tracking entries in 14 days.',
    recommended_actions_template: JSON.stringify([
      'Remind patient to log symptoms',
      'Review progress tracking instructions',
      'Assess if tracking method is too burdensome'
    ]),
    is_active: true,
    check_frequency_days: 7
  },

  // SYMPTOM-BASED ALERTS
  {
    rule_name: 'Declining Symptom Scores',
    alert_type: 'declining_symptoms',
    alert_priority: 'high',
    condition_type: 'symptom_based',
    condition_criteria: JSON.stringify({
      symptom_score_increase: 20, // 20+ point increase
      timeframe_days: 30
    }),
    alert_title_template: 'Patient {{patient_name}} symptoms worsening',
    alert_description_template: 'Patient symptom scores have increased by {{score_change}} points in the last 30 days, indicating worsening condition.',
    recommended_actions_template: JSON.stringify([
      'Schedule urgent follow-up',
      'Review current protocol effectiveness',
      'Assess for new EDC exposures',
      'Consider protocol modification or escalation',
      'Rule out other medical conditions'
    ]),
    is_active: true,
    check_frequency_days: 1
  },

  {
    rule_name: 'No Symptom Improvement After 8 Weeks',
    alert_type: 'treatment_goal_not_met',
    alert_priority: 'medium',
    condition_type: 'symptom_based',
    condition_criteria: JSON.stringify({
      weeks_on_protocol: 8,
      symptom_improvement_percentage: 10, // Less than 10% improvement
      comparison: 'less_than'
    }),
    alert_title_template: 'Patient {{patient_name}} not responding to treatment',
    alert_description_template: 'Patient has been on protocol for 8 weeks with less than 10% symptom improvement. Protocol may need adjustment.',
    recommended_actions_template: JSON.stringify([
      'Review protocol adherence',
      'Assess for barriers to treatment',
      'Consider alternative protocol',
      'Check for underlying conditions',
      'Review lab results if available'
    ]),
    is_active: true,
    check_frequency_days: 7
  },

  {
    rule_name: 'Severe Symptom Score',
    alert_type: 'high_risk_patient',
    alert_priority: 'urgent',
    condition_type: 'symptom_based',
    condition_criteria: JSON.stringify({
      symptom_score: 80, // Score above 80
      comparison: 'greater_than'
    }),
    alert_title_template: 'URGENT: Patient {{patient_name}} has severe symptoms',
    alert_description_template: 'Patient symptom score is {{symptom_score}}, indicating severe condition requiring immediate attention.',
    recommended_actions_template: JSON.stringify([
      'Contact patient within 24 hours',
      'Assess need for urgent medical evaluation',
      'Review for red flag symptoms',
      'Consider referral to specialist',
      'Ensure patient safety'
    ]),
    is_active: true,
    check_frequency_days: 1
  },

  // LAB-BASED ALERTS
  {
    rule_name: 'Abnormal TSH Result',
    alert_type: 'lab_abnormality',
    alert_priority: 'medium',
    condition_type: 'lab_based',
    condition_criteria: JSON.stringify({
      lab_name: 'TSH',
      abnormal_range: { low: 0.5, high: 4.5 },
      unit: 'mIU/L'
    }),
    alert_title_template: 'Abnormal TSH for patient {{patient_name}}',
    alert_description_template: 'Patient TSH is {{tsh_value}} mIU/L (normal 0.5-4.5). Thyroid function needs evaluation.',
    recommended_actions_template: JSON.stringify([
      'Review Free T4 and Free T3',
      'Check TPO antibodies if not done',
      'Assess thyroid symptoms',
      'Consider thyroid medication adjustment',
      'Schedule follow-up labs in 6-8 weeks'
    ]),
    is_active: true,
    check_frequency_days: 1
  },

  {
    rule_name: 'Prediabetic Glucose',
    alert_type: 'lab_abnormality',
    alert_priority: 'medium',
    condition_type: 'lab_based',
    condition_criteria: JSON.stringify({
      lab_name: 'Fasting Glucose',
      abnormal_range: { low: 100, high: 125 },
      unit: 'mg/dL'
    }),
    alert_title_template: 'Patient {{patient_name}} has prediabetic glucose',
    alert_description_template: 'Patient fasting glucose is {{glucose_value}} mg/dL, indicating prediabetes. Intervention needed to prevent diabetes.',
    recommended_actions_template: JSON.stringify([
      'Check HbA1c and fasting insulin',
      'Initiate insulin resistance protocol',
      'Recommend low-carb diet',
      'Encourage exercise program',
      'Consider metformin or berberine',
      'Recheck labs in 3 months'
    ]),
    is_active: true,
    check_frequency_days: 1
  },

  {
    rule_name: 'Diabetic Glucose',
    alert_type: 'lab_abnormality',
    alert_priority: 'high',
    condition_type: 'lab_based',
    condition_criteria: JSON.stringify({
      lab_name: 'Fasting Glucose',
      abnormal_range: { low: 126, high: 999 },
      unit: 'mg/dL'
    }),
    alert_title_template: 'URGENT: Patient {{patient_name}} has diabetic glucose',
    alert_description_template: 'Patient fasting glucose is {{glucose_value}} mg/dL, meeting criteria for diabetes. Immediate intervention required.',
    recommended_actions_template: JSON.stringify([
      'Check HbA1c immediately',
      'Initiate diabetes management protocol',
      'Consider medication (metformin, GLP-1)',
      'Refer to endocrinologist if severe',
      'Screen for diabetes complications',
      'Intensive lifestyle counseling'
    ]),
    is_active: true,
    check_frequency_days: 1
  },

  {
    rule_name: 'Low Vitamin D',
    alert_type: 'lab_abnormality',
    alert_priority: 'low',
    condition_type: 'lab_based',
    condition_criteria: JSON.stringify({
      lab_name: 'Vitamin D',
      abnormal_range: { low: 0, high: 30 },
      unit: 'ng/mL'
    }),
    alert_title_template: 'Patient {{patient_name}} has low Vitamin D',
    alert_description_template: 'Patient Vitamin D is {{vitamin_d_value}} ng/mL (optimal >40). Supplementation recommended.',
    recommended_actions_template: JSON.stringify([
      'Recommend Vitamin D3 2000-5000 IU daily',
      'Encourage sun exposure',
      'Recheck level in 3 months',
      'Assess for symptoms of deficiency'
    ]),
    is_active: true,
    check_frequency_days: 7
  },

  // ADHERENCE-BASED ALERTS
  {
    rule_name: 'Low Protocol Adherence',
    alert_type: 'protocol_non_adherence',
    alert_priority: 'medium',
    condition_type: 'adherence_based',
    condition_criteria: JSON.stringify({
      adherence_percentage: 60, // Less than 60%
      comparison: 'less_than',
      timeframe_days: 30
    }),
    alert_title_template: 'Patient {{patient_name}} has low protocol adherence',
    alert_description_template: 'Patient protocol adherence is {{adherence_percentage}}% over the last 30 days. Treatment effectiveness may be compromised.',
    recommended_actions_template: JSON.stringify([
      'Discuss barriers to adherence',
      'Simplify protocol if too complex',
      'Assess for side effects',
      'Provide additional education',
      'Consider alternative approaches'
    ]),
    is_active: true,
    check_frequency_days: 7
  },

  {
    rule_name: 'Very Low Protocol Adherence',
    alert_type: 'protocol_non_adherence',
    alert_priority: 'high',
    condition_type: 'adherence_based',
    condition_criteria: JSON.stringify({
      adherence_percentage: 30, // Less than 30%
      comparison: 'less_than',
      timeframe_days: 30
    }),
    alert_title_template: 'URGENT: Patient {{patient_name}} not following protocol',
    alert_description_template: 'Patient protocol adherence is only {{adherence_percentage}}%. Treatment is likely ineffective. Immediate intervention needed.',
    recommended_actions_template: JSON.stringify([
      'Schedule urgent consultation',
      'Assess patient motivation',
      'Identify major barriers',
      'Consider if protocol is appropriate',
      'May need to pause and reassess'
    ]),
    is_active: true,
    check_frequency_days: 7
  },

  // OUTCOME-BASED ALERTS
  {
    rule_name: 'Treatment Goal Not Met at 12 Weeks',
    alert_type: 'treatment_goal_not_met',
    alert_priority: 'medium',
    condition_type: 'outcome_based',
    condition_criteria: JSON.stringify({
      weeks_on_protocol: 12,
      goal_achievement_percentage: 50, // Less than 50% of goals met
      comparison: 'less_than'
    }),
    alert_title_template: 'Patient {{patient_name}} not meeting treatment goals',
    alert_description_template: 'Patient has achieved only {{goal_achievement_percentage}}% of treatment goals after 12 weeks. Protocol review needed.',
    recommended_actions_template: JSON.stringify([
      'Review treatment goals - are they realistic?',
      'Assess protocol effectiveness',
      'Check adherence and barriers',
      'Consider protocol modification',
      'Re-evaluate diagnosis'
    ]),
    is_active: true,
    check_frequency_days: 7
  },

  {
    rule_name: 'Excellent Progress - Celebrate Success',
    alert_type: 'treatment_goal_not_met', // Reusing type but positive
    alert_priority: 'low',
    condition_type: 'outcome_based',
    condition_criteria: JSON.stringify({
      symptom_improvement_percentage: 50, // 50%+ improvement
      comparison: 'greater_than',
      timeframe_weeks: 8
    }),
    alert_title_template: 'Patient {{patient_name}} showing excellent progress!',
    alert_description_template: 'Patient has achieved {{symptom_improvement_percentage}}% symptom improvement in 8 weeks. Great success!',
    recommended_actions_template: JSON.stringify([
      'Congratulate patient on progress',
      'Reinforce successful behaviors',
      'Continue current protocol',
      'Consider patient testimonial',
      'Plan for maintenance phase'
    ]),
    is_active: true,
    check_frequency_days: 7
  }
];

async function seedRules() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  console.log('Seeding alert rules database...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const rule of rules) {
    try {
      await connection.query(
        `INSERT INTO alert_rules (
          rule_name, alert_type, alert_priority, condition_type, condition_criteria,
          alert_title_template, alert_description_template, recommended_actions_template,
          is_active, check_frequency_days
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          rule.rule_name,
          rule.alert_type,
          rule.alert_priority,
          rule.condition_type,
          rule.condition_criteria,
          rule.alert_title_template,
          rule.alert_description_template,
          rule.recommended_actions_template,
          rule.is_active,
          rule.check_frequency_days
        ]
      );
      console.log(`✓ Added: ${rule.rule_name}`);
      successCount++;
    } catch (error) {
      console.error(`✗ Error adding ${rule.rule_name}:`, error.message);
      errorCount++;
    }
  }
  
  await connection.end();
  
  console.log(`\n========================================`);
  console.log(`ALERT RULES SEEDING COMPLETE`);
  console.log(`========================================`);
  console.log(`Successfully added: ${successCount} rules`);
  console.log(`Errors: ${errorCount}`);
  console.log(`========================================\n`);
}

seedRules().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
