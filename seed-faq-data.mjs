import { query } from './api/utils/db.js';

const faqData = [
  // General Questions - English
  { category: 'general', question: 'How does the free trial work?', answer: 'We offer a 7-day free trial with full platform access. No credit card is required to start your trial. You can explore all features of EndoGuard™ or RxGuard™ during this period. After the trial ends, you can choose to subscribe to continue using the platform.', keywords: 'free trial, trial, no credit card, 7 days, access', priority: 100, language: 'en' },
  
  { category: 'general', question: 'Is my health data secure?', answer: 'Yes, absolutely. We are HIPAA compliant and use industry-standard encryption (AES-256) to protect your data. All data is stored securely in encrypted databases, and we never share your personal health information with third parties without your explicit consent.', keywords: 'security, HIPAA, privacy, data protection, encryption, safe', priority: 100, language: 'en' },
  
  // Pricing Questions - English
  { category: 'pricing', question: 'How much does EndoGuard cost?', answer: 'EndoGuard™ has two pricing tiers: Basic Plan at $39/month (or $390/year, saving 17%) and Premium Plan at $79/month (or $790/year, saving 17%). We also have an Early Adopter Special offering 20% lifetime discount at $39/month instead of $49. All plans include a 7-day free trial.', keywords: 'endoguard, price, cost, pricing, subscription, monthly, yearly', priority: 90, language: 'en' },
  
  { category: 'pricing', question: 'How much does RxGuard cost?', answer: 'RxGuard™ pricing is the same as EndoGuard: Basic Plan at $39/month (or $390/year) and Premium Plan at $79/month (or $790/year). Early adopters get 20% off for life. All plans include a 7-day free trial with no credit card required.', keywords: 'rxguard, price, cost, pricing, subscription, monthly, yearly', priority: 90, language: 'en' },
  
  { category: 'pricing', question: 'What is the Early Adopter Special?', answer: 'The Early Adopter Special is a limited-time offer giving you 20% off for life. Instead of paying $49/month, you pay only $39/month forever. This is our way of thanking early users who help us improve our platforms with their feedback.', keywords: 'early adopter, discount, special offer, lifetime discount, 20%', priority: 85, language: 'en' },
  
  { category: 'pricing', question: 'Can I cancel my subscription anytime?', answer: 'Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or penalties. If you cancel, you will retain access until the end of your current billing period.', keywords: 'cancel, cancellation, refund, subscription management', priority: 80, language: 'en' },
  
  { category: 'pricing', question: 'What is the difference between Basic and Premium plans?', answer: 'Basic Plan includes core features like assessments, basic recommendations, and email notifications. Premium Plan adds advanced features like SMS notifications, detailed clinical reports, priority support, comparison tools, and access to all future platform updates.', keywords: 'basic, premium, plan comparison, features, difference', priority: 85, language: 'en' },
  
  // EndoGuard Questions - English
  { category: 'endoguard', question: 'What is EndoGuard?', answer: 'EndoGuard™ is a clinical-grade hormone intelligence platform that helps you track and understand your hormone health. It assesses your risk of hormone disruption from microplastics, endocrine-disrupting chemicals (EDCs), and environmental exposures. The platform provides personalized recommendations, testing suggestions, and ongoing monitoring.', keywords: 'endoguard, hormone, EDC, microplastics, assessment', priority: 95, language: 'en' },
  
  { category: 'endoguard', question: 'How does the EndoGuard assessment work?', answer: 'The EndoGuard assessment is a comprehensive questionnaire covering your symptoms, lifestyle, environmental exposures, and health history. It takes about 10-15 minutes to complete. Our AI algorithm analyzes your responses and generates a personalized risk score with detailed recommendations for reducing EDC exposure and improving hormone health.', keywords: 'endoguard, assessment, how it works, questionnaire, evaluation', priority: 90, language: 'en' },
  
  { category: 'endoguard', question: 'What are endocrine-disrupting chemicals (EDCs)?', answer: 'Endocrine-disrupting chemicals (EDCs) are substances that interfere with your hormone system. Common EDCs include BPA in plastics, phthalates in personal care products, PFAS in non-stick cookware, and pesticides in food. These chemicals can cause hormone imbalances, fertility issues, thyroid problems, and other health concerns.', keywords: 'EDC, endocrine disruptors, chemicals, BPA, phthalates, PFAS', priority: 85, language: 'en' },
  
  { category: 'endoguard', question: 'Is the EndoGuard assessment a medical diagnosis?', answer: 'No, the EndoGuard assessment is for educational purposes only and does not constitute medical advice or diagnosis. It provides risk assessment and recommendations based on scientific research, but you should always consult with a qualified healthcare provider before making any health decisions.', keywords: 'endoguard, medical advice, diagnosis, disclaimer, educational', priority: 80, language: 'en' },
  
  // RxGuard Questions - English
  { category: 'rxguard', question: 'What is RxGuard?', answer: 'RxGuard™ is an AI-powered medication interaction checker designed for healthcare providers and patients. It analyzes drug combinations to identify dangerous interactions, suggests safer alternatives, and provides detailed interaction reports. The platform uses a comprehensive drug database and machine learning to predict potential adverse effects.', keywords: 'rxguard, medication, drug interactions, checker, safety', priority: 95, language: 'en' },
  
  { category: 'rxguard', question: 'Who should use RxGuard?', answer: 'RxGuard is designed for healthcare providers (doctors, pharmacists, nurses) and patients taking multiple medications. It is especially useful for elderly patients on polypharmacy, patients with chronic conditions, and anyone concerned about drug interactions.', keywords: 'rxguard, who, users, healthcare providers, patients', priority: 85, language: 'en' },
  
  { category: 'rxguard', question: 'How accurate is RxGuard?', answer: 'RxGuard uses a comprehensive drug database and AI algorithms trained on millions of drug interaction cases. While highly accurate, it should be used as a decision support tool alongside professional medical judgment. Always consult with your healthcare provider before making medication changes.', keywords: 'rxguard, accuracy, reliable, trustworthy, AI', priority: 80, language: 'en' },
  
  // Technical Questions - English
  { category: 'technical', question: 'What platforms are available?', answer: 'Currently, EndoGuard™ (hormone health) and RxGuard™ (medication interactions) are live. Coming soon: ElderWatch™ (senior health monitoring), PediCalc Pro™ (pediatric dosing), ClinicalIQ™ (clinical decision support), ReguReady™ (regulatory compliance), and SkinScan™ (dermatology AI).', keywords: 'platforms, products, services, available, coming soon', priority: 90, language: 'en' },
  
  { category: 'technical', question: 'Do you have a mobile app?', answer: 'Currently, our platforms are web-based and fully responsive, working on all devices (desktop, tablet, mobile). We are planning to release dedicated iOS and Android apps in 2025. You can access all features through your mobile browser for now.', keywords: 'mobile app, iOS, Android, smartphone, tablet', priority: 75, language: 'en' },
  
  { category: 'technical', question: 'Can I integrate RxGuard with my EHR system?', answer: 'We are working on EHR integration capabilities. If you are interested in integrating RxGuard with your electronic health records system, please contact our enterprise team at enterprise@nexusbiomedical.ai for more information.', keywords: 'EHR, integration, API, electronic health records, enterprise', priority: 70, language: 'en' },
  
  // Support Questions - English
  { category: 'support', question: 'How do I contact support?', answer: 'You can contact our support team at support@nexusbiomedical.ai or use the Report Bug button on any page to submit feedback. We typically respond within 24 hours. Premium subscribers get priority support with faster response times.', keywords: 'support, contact, help, email, customer service', priority: 85, language: 'en' },
  
  { category: 'support', question: 'How do I reset my password?', answer: 'Click the "Forgot Password" link on the login page. Enter your email address, and we will send you a password reset link. The link expires after 1 hour for security reasons. If you do not receive the email, check your spam folder or contact support.', keywords: 'password, reset, forgot password, login issues', priority: 75, language: 'en' },
  
  { category: 'support', question: 'Can I share my assessment results with my doctor?', answer: 'Yes! You can download your assessment results as a PDF and share them with your healthcare provider. Premium subscribers can also email results directly from the platform. Your doctor can use these insights to inform treatment decisions.', keywords: 'share, doctor, results, PDF, healthcare provider', priority: 80, language: 'en' },
  
  // Spanish FAQs
  { category: 'general', question: '¿Qué es Nexus Biomedical Intelligence?', answer: 'Nexus Biomedical Intelligence es una empresa de tecnología de salud que proporciona plataformas de apoyo a decisiones clínicas impulsadas por IA. Ofrecemos siete plataformas revolucionarias incluyendo EndoGuard™ (seguimiento de salud hormonal) y RxGuard™ (verificador de interacciones de medicamentos).', keywords: 'nexus, biomedical, empresa, acerca de, salud, IA', priority: 100, language: 'es' },
  
  { category: 'general', question: '¿Cómo funciona la prueba gratuita?', answer: 'Ofrecemos una prueba gratuita de 7 días con acceso completo a la plataforma. No se requiere tarjeta de crédito para comenzar. Puede explorar todas las características de EndoGuard™ o RxGuard™ durante este período.', keywords: 'prueba gratuita, prueba, sin tarjeta, 7 días, acceso', priority: 100, language: 'es' },
  
  { category: 'general', question: '¿Mis datos de salud están seguros?', answer: 'Sí, absolutamente. Cumplimos con HIPAA y usamos encriptación estándar de la industria (AES-256) para proteger sus datos. Todos los datos se almacenan de forma segura en bases de datos encriptadas.', keywords: 'seguridad, HIPAA, privacidad, protección de datos, encriptación', priority: 100, language: 'es' },
  
  { category: 'pricing', question: '¿Cuánto cuesta EndoGuard?', answer: 'EndoGuard™ tiene dos niveles de precios: Plan Básico a $39/mes (o $390/año, ahorrando 17%) y Plan Premium a $79/mes (o $790/año, ahorrando 17%). También tenemos una Oferta Especial para Adoptadores Tempranos con 20% de descuento de por vida.', keywords: 'endoguard, precio, costo, suscripción, mensual, anual', priority: 90, language: 'es' },
  
  { category: 'pricing', question: '¿Cuánto cuesta RxGuard?', answer: 'RxGuard™ tiene el mismo precio que EndoGuard: Plan Básico a $39/mes (o $390/año) y Plan Premium a $79/mes (o $790/año). Los adoptadores tempranos obtienen 20% de descuento de por vida.', keywords: 'rxguard, precio, costo, suscripción, mensual, anual', priority: 90, language: 'es' },
  
  { category: 'endoguard', question: '¿Qué es EndoGuard?', answer: 'EndoGuard™ es una plataforma de inteligencia hormonal de grado clínico que le ayuda a rastrear y entender su salud hormonal. Evalúa su riesgo de disrupción hormonal por microplásticos, químicos disruptores endocrinos (EDC) y exposiciones ambientales.', keywords: 'endoguard, hormona, EDC, microplásticos, evaluación', priority: 95, language: 'es' },
  
  { category: 'endoguard', question: '¿Cómo funciona la evaluación de EndoGuard?', answer: 'La evaluación de EndoGuard es un cuestionario integral que cubre sus síntomas, estilo de vida, exposiciones ambientales e historial de salud. Toma aproximadamente 10-15 minutos completarlo. Nuestro algoritmo de IA analiza sus respuestas y genera una puntuación de riesgo personalizada.', keywords: 'endoguard, evaluación, cómo funciona, cuestionario', priority: 90, language: 'es' },
  
  { category: 'rxguard', question: '¿Qué es RxGuard?', answer: 'RxGuard™ es un verificador de interacciones de medicamentos impulsado por IA diseñado para proveedores de atención médica y pacientes. Analiza combinaciones de medicamentos para identificar interacciones peligrosas y sugiere alternativas más seguras.', keywords: 'rxguard, medicamento, interacciones de medicamentos, verificador, seguridad', priority: 95, language: 'es' },
  
  { category: 'support', question: '¿Cómo contacto al soporte?', answer: 'Puede contactar a nuestro equipo de soporte en support@nexusbiomedical.ai o usar el botón Reportar Error en cualquier página. Generalmente respondemos dentro de 24 horas.', keywords: 'soporte, contacto, ayuda, email, servicio al cliente', priority: 85, language: 'es' }
];

async function seedFAQData() {
  try {
    console.log('Starting FAQ data seeding...');
    
    for (const faq of faqData) {
      await query(
        'INSERT INTO faq_items (category, question, answer, keywords, priority, language) VALUES (?, ?, ?, ?, ?, ?)',
        [faq.category, faq.question, faq.answer, faq.keywords, faq.priority, faq.language]
      );
      console.log(`✓ Inserted: ${faq.question.substring(0, 50)}...`);
    }
    
    console.log(`\n✅ Successfully seeded ${faqData.length} FAQ items!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding FAQ data:', error);
    process.exit(1);
  }
}

seedFAQData();
