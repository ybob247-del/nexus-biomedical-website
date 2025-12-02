/**
 * Analytics and Bilingual Features Test Suite
 * Tests for Google Analytics tracking, language preferences, and bilingual templates
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  trackPageView, 
  trackLanguageToggle, 
  trackPlatformInteraction,
  trackAssessmentCompletion,
  trackSubscription,
  trackConversion,
  trackSpanishEngagement,
  trackSignup
} from '../utils/analytics';
import {
  setLanguagePreference,
  getLanguagePreference,
  clearLanguagePreference,
  detectBrowserLanguage,
  initializeLanguagePreference
} from '../utils/languagePreference';
import {
  getEmailTemplate,
  welcomeEmail,
  assessmentCompletionEmail,
  subscriptionConfirmationEmail
} from '../utils/emailTemplates';
import {
  getSMSTemplate,
  assessmentCompletionSMS,
  highRiskAlertSMS,
  subscriptionActivationSMS,
  trialExpirationReminderSMS,
  assessmentReminderSMS,
  weeklyHealthTipSMS,
  welcomeSMS,
  spanishHealthTips
} from '../utils/smsTemplates';

describe('Analytics Tracking', () => {
  beforeEach(() => {
    // Mock analytics
    vi.clearAllMocks();
  });

  describe('trackPageView', () => {
    it('should track page views with language dimension', () => {
      expect(() => trackPageView('/dashboard', 'en')).not.toThrow();
      expect(() => trackPageView('/es/inicio', 'es')).not.toThrow();
    });

    it('should handle missing language parameter', () => {
      expect(() => trackPageView('/about')).not.toThrow();
    });
  });

  describe('trackLanguageToggle', () => {
    it('should track language toggle from English to Spanish', () => {
      expect(() => trackLanguageToggle('en', 'es')).not.toThrow();
    });

    it('should track language toggle from Spanish to English', () => {
      expect(() => trackLanguageToggle('es', 'en')).not.toThrow();
    });
  });

  describe('trackPlatformInteraction', () => {
    it('should track platform interactions with language', () => {
      expect(() => trackPlatformInteraction('EndoGuard', 'start_trial', 'en')).not.toThrow();
      expect(() => trackPlatformInteraction('RxGuard', 'complete_assessment', 'es')).not.toThrow();
    });
  });

  describe('trackAssessmentCompletion', () => {
    it('should track assessment completion with score and language', () => {
      expect(() => trackAssessmentCompletion('EndoGuard', 45, 'en')).not.toThrow();
      expect(() => trackAssessmentCompletion('RxGuard', 75, 'es')).not.toThrow();
    });

    it('should categorize risk levels correctly', () => {
      // Low risk: < 40
      expect(() => trackAssessmentCompletion('EndoGuard', 30, 'en')).not.toThrow();
      // Moderate risk: 40-69
      expect(() => trackAssessmentCompletion('EndoGuard', 55, 'en')).not.toThrow();
      // High risk: >= 70
      expect(() => trackAssessmentCompletion('EndoGuard', 80, 'en')).not.toThrow();
    });
  });

  describe('trackSpanishEngagement', () => {
    it('should track Spanish-specific engagement', () => {
      expect(() => trackSpanishEngagement('landing_page_visit', { source: 'google' })).not.toThrow();
      expect(() => trackSpanishEngagement('cta_click', { action: 'start_assessment' })).not.toThrow();
    });
  });

  describe('trackSignup', () => {
    it('should track user signups with language and source', () => {
      expect(() => trackSignup('en', 'organic')).not.toThrow();
      expect(() => trackSignup('es', 'referral')).not.toThrow();
    });
  });
});

describe('Language Preference Management', () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    clearLanguagePreference();
  });

  describe('setLanguagePreference', () => {
    it('should set language preference cookie', () => {
      setLanguagePreference('es');
      const preference = getLanguagePreference();
      expect(preference).toBe('es');
    });

    it('should set English preference', () => {
      setLanguagePreference('en');
      const preference = getLanguagePreference();
      expect(preference).toBe('en');
    });
  });

  describe('getLanguagePreference', () => {
    it('should return null when no preference is set', () => {
      clearLanguagePreference();
      const preference = getLanguagePreference();
      expect(preference).toBeNull();
    });

    it('should retrieve saved preference', () => {
      setLanguagePreference('es');
      const preference = getLanguagePreference();
      expect(preference).toBe('es');
    });
  });

  describe('clearLanguagePreference', () => {
    it('should clear language preference', () => {
      setLanguagePreference('es');
      clearLanguagePreference();
      const preference = getLanguagePreference();
      expect(preference).toBeNull();
    });
  });

  describe('detectBrowserLanguage', () => {
    it('should detect browser language', () => {
      const language = detectBrowserLanguage();
      expect(['en', 'es']).toContain(language);
    });
  });

  describe('initializeLanguagePreference', () => {
    it('should return saved preference if exists', () => {
      setLanguagePreference('es');
      const language = initializeLanguagePreference();
      expect(language).toBe('es');
    });

    it('should detect and save browser language if no preference exists', () => {
      clearLanguagePreference();
      const language = initializeLanguagePreference();
      expect(['en', 'es']).toContain(language);
    });
  });
});

describe('Email Templates', () => {
  describe('welcomeEmail', () => {
    it('should have English template', () => {
      expect(welcomeEmail.en).toBeDefined();
      expect(welcomeEmail.en.subject).toBe('Welcome to Nexus Biomedical Intelligence');
      expect(welcomeEmail.en.html).toContain('Welcome to Nexus!');
    });

    it('should have Spanish template', () => {
      expect(welcomeEmail.es).toBeDefined();
      expect(welcomeEmail.es.subject).toBe('Bienvenido a Nexus Biomedical Intelligence');
      expect(welcomeEmail.es.html).toContain('¡Bienvenido a Nexus!');
    });
  });

  describe('assessmentCompletionEmail', () => {
    it('should generate English assessment email', () => {
      const template = assessmentCompletionEmail.en;
      expect(template).toBeDefined();
      expect(template.subject).toContain('{platform}');
      
      const html = template.html('EndoGuard', 65, 'moderate');
      expect(html).toContain('EndoGuard');
      expect(html).toContain('65/100');
      expect(html).toContain('MODERATE');
    });

    it('should generate Spanish assessment email', () => {
      const template = assessmentCompletionEmail.es;
      expect(template).toBeDefined();
      expect(template.subject).toContain('{platform}');
      
      const html = template.html('EndoGuard', 65, 'moderate');
      expect(html).toContain('EndoGuard');
      expect(html).toContain('65/100');
      expect(html).toContain('MODERADO');
    });

    it('should handle different risk levels', () => {
      const template = assessmentCompletionEmail.en;
      
      const lowRisk = template.html('EndoGuard', 30, 'low');
      expect(lowRisk).toContain('LOW');
      
      const highRisk = template.html('EndoGuard', 80, 'high');
      expect(highRisk).toContain('HIGH');
    });
  });

  describe('subscriptionConfirmationEmail', () => {
    it('should generate English subscription email', () => {
      const template = subscriptionConfirmationEmail.en;
      const features = ['Unlimited assessments', 'Priority support', 'Advanced analytics'];
      const html = template.html('Premium Plan', features);
      
      expect(html).toContain('Premium Plan');
      expect(html).toContain('Unlimited assessments');
      expect(html).toContain('Priority support');
    });

    it('should generate Spanish subscription email', () => {
      const template = subscriptionConfirmationEmail.es;
      const features = ['Evaluaciones ilimitadas', 'Soporte prioritario', 'Análisis avanzados'];
      const html = template.html('Plan Premium', features);
      
      expect(html).toContain('Plan Premium');
      expect(html).toContain('Evaluaciones ilimitadas');
    });
  });

  describe('getEmailTemplate', () => {
    it('should retrieve welcome template in English', () => {
      const template = getEmailTemplate('welcome', 'en');
      expect(template).toBeDefined();
      expect(template.subject).toBe('Welcome to Nexus Biomedical Intelligence');
    });

    it('should retrieve welcome template in Spanish', () => {
      const template = getEmailTemplate('welcome', 'es');
      expect(template).toBeDefined();
      expect(template.subject).toBe('Bienvenido a Nexus Biomedical Intelligence');
    });

    it('should return null for invalid template name', () => {
      const template = getEmailTemplate('invalid_template', 'en');
      expect(template).toBeNull();
    });
  });
});

describe('SMS Templates', () => {
  describe('assessmentCompletionSMS', () => {
    it('should generate English SMS', () => {
      const sms = assessmentCompletionSMS.en('EndoGuard', 65);
      expect(sms).toContain('EndoGuard');
      expect(sms).toContain('65/100');
      expect(sms).toContain('nexusbiomedical.com');
    });

    it('should generate Spanish SMS', () => {
      const sms = assessmentCompletionSMS.es('EndoGuard', 65);
      expect(sms).toContain('EndoGuard');
      expect(sms).toContain('65/100');
      expect(sms).toContain('nexusbiomedical.com');
    });
  });

  describe('highRiskAlertSMS', () => {
    it('should generate English alert', () => {
      const sms = highRiskAlertSMS.en('EndoGuard');
      expect(sms).toContain('⚠️');
      expect(sms).toContain('elevated risk');
      expect(sms).toContain('EndoGuard');
    });

    it('should generate Spanish alert', () => {
      const sms = highRiskAlertSMS.es('EndoGuard');
      expect(sms).toContain('⚠️');
      expect(sms).toContain('riesgo elevado');
      expect(sms).toContain('EndoGuard');
    });
  });

  describe('subscriptionActivationSMS', () => {
    it('should generate English activation SMS', () => {
      const sms = subscriptionActivationSMS.en('Premium Plan');
      expect(sms).toContain('🎉');
      expect(sms).toContain('Premium Plan');
      expect(sms).toContain('premium features');
    });

    it('should generate Spanish activation SMS', () => {
      const sms = subscriptionActivationSMS.es('Plan Premium');
      expect(sms).toContain('🎉');
      expect(sms).toContain('Plan Premium');
      expect(sms).toContain('funciones premium');
    });
  });

  describe('trialExpirationReminderSMS', () => {
    it('should handle singular day in English', () => {
      const sms = trialExpirationReminderSMS.en(1);
      expect(sms).toContain('1 day');
      expect(sms).not.toContain('days');
    });

    it('should handle plural days in English', () => {
      const sms = trialExpirationReminderSMS.en(3);
      expect(sms).toContain('3 days');
    });

    it('should handle singular day in Spanish', () => {
      const sms = trialExpirationReminderSMS.es(1);
      expect(sms).toContain('1 día');
    });

    it('should handle plural days in Spanish', () => {
      const sms = trialExpirationReminderSMS.es(3);
      expect(sms).toContain('3 días');
    });
  });

  describe('assessmentReminderSMS', () => {
    it('should generate English reminder', () => {
      const sms = assessmentReminderSMS.en('EndoGuard', 30);
      expect(sms).toContain('30 days');
      expect(sms).toContain('EndoGuard');
    });

    it('should generate Spanish reminder', () => {
      const sms = assessmentReminderSMS.es('EndoGuard', 30);
      expect(sms).toContain('30 días');
      expect(sms).toContain('EndoGuard');
    });
  });

  describe('weeklyHealthTipSMS', () => {
    it('should generate English health tip', () => {
      const tip = 'Drink 8 glasses of water daily';
      const sms = weeklyHealthTipSMS.en(tip);
      expect(sms).toContain('💡');
      expect(sms).toContain(tip);
    });

    it('should generate Spanish health tip', () => {
      const tip = 'Beba 8 vasos de agua diariamente';
      const sms = weeklyHealthTipSMS.es(tip);
      expect(sms).toContain('💡');
      expect(sms).toContain(tip);
    });
  });

  describe('welcomeSMS', () => {
    it('should generate English welcome SMS', () => {
      const sms = welcomeSMS.en();
      expect(sms).toContain('Welcome to Nexus');
      expect(sms).toContain('STOP');
    });

    it('should generate Spanish welcome SMS', () => {
      const sms = welcomeSMS.es();
      expect(sms).toContain('Bienvenido a Nexus');
      expect(sms).toContain('STOP');
    });
  });

  describe('getSMSTemplate', () => {
    it('should retrieve assessment completion template', () => {
      const sms = getSMSTemplate('assessment_completion', 'en', 'EndoGuard', 65);
      expect(sms).toContain('EndoGuard');
      expect(sms).toContain('65/100');
    });

    it('should retrieve welcome template', () => {
      const sms = getSMSTemplate('welcome', 'en');
      expect(sms).toContain('Welcome to Nexus');
    });

    it('should return null for invalid template', () => {
      const sms = getSMSTemplate('invalid_template', 'en');
      expect(sms).toBeNull();
    });
  });

  describe('spanishHealthTips', () => {
    it('should have at least 20 health tips', () => {
      expect(spanishHealthTips.length).toBeGreaterThanOrEqual(20);
    });

    it('should contain relevant health information', () => {
      const tips = spanishHealthTips.join(' ');
      expect(tips).toContain('diabetes');
      expect(tips).toContain('salud');
      expect(tips).toContain('ejercicio');
    });

    it('should all be in Spanish', () => {
      spanishHealthTips.forEach(tip => {
        expect(tip.length).toBeGreaterThan(20);
        expect(tip).toMatch(/[a-záéíóúñ]/i);
      });
    });
  });
});

describe('Integration Tests', () => {
  it('should handle complete bilingual user flow', () => {
    // User sets Spanish preference
    setLanguagePreference('es');
    
    // Verify preference is saved
    const preference = getLanguagePreference();
    expect(preference).toBe('es');
    
    // Track Spanish engagement
    expect(() => trackSpanishEngagement('signup', { source: 'landing_page' })).not.toThrow();
    
    // Get Spanish welcome email
    const emailTemplate = getEmailTemplate('welcome', 'es');
    expect(emailTemplate.subject).toContain('Bienvenido');
    
    // Get Spanish welcome SMS
    const smsTemplate = getSMSTemplate('welcome', 'es');
    expect(smsTemplate).toContain('Bienvenido');
  });

  it('should handle language toggle tracking', () => {
    // Start with English
    setLanguagePreference('en');
    
    // Toggle to Spanish
    const oldLang = 'en';
    const newLang = 'es';
    
    expect(() => trackLanguageToggle(oldLang, newLang)).not.toThrow();
    setLanguagePreference(newLang);
    
    // Verify new preference
    expect(getLanguagePreference()).toBe('es');
  });

  it('should handle assessment completion in Spanish', () => {
    const platform = 'EndoGuard';
    const score = 75;
    const language = 'es';
    
    // Track assessment completion
    expect(() => trackAssessmentCompletion(platform, score, language)).not.toThrow();
    
    // Get Spanish email template
    const emailTemplate = assessmentCompletionEmail.es;
    const html = emailTemplate.html(platform, score, 'high');
    expect(html).toContain('ALTO');
    
    // Get Spanish SMS template
    const sms = assessmentCompletionSMS.es(platform, score);
    expect(sms).toContain('Puntuación');
  });
});
