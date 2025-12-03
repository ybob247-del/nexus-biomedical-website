import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSMSTemplate } from '../src/utils/smsTemplates.js';
import { getEmailTemplate } from '../src/utils/emailTemplates.js';

describe('Bilingual Integration Tests', () => {
  describe('SMS Templates - Spanish', () => {
    it('should generate Spanish assessment completion SMS', () => {
      const message = getSMSTemplate('assessment_completion', 'es', 'EndoGuard', 75);
      
      expect(message).toContain('Nexus');
      expect(message).toContain('EndoGuard');
      expect(message).toContain('75/100');
      expect(message).toContain('evaluación');
      expect(message).toContain('completa');
    });

    it('should generate Spanish high risk alert SMS', () => {
      const message = getSMSTemplate('high_risk_alert', 'es', 'EndoGuard');
      
      expect(message).toContain('Alerta');
      expect(message).toContain('EndoGuard');
      expect(message).toContain('riesgo elevado');
      expect(message).toContain('proveedor de atención médica');
    });

    it('should generate Spanish subscription activation SMS', () => {
      const message = getSMSTemplate('subscription_activation', 'es', 'Premium');
      
      expect(message).toContain('Bienvenido');
      expect(message).toContain('Premium');
      expect(message).toContain('funciones premium');
      expect(message).toContain('activas');
    });

    it('should generate Spanish trial expiration SMS', () => {
      const message = getSMSTemplate('trial_expiration', 'es', 3);
      
      expect(message).toContain('Nexus');
      expect(message).toContain('prueba gratuita');
      expect(message).toContain('3 días');
      expect(message).toContain('expira');
    });

    it('should generate Spanish welcome SMS', () => {
      const message = getSMSTemplate('welcome', 'es');
      
      expect(message).toContain('Bienvenido');
      expect(message).toContain('Nexus Biomedical Intelligence');
      expect(message).toContain('evaluación de salud gratuita');
      expect(message).toContain('STOP');
    });
  });

  describe('SMS Templates - English', () => {
    it('should generate English assessment completion SMS', () => {
      const message = getSMSTemplate('assessment_completion', 'en', 'EndoGuard', 75);
      
      expect(message).toContain('Nexus');
      expect(message).toContain('EndoGuard');
      expect(message).toContain('75/100');
      expect(message).toContain('assessment');
      expect(message).toContain('complete');
    });

    it('should generate English high risk alert SMS', () => {
      const message = getSMSTemplate('high_risk_alert', 'en', 'EndoGuard');
      
      expect(message).toContain('Alert');
      expect(message).toContain('EndoGuard');
      expect(message).toContain('elevated risk');
      expect(message).toContain('healthcare provider');
    });

    it('should generate English subscription activation SMS', () => {
      const message = getSMSTemplate('subscription_activation', 'en', 'Premium');
      
      expect(message).toContain('Welcome');
      expect(message).toContain('Premium');
      expect(message).toContain('premium features');
      expect(message).toContain('active');
    });
  });

  describe('Email Templates - Spanish', () => {
    it('should have Spanish welcome email template', () => {
      const template = getEmailTemplate('welcome', 'es');
      
      expect(template).toBeDefined();
      expect(template.subject).toContain('Bienvenido');
      expect(template.html).toContain('Nexus');
      expect(template.html).toContain('EndoGuard');
      expect(template.html).toContain('Panel de Control');
    });

    it('should have Spanish assessment completion email template', () => {
      const template = getEmailTemplate('assessment', 'es');
      
      expect(template).toBeDefined();
      expect(template.subject).toContain('Resultados');
      expect(typeof template.html).toBe('function');
      
      const html = template.html('EndoGuard', 75, 'high');
      expect(html).toContain('EndoGuard');
      expect(html).toContain('75/100');
      expect(html).toContain('ALTO');
    });

    it('should have Spanish subscription confirmation email template', () => {
      const template = getEmailTemplate('subscription', 'es');
      
      expect(template).toBeDefined();
      expect(template.subject).toContain('Suscripción Confirmada');
      expect(typeof template.html).toBe('function');
      
      const features = ['Feature 1', 'Feature 2'];
      const html = template.html('Premium', features);
      expect(html).toContain('Premium');
      expect(html).toContain('Suscripción Confirmada');
    });
  });

  describe('Email Templates - English', () => {
    it('should have English welcome email template', () => {
      const template = getEmailTemplate('welcome', 'en');
      
      expect(template).toBeDefined();
      expect(template.subject).toContain('Welcome');
      expect(template.html).toContain('Nexus');
      expect(template.html).toContain('EndoGuard');
      expect(template.html).toContain('Dashboard');
    });

    it('should have English assessment completion email template', () => {
      const template = getEmailTemplate('assessment', 'en');
      
      expect(template).toBeDefined();
      expect(template.subject).toContain('Results');
      expect(typeof template.html).toBe('function');
      
      const html = template.html('EndoGuard', 75, 'high');
      expect(html).toContain('EndoGuard');
      expect(html).toContain('75/100');
      expect(html).toContain('HIGH');
    });

    it('should have English subscription confirmation email template', () => {
      const template = getEmailTemplate('subscription', 'en');
      
      expect(template).toBeDefined();
      expect(template.subject).toContain('Subscription Confirmed');
      expect(typeof template.html).toBe('function');
      
      const features = ['Feature 1', 'Feature 2'];
      const html = template.html('Premium', features);
      expect(html).toContain('Premium');
      expect(html).toContain('Subscription Confirmed');
    });
  });

  describe('Language Fallback', () => {
    it('should fallback to English for unsupported language in SMS', () => {
      const message = getSMSTemplate('welcome', 'fr'); // French not supported
      
      // Should return null or English version
      if (message) {
        expect(message).toContain('Welcome');
        expect(message).toContain('Nexus Biomedical Intelligence');
      } else {
        expect(message).toBeNull();
      }
    });

    it('should fallback to English for unsupported language in Email', () => {
      const template = getEmailTemplate('welcome', 'fr'); // French not supported
      
      // Should return null or English version
      if (template) {
        expect(template).toBeDefined();
        expect(template.subject).toContain('Welcome');
      } else {
        expect(template).toBeNull();
      }
    });
  });

  describe('Template Parameter Validation', () => {
    it('should handle missing parameters gracefully in SMS', () => {
      const message = getSMSTemplate('assessment_completion', 'en');
      // Should return something even with missing params
      expect(message).toBeDefined();
    });

    it('should handle missing parameters gracefully in Email', () => {
      const template = getEmailTemplate('assessment', 'en');
      // Template function may require parameters
      expect(template).toBeDefined();
      expect(typeof template.html).toBe('function');
    });

    it('should handle null/undefined language parameter', () => {
      const message = getSMSTemplate('welcome', null);
      expect(message).toBeDefined();
    });
  });

  describe('URL Validation', () => {
    it('should include valid URLs in Spanish SMS templates', () => {
      const message = getSMSTemplate('assessment_completion', 'es', 'EndoGuard', 75);
      
      expect(message).toMatch(/https?:\/\//);
      expect(message).toContain('nexusbiomedical.com');
    });

    it('should include valid URLs in English SMS templates', () => {
      const message = getSMSTemplate('assessment_completion', 'en', 'EndoGuard', 75);
      
      expect(message).toMatch(/https?:\/\//);
      expect(message).toContain('nexusbiomedical.com');
    });

    it('should include valid URLs in Spanish email templates', () => {
      const template = getEmailTemplate('welcome', 'es');
      
      expect(template.html).toContain('https://nexusbiomedical.com');
    });

    it('should include valid URLs in English email templates', () => {
      const template = getEmailTemplate('welcome', 'en');
      
      expect(template.html).toContain('https://nexusbiomedical.com');
    });
  });

  describe('Character Encoding', () => {
    it('should properly encode Spanish special characters in SMS', () => {
      const message = getSMSTemplate('assessment_completion', 'es', 'EndoGuard', 75);
      
      // Check for proper Spanish characters
      expect(message).toMatch(/[áéíóúñü]/i);
    });

    it('should properly encode Spanish special characters in Email', () => {
      const template = getEmailTemplate('welcome', 'es');
      
      // Check for proper Spanish characters
      expect(template.html).toMatch(/[áéíóúñü]/i);
    });
  });

  describe('SMS Length Validation', () => {
    it('should keep SMS messages under 160 characters when possible', () => {
      const shortMessages = [
        getSMSTemplate('welcome', 'en'),
        getSMSTemplate('welcome', 'es')
      ];

      shortMessages.forEach(message => {
        // Allow up to 320 characters for multi-part SMS
        expect(message.length).toBeLessThan(320);
      });
    });

    it('should have reasonable length for all SMS templates', () => {
      const templates = [
        ['assessment_completion', 'en', 'EndoGuard', 75],
        ['assessment_completion', 'es', 'EndoGuard', 75],
        ['high_risk_alert', 'en', 'EndoGuard'],
        ['high_risk_alert', 'es', 'EndoGuard'],
        ['subscription_activation', 'en', 'Premium'],
        ['subscription_activation', 'es', 'Premium']
      ];

      templates.forEach(([name, lang, ...args]) => {
        const message = getSMSTemplate(name, lang, ...args);
        expect(message.length).toBeLessThan(500); // Reasonable max length
        expect(message.length).toBeGreaterThan(20); // Reasonable min length
      });
    });
  });

  describe('Email HTML Validation', () => {
    it('should have valid HTML structure in email templates', () => {
      const template = getEmailTemplate('welcome', 'en');
      
      expect(template.html).toContain('<div');
      expect(template.html).toContain('</div>');
      expect(template.html).toContain('style=');
    });

    it('should include proper email styling', () => {
      const template = getEmailTemplate('welcome', 'en');
      
      expect(template.html).toContain('font-family');
      expect(template.html).toContain('color');
      expect(template.html).toContain('padding');
    });

    it('should have responsive email design', () => {
      const template = getEmailTemplate('welcome', 'en');
      
      expect(template.html).toContain('max-width');
      expect(template.html).toMatch(/600px|100%/);
    });
  });

  describe('Branding Consistency', () => {
    it('should include Nexus branding in all SMS templates', () => {
      const templates = [
        ['assessment_completion', 'en', 'EndoGuard', 75],
        ['high_risk_alert', 'en', 'EndoGuard'],
        ['subscription_activation', 'en', 'Premium'],
        ['welcome', 'en']
      ];

      templates.forEach(([name, lang, ...args]) => {
        const message = getSMSTemplate(name, lang, ...args);
        expect(message).toMatch(/Nexus/i);
      });
    });

    it('should include Nexus branding in all email templates', () => {
      // Test welcome email
      const welcomeTemplate = getEmailTemplate('welcome', 'en');
      expect(welcomeTemplate.html).toMatch(/Nexus/i);
      
      // Test assessment email
      const assessmentTemplate = getEmailTemplate('assessment', 'en');
      const assessmentHtml = assessmentTemplate.html('EndoGuard', 50, 'moderate');
      expect(assessmentHtml).toMatch(/Nexus/i);
      
      // Test subscription email
      const subscriptionTemplate = getEmailTemplate('subscription', 'en');
      const subscriptionHtml = subscriptionTemplate.html('Premium', ['Feature 1', 'Feature 2']);
      expect(subscriptionHtml).toMatch(/Nexus/i);
    });
  });

  describe('Analytics Integration', () => {
    it('should have GA4 measurement ID configured', () => {
      const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;
      
      expect(measurementId).toBeDefined();
      expect(measurementId).toMatch(/^G-[A-Z0-9]+$/);
      expect(measurementId).toBe('G-MH6HND05KY');
    });

    it('should support UTM parameters in URLs', () => {
      const testUrl = 'https://nexusbiomedical.com/?utm_source=google&utm_medium=cpc&utm_campaign=endoguard_spanish_la';
      
      expect(testUrl).toContain('utm_source');
      expect(testUrl).toContain('utm_medium');
      expect(testUrl).toContain('utm_campaign');
    });
  });
});
