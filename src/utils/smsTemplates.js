/**
 * Bilingual SMS Templates
 * English and Spanish versions for SMS notifications
 */

/**
 * Assessment Completion SMS
 */
export const assessmentCompletionSMS = {
  en: (platform, score) => 
    `Nexus: Your ${platform} assessment is complete! Score: ${score}/100. View results: https://nexusbiomedical.com/my-assessments`,
  
  es: (platform, score) => 
    `Nexus: ¡Su evaluación de ${platform} está completa! Puntuación: ${score}/100. Ver resultados: https://nexusbiomedical.com/my-assessments`
};

/**
 * High Risk Alert SMS
 */
export const highRiskAlertSMS = {
  en: (platform) => 
    `⚠️ Nexus Alert: Your ${platform} assessment shows elevated risk. Please review your results and consult your healthcare provider: https://nexusbiomedical.com/my-assessments`,
  
  es: (platform) => 
    `⚠️ Alerta Nexus: Su evaluación de ${platform} muestra riesgo elevado. Por favor revise sus resultados y consulte a su proveedor de atención médica: https://nexusbiomedical.com/my-assessments`
};

/**
 * Subscription Activation SMS
 */
export const subscriptionActivationSMS = {
  en: (plan) => 
    `🎉 Nexus: Welcome to ${plan}! Your premium features are now active. Start exploring: https://nexusbiomedical.com/dashboard`,
  
  es: (plan) => 
    `🎉 Nexus: ¡Bienvenido a ${plan}! Sus funciones premium están ahora activas. Comience a explorar: https://nexusbiomedical.com/dashboard`
};

/**
 * Trial Expiration Reminder SMS
 */
export const trialExpirationReminderSMS = {
  en: (daysLeft) => 
    `Nexus: Your free trial expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Upgrade to keep access to premium features: https://nexusbiomedical.com/pricing`,
  
  es: (daysLeft) => 
    `Nexus: Su prueba gratuita expira en ${daysLeft} día${daysLeft > 1 ? 's' : ''}. Actualice para mantener acceso a funciones premium: https://nexusbiomedical.com/pricing`
};

/**
 * Assessment Reminder SMS
 */
export const assessmentReminderSMS = {
  en: (platform, daysSince) => 
    `Nexus: It's been ${daysSince} days since your last ${platform} assessment. Time for a check-up? https://nexusbiomedical.com/${platform.toLowerCase()}`,
  
  es: (platform, daysSince) => 
    `Nexus: Han pasado ${daysSince} días desde su última evaluación de ${platform}. ¿Es hora de un chequeo? https://nexusbiomedical.com/${platform.toLowerCase()}`
};

/**
 * Weekly Health Tip SMS
 */
export const weeklyHealthTipSMS = {
  en: (tip) => 
    `💡 Nexus Health Tip: ${tip} Learn more: https://nexusbiomedical.com/health-tips`,
  
  es: (tip) => 
    `💡 Consejo de Salud Nexus: ${tip} Aprenda más: https://nexusbiomedical.com/health-tips`
};

/**
 * Appointment Reminder SMS
 */
export const appointmentReminderSMS = {
  en: (date, time) => 
    `📅 Nexus Reminder: You have an appointment on ${date} at ${time}. Don't forget to bring your assessment results!`,
  
  es: (date, time) => 
    `📅 Recordatorio Nexus: Tiene una cita el ${date} a las ${time}. ¡No olvide traer sus resultados de evaluación!`
};

/**
 * Medication Interaction Alert SMS
 */
export const medicationInteractionAlertSMS = {
  en: (drugA, drugB) => 
    `⚠️ RxGuard Alert: Potential interaction detected between ${drugA} and ${drugB}. Review details: https://nexusbiomedical.com/rxguard`,
  
  es: (drugA, drugB) => 
    `⚠️ Alerta RxGuard: Interacción potencial detectada entre ${drugA} y ${drugB}. Revisar detalles: https://nexusbiomedical.com/rxguard`
};

/**
 * Welcome SMS
 */
export const welcomeSMS = {
  en: () => 
    `Welcome to Nexus Biomedical Intelligence! 🩺 Start your free health assessment: https://nexusbiomedical.com/endoguard Reply STOP to opt out.`,
  
  es: () => 
    `¡Bienvenido a Nexus Biomedical Intelligence! 🩺 Comience su evaluación de salud gratuita: https://nexusbiomedical.com/endoguard Responda STOP para darse de baja.`
};

/**
 * Helper function to get SMS template
 */
export const getSMSTemplate = (templateName, language = 'en', ...args) => {
  const templates = {
    assessment_completion: assessmentCompletionSMS,
    high_risk_alert: highRiskAlertSMS,
    subscription_activation: subscriptionActivationSMS,
    trial_expiration: trialExpirationReminderSMS,
    assessment_reminder: assessmentReminderSMS,
    health_tip: weeklyHealthTipSMS,
    appointment_reminder: appointmentReminderSMS,
    medication_alert: medicationInteractionAlertSMS,
    welcome: welcomeSMS
  };
  
  const template = templates[templateName];
  if (!template || !template[language]) {
    console.error(`SMS template ${templateName} not found for language ${language}`);
    return null;
  }
  
  return typeof template[language] === 'function' 
    ? template[language](...args) 
    : template[language];
};

/**
 * Spanish Health Tips for SMS campaigns
 */
export const spanishHealthTips = [
  'La diabetes tipo 2 es prevenible. Mantenga un peso saludable y haga ejercicio regularmente.',
  'Las mujeres hispanas tienen mayor riesgo de endometriosis. Hable con su médico si tiene dolor pélvico.',
  'Revise sus medicamentos regularmente para evitar interacciones peligrosas.',
  'La detección temprana del cáncer salva vidas. No se salte sus exámenes de rutina.',
  'El estrés crónico afecta su salud. Practique técnicas de relajación diariamente.',
  'Duerma 7-9 horas cada noche para una salud óptima.',
  'Manténgase hidratado: beba al menos 8 vasos de agua al día.',
  'Una dieta rica en frutas y verduras reduce el riesgo de enfermedades crónicas.',
  'El ejercicio regular mejora la salud mental y física.',
  'Hable con su médico sobre su historial familiar de enfermedades.',
  'La presión arterial alta no tiene síntomas. Revísela regularmente.',
  'El colesterol alto aumenta el riesgo de enfermedad cardíaca. Conozca sus números.',
  'La vitamina D es esencial. Considere suplementos si tiene deficiencia.',
  'Limite el consumo de alcohol para reducir riesgos de salud.',
  'Deje de fumar: nunca es tarde para mejorar su salud pulmonar.',
  'Mantenga un peso saludable para reducir el riesgo de diabetes y enfermedades cardíacas.',
  'La salud mental es tan importante como la salud física. Busque ayuda si la necesita.',
  'Vacúnese según las recomendaciones de su médico.',
  'Lave sus manos frecuentemente para prevenir infecciones.',
  'Use protector solar diariamente para prevenir cáncer de piel.'
];
