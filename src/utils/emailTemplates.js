/**
 * Bilingual Email Templates
 * English and Spanish versions for all email communications
 */

/**
 * Welcome Email Templates
 */
export const welcomeEmail = {
  en: {
    subject: 'Welcome to Nexus Biomedical Intelligence',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #60a5fa; margin: 0; font-size: 28px;">Welcome to Nexus!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Thank you for joining Nexus Biomedical Intelligence. We're excited to help you take control of your health with our AI-powered clinical decision support platforms.
          </p>
          
          <h2 style="color: #1e293b; font-size: 20px; margin-top: 30px;">Get Started:</h2>
          
          <ul style="line-height: 1.8; color: #475569;">
            <li><strong>EndoGuard™</strong> - Complete your free endometriosis risk assessment</li>
            <li><strong>RxGuard™</strong> - Check for dangerous drug interactions</li>
            <li><strong>ElderWatch™</strong> - Monitor senior health metrics</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexusbiomedical.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Go to Dashboard
            </a>
          </div>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            Need help? Reply to this email or visit our <a href="https://nexusbiomedical.com/faq" style="color: #ec4899;">FAQ page</a>.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
          <p>Nexus Biomedical Intelligence | HIPAA Compliant | Evidence-Based Medicine</p>
        </div>
      </div>
    `
  },
  es: {
    subject: 'Bienvenido a Nexus Biomedical Intelligence',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #60a5fa; margin: 0; font-size: 28px;">¡Bienvenido a Nexus!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Gracias por unirse a Nexus Biomedical Intelligence. Estamos emocionados de ayudarle a tomar control de su salud con nuestras plataformas de apoyo clínico impulsadas por IA.
          </p>
          
          <h2 style="color: #1e293b; font-size: 20px; margin-top: 30px;">Comience Ahora:</h2>
          
          <ul style="line-height: 1.8; color: #475569;">
            <li><strong>EndoGuard™</strong> - Complete su evaluación gratuita de riesgo de endometriosis</li>
            <li><strong>RxGuard™</strong> - Verifique interacciones peligrosas entre medicamentos</li>
            <li><strong>ElderWatch™</strong> - Monitoree métricas de salud de adultos mayores</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexusbiomedical.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Ir al Panel de Control
            </a>
          </div>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
            ¿Necesita ayuda? Responda a este correo o visite nuestra <a href="https://nexusbiomedical.com/faq" style="color: #ec4899;">página de preguntas frecuentes</a>.
          </p>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 12px;">
          <p>Nexus Biomedical Intelligence | Cumple con HIPAA | Medicina Basada en Evidencia</p>
        </div>
      </div>
    `
  }
};

/**
 * Assessment Completion Email Templates
 */
export const assessmentCompletionEmail = {
  en: {
    subject: 'Your {platform} Assessment Results',
    html: (platform, score, riskLevel) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #60a5fa; margin: 0; font-size: 28px;">${platform} Assessment Complete</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Thank you for completing your ${platform} assessment. Your results are ready to review.
          </p>
          
          <div style="background: ${riskLevel === 'high' ? '#fef2f2' : riskLevel === 'moderate' ? '#fef3c7' : '#f0fdf4'}; border-left: 4px solid ${riskLevel === 'high' ? '#ef4444' : riskLevel === 'moderate' ? '#f59e0b' : '#10b981'}; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 10px 0; color: ${riskLevel === 'high' ? '#dc2626' : riskLevel === 'moderate' ? '#d97706' : '#059669'};">
              Risk Level: ${riskLevel.toUpperCase()}
            </h3>
            <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1e293b;">
              Score: ${score}/100
            </p>
          </div>
          
          <h2 style="color: #1e293b; font-size: 20px; margin-top: 30px;">Next Steps:</h2>
          
          <ul style="line-height: 1.8; color: #475569;">
            <li>Review your detailed results and recommendations</li>
            <li>Download your assessment report (PDF)</li>
            <li>Share results with your healthcare provider</li>
            <li>Schedule a follow-up assessment in 3-6 months</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexusbiomedical.com/my-assessments" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              View Full Results
            </a>
          </div>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding: 15px; background: #f1f5f9; border-radius: 4px;">
            <strong>Important:</strong> This assessment is for informational purposes only and does not replace professional medical advice. Please consult with your healthcare provider.
          </p>
        </div>
      </div>
    `
  },
  es: {
    subject: 'Sus Resultados de Evaluación de {platform}',
    html: (platform, score, riskLevel) => {
      const riskLevelES = riskLevel === 'high' ? 'ALTO' : riskLevel === 'moderate' ? 'MODERADO' : 'BAJO';
      return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #60a5fa; margin: 0; font-size: 28px;">Evaluación de ${platform} Completa</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Gracias por completar su evaluación de ${platform}. Sus resultados están listos para revisar.
          </p>
          
          <div style="background: ${riskLevel === 'high' ? '#fef2f2' : riskLevel === 'moderate' ? '#fef3c7' : '#f0fdf4'}; border-left: 4px solid ${riskLevel === 'high' ? '#ef4444' : riskLevel === 'moderate' ? '#f59e0b' : '#10b981'}; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <h3 style="margin: 0 0 10px 0; color: ${riskLevel === 'high' ? '#dc2626' : riskLevel === 'moderate' ? '#d97706' : '#059669'};">
              Nivel de Riesgo: ${riskLevelES}
            </h3>
            <p style="margin: 0; font-size: 24px; font-weight: 700; color: #1e293b;">
              Puntuación: ${score}/100
            </p>
          </div>
          
          <h2 style="color: #1e293b; font-size: 20px; margin-top: 30px;">Próximos Pasos:</h2>
          
          <ul style="line-height: 1.8; color: #475569;">
            <li>Revise sus resultados detallados y recomendaciones</li>
            <li>Descargue su informe de evaluación (PDF)</li>
            <li>Comparta los resultados con su proveedor de atención médica</li>
            <li>Programe una evaluación de seguimiento en 3-6 meses</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexusbiomedical.com/my-assessments" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Ver Resultados Completos
            </a>
          </div>
          
          <p style="font-size: 14px; color: #64748b; margin-top: 30px; padding: 15px; background: #f1f5f9; border-radius: 4px;">
            <strong>Importante:</strong> Esta evaluación es solo para fines informativos y no reemplaza el consejo médico profesional. Por favor consulte con su proveedor de atención médica.
          </p>
        </div>
      </div>
    `;
    }
  }
};

/**
 * Subscription Confirmation Email Templates
 */
export const subscriptionConfirmationEmail = {
  en: {
    subject: 'Welcome to {plan} - Subscription Confirmed',
    html: (plan, features) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Subscription Confirmed!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            Welcome to <strong>${plan}</strong>! Your subscription is now active and you have full access to all premium features.
          </p>
          
          <h2 style="color: #1e293b; font-size: 20px; margin-top: 30px;">Your Benefits:</h2>
          
          <ul style="line-height: 1.8; color: #475569;">
            ${features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexusbiomedical.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Start Using Premium Features
            </a>
          </div>
        </div>
      </div>
    `
  },
  es: {
    subject: 'Bienvenido a {plan} - Suscripción Confirmada',
    html: (plan, features) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 ¡Suscripción Confirmada!</h1>
        </div>
        
        <div style="background: white; padding: 40px 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; line-height: 1.6; color: #334155;">
            ¡Bienvenido a <strong>${plan}</strong>! Su suscripción está ahora activa y tiene acceso completo a todas las funciones premium.
          </p>
          
          <h2 style="color: #1e293b; font-size: 20px; margin-top: 30px;">Sus Beneficios:</h2>
          
          <ul style="line-height: 1.8; color: #475569;">
            ${features.map(f => `<li>${f}</li>`).join('')}
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://nexusbiomedical.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #d946ef 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600;">
              Comenzar a Usar Funciones Premium
            </a>
          </div>
        </div>
      </div>
    `
  }
};

/**
 * Helper function to get email template
 */
export const getEmailTemplate = (templateName, language = 'en', ...args) => {
  const templates = {
    welcome: welcomeEmail,
    assessment: assessmentCompletionEmail,
    subscription: subscriptionConfirmationEmail
  };
  
  const template = templates[templateName];
  if (!template || !template[language]) {
    console.error(`Template ${templateName} not found for language ${language}`);
    return null;
  }
  
  return template[language];
};
