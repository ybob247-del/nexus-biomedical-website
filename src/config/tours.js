/**
 * Onboarding Tour Configurations
 * 
 * Define all guided tours for the Nexus Biomedical platform
 *
 * The EndoGuard tours carry `steps` (English) and `stepsEs` (Spanish) with the
 * same structure. Callers pick one by `i18n.language`. Where the consumer
 * brand needs different wording (educational tool, topics to discuss rather
 * than tests to order), the copy is chosen here so both arrays stay in step.
 */

import brand from './brand';

const isConsumer = brand.isConsumerBrand;

/**
 * driver.js shows English button labels by default. A step's `popover` object
 * is spread last, so the Spanish labels and a fixed progress text go there.
 */
const withSpanishButtons = (steps) =>
  steps.map((step, index) => ({
    ...step,
    popover: {
      nextBtnText: index === steps.length - 1 ? 'Listo' : 'Siguiente &rarr;',
      prevBtnText: '&larr; Anterior',
      doneBtnText: 'Listo',
      progressText: `${index + 1} de ${steps.length}`,
      ...step.popover
    }
  }));

export const endoGuardAssessmentTour = {
  tourId: 'endoguard-assessment',
  steps: [
    {
      element: 'body',
      title: '🎉 Welcome to EndoGuard™',
      description: 'This FREE assessment will help you understand your exposure to Endocrine Disrupting Chemicals (EDCs) and their potential impact on your hormone health. It takes just 5 minutes!',
      side: 'bottom',
      align: 'center'
    },
    {
      element: '[data-tour="step-indicator"]',
      title: '📊 6-Step Assessment',
      description: 'We\'ll guide you through 6 simple steps covering your demographics, symptoms, lifestyle, and environmental exposures. Your progress is saved automatically.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="age-input"]',
      title: '👤 About You',
      description: 'First, tell us your age and biological sex. This helps us provide personalized recommendations based on your hormonal profile.',
      side: 'right',
      align: 'start'
    },
    {
      element: '[data-tour="next-button"]',
      title: '➡️ Navigate Steps',
      description: 'Click "Next" to proceed through each step. You can always go back to review or change your answers.',
      side: 'top',
      align: 'end'
    },
    {
      element: '[data-tour="disclaimer"]',
      title: '⚠️ Medical Disclaimer',
      description: isConsumer
        ? 'This is an educational tool. It does not diagnose or treat any condition. Always talk with your clinician about medical questions.'
        : 'This is a clinical decision support tool, not a medical diagnosis. Always consult with your healthcare provider for medical advice.',
      side: 'top',
      align: 'start'
    }
  ],
  stepsEs: withSpanishButtons([
    {
      element: 'body',
      title: '🎉 Te damos la bienvenida a EndoGuard™',
      description: 'Esta evaluación GRATUITA te ayudará a entender tu exposición a los disruptores endocrinos (EDC) y su posible impacto en tu salud hormonal. ¡Solo toma 5 minutos!',
      side: 'bottom',
      align: 'center'
    },
    {
      element: '[data-tour="step-indicator"]',
      title: '📊 Evaluación en 6 pasos',
      description: 'Te guiaremos por 6 pasos sencillos sobre tus datos generales, síntomas, estilo de vida y exposiciones ambientales. Tu progreso se guarda automáticamente.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="age-input"]',
      title: '👤 Sobre ti',
      description: 'Primero, cuéntanos tu edad y tu sexo biológico. Esto nos ayuda a darte recomendaciones personalizadas según tu perfil hormonal.',
      side: 'right',
      align: 'start'
    },
    {
      element: '[data-tour="next-button"]',
      title: '➡️ Avanza por los pasos',
      description: 'Haz clic en "Siguiente" para avanzar en cada paso. Siempre puedes regresar para revisar o cambiar tus respuestas.',
      side: 'top',
      align: 'end'
    },
    {
      element: '[data-tour="disclaimer"]',
      title: '⚠️ Aviso médico',
      description: isConsumer
        ? 'Esta es una herramienta educativa: no diagnostica ni trata ninguna condición. Habla siempre con tu profesional de salud sobre cualquier duda médica.'
        : 'Esta es una herramienta de apoyo a la decisión clínica, no un diagnóstico médico. Consulta siempre a tu profesional de salud para recibir consejo médico.',
      side: 'top',
      align: 'start'
    }
  ])
};

export const endoGuardResultsTour = {
  tourId: 'endoguard-results',
  steps: [
    {
      element: '[data-tour="risk-score"]',
      title: '🎯 Your Risk Score',
      description: 'This score (0-100) represents your estimated EDC exposure risk based on your responses. Higher scores indicate greater potential exposure.',
      side: 'bottom',
      align: 'center'
    },
    {
      element: '[data-tour="risk-level"]',
      title: '📈 Risk Level',
      description: 'Your risk is categorized as Low, Moderate, High, or Very High. Each level comes with specific recommendations.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="recommendations"]',
      title: '💡 Personalized Recommendations',
      description: isConsumer
        ? 'Scroll down to see evidence-based recommendations tailored to your risk profile, including lifestyle changes and topics to discuss with your clinician.'
        : 'Scroll down to see evidence-based recommendations tailored to your risk profile, including lifestyle changes and medical tests to consider.',
      side: 'left',
      align: 'start'
    },
    {
      element: '[data-tour="pdf-download"]',
      title: '📄 Download Report',
      description: 'Save your results as a PDF to share with your healthcare provider or track your progress over time.',
      side: 'bottom',
      align: 'end'
    },
    {
      element: '[data-tour="retake-assessment"]',
      title: '🔄 Track Progress',
      description: 'Retake the assessment after making lifestyle changes to see how your risk score improves!',
      side: 'bottom',
      align: 'start'
    }
  ],
  stepsEs: withSpanishButtons([
    {
      element: '[data-tour="risk-score"]',
      title: '🎯 Tu puntuación de riesgo',
      description: 'Esta puntuación (0-100) representa tu riesgo estimado de exposición a EDC según tus respuestas. Una puntuación más alta indica una mayor exposición potencial.',
      side: 'bottom',
      align: 'center'
    },
    {
      element: '[data-tour="risk-level"]',
      title: '📈 Nivel de riesgo',
      description: 'Tu riesgo se clasifica como Bajo, Moderado, Alto o Muy alto. Cada nivel incluye recomendaciones específicas.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="recommendations"]',
      title: '💡 Recomendaciones personalizadas',
      description: isConsumer
        ? 'Desplázate hacia abajo para ver recomendaciones basadas en evidencia adaptadas a tu perfil, incluidos cambios en tu estilo de vida y temas para conversar con tu profesional de salud.'
        : 'Desplázate hacia abajo para ver recomendaciones basadas en evidencia adaptadas a tu perfil de riesgo, incluidos cambios en tu estilo de vida y pruebas médicas a considerar.',
      side: 'left',
      align: 'start'
    },
    {
      element: '[data-tour="pdf-download"]',
      title: '📄 Descarga tu informe',
      description: 'Guarda tus resultados en PDF para compartirlos con tu profesional de salud o seguir tu progreso con el tiempo.',
      side: 'bottom',
      align: 'end'
    },
    {
      element: '[data-tour="retake-assessment"]',
      title: '🔄 Sigue tu progreso',
      description: 'Vuelve a hacer la evaluación después de hacer cambios en tu estilo de vida para ver cómo mejora tu puntuación de riesgo.',
      side: 'bottom',
      align: 'start'
    }
  ])
};

export const rxGuardDashboardTour = {
  tourId: 'rxguard-dashboard',
  steps: [
    {
      element: 'body',
      title: '💊 Welcome to RxGuard™',
      description: 'RxGuard helps you check for dangerous drug interactions, side effects, and contraindications across all your medications.',
      side: 'bottom',
      align: 'center'
    },
    {
      element: '[data-tour="medication-search"]',
      title: '🔍 Add Medications',
      description: 'Start typing any medication name (brand or generic). Our database includes 10,000+ FDA-approved drugs with autocomplete suggestions.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="medication-list"]',
      title: '📋 Your Medication List',
      description: 'All your medications are saved here. You can add, remove, or update them anytime. Your list is encrypted and private.',
      side: 'right',
      align: 'start'
    },
    {
      element: '[data-tour="interaction-analysis"]',
      title: '⚠️ Interaction Analysis',
      description: 'Once you add 2+ medications, we\'ll automatically check for interactions and display severity levels (High, Moderate, Low).',
      side: 'left',
      align: 'start'
    },
    {
      element: '[data-tour="severity-badge"]',
      title: '🚨 Severity Levels',
      description: 'HIGH (red) = Dangerous, avoid combination. MODERATE (yellow) = Caution needed. LOW (green) = Minor, monitor symptoms.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="clinical-guidance"]',
      title: '🩺 Clinical Guidance',
      description: 'Each interaction includes detailed clinical guidance, mechanism of action, and recommendations from peer-reviewed sources.',
      side: 'top',
      align: 'start'
    }
  ]
};

export const mainDashboardTour = {
  tourId: 'main-dashboard',
  steps: [
    {
      element: 'body',
      title: '🚀 Welcome to Nexus Biomedical',
      description: 'Your central hub for AI-powered healthcare intelligence. Access all 7 platforms from this dashboard.',
      side: 'bottom',
      align: 'center'
    },
    {
      element: '[data-tour="subscription-status"]',
      title: '💳 Subscription Status',
      description: 'Track your active subscriptions, trial days remaining, and upgrade options. Most platforms offer 14-30 day free trials.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="platform-cards"]',
      title: '🎯 Platform Access',
      description: 'Click any platform card to start using it. Green badges indicate active trials or subscriptions. Locked platforms require subscription.',
      side: 'left',
      align: 'start'
    },
    {
      element: '[data-tour="endoguard-card"]',
      title: '🔬 EndoGuard™',
      description: 'FREE hormone health assessment - no credit card required. Discover your EDC exposure risk in 5 minutes.',
      side: 'right',
      align: 'start'
    },
    {
      element: '[data-tour="rxguard-card"]',
      title: '💊 RxGuard™',
      description: 'Drug interaction checker with 14-day free trial. Add your medications and get instant safety analysis.',
      side: 'right',
      align: 'start'
    },
    {
      element: '[data-tour="settings-link"]',
      title: '⚙️ Settings',
      description: 'Manage your account, notification preferences, SMS settings, and subscription billing from here.',
      side: 'bottom',
      align: 'end'
    }
  ]
};

export const smsSettingsTour = {
  tourId: 'sms-settings',
  steps: [
    {
      element: 'body',
      title: '📱 SMS Notifications',
      description: 'Customize how and when you receive health tips, assessment reminders, and important alerts via text message.',
      side: 'bottom',
      align: 'center'
    },
    {
      element: '[data-tour="phone-input"]',
      title: '📞 Phone Number',
      description: 'Add your mobile number to receive SMS notifications. We use Twilio for secure, HIPAA-compliant messaging.',
      side: 'right',
      align: 'start'
    },
    {
      element: '[data-tour="notification-toggles"]',
      title: '🔔 Notification Types',
      description: 'Choose which notifications you want to receive: health tips, assessment reminders, high-risk alerts, trial/subscription updates.',
      side: 'left',
      align: 'start'
    },
    {
      element: '[data-tour="health-tips-frequency"]',
      title: '💡 Health Tips',
      description: 'Receive weekly evidence-based health tips with scientific citations. You can adjust frequency or disable them anytime.',
      side: 'bottom',
      align: 'start'
    },
    {
      element: '[data-tour="opt-out"]',
      title: '🚫 Opt Out Anytime',
      description: 'You can disable all SMS notifications with one click. Your preferences are saved automatically.',
      side: 'top',
      align: 'end'
    }
  ]
};

// Export all tours as a collection
export const allTours = {
  endoGuardAssessment: endoGuardAssessmentTour,
  endoGuardResults: endoGuardResultsTour,
  rxGuardDashboard: rxGuardDashboardTour,
  mainDashboard: mainDashboardTour,
  smsSettings: smsSettingsTour
};

export default allTours;
