-- FAQ Items Table for AI Chatbot
CREATE TABLE IF NOT EXISTS faq_items (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  keywords TEXT,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  language VARCHAR(10) DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes for fast searching
CREATE INDEX idx_faq_category ON faq_items(category);
CREATE INDEX idx_faq_keywords ON faq_items(keywords);
CREATE INDEX idx_faq_language ON faq_items(language);
CREATE INDEX idx_faq_active ON faq_items(is_active);

-- Full-text search index
CREATE FULLTEXT INDEX idx_faq_fulltext ON faq_items(question, answer, keywords);

-- Insert English FAQ data
INSERT INTO faq_items (category, question, answer, keywords, priority, language) VALUES
-- General Questions
('general', 'What is Nexus Biomedical Intelligence?', 'Nexus Biomedical Intelligence is a healthcare technology company that provides AI-powered clinical decision support platforms. We offer seven revolutionary platforms including EndoGuard™ (hormone health tracking) and RxGuard™ (medication interaction checker) to help healthcare providers and patients make better-informed decisions.', 'nexus, biomedical, company, about, healthcare, AI', 100, 'en'),

('general', 'How does the free trial work?', 'We offer a 7-day free trial with full platform access. No credit card is required to start your trial. You can explore all features of EndoGuard™ or RxGuard™ during this period. After the trial ends, you can choose to subscribe to continue using the platform.', 'free trial, trial, no credit card, 7 days, access', 100, 'en'),

('general', 'Is my health data secure?', 'Yes, absolutely. We are HIPAA compliant and use industry-standard encryption (AES-256) to protect your data. All data is stored securely in encrypted databases, and we never share your personal health information with third parties without your explicit consent.', 'security, HIPAA, privacy, data protection, encryption, safe', 100, 'en'),

-- Pricing Questions
('pricing', 'How much does EndoGuard cost?', 'EndoGuard™ has two pricing tiers: Basic Plan at $39/month (or $390/year, saving 17%) and Premium Plan at $79/month (or $790/year, saving 17%). We also have an Early Adopter Special offering 20% lifetime discount at $39/month instead of $49. All plans include a 7-day free trial.', 'endoguard, price, cost, pricing, subscription, monthly, yearly', 90, 'en'),

('pricing', 'How much does RxGuard cost?', 'RxGuard™ pricing is the same as EndoGuard: Basic Plan at $39/month (or $390/year) and Premium Plan at $79/month (or $790/year). Early adopters get 20% off for life. All plans include a 7-day free trial with no credit card required.', 'rxguard, price, cost, pricing, subscription, monthly, yearly', 90, 'en'),

('pricing', 'What is the Early Adopter Special?', 'The Early Adopter Special is a limited-time offer giving you 20% off for life. Instead of paying $49/month, you pay only $39/month forever. This is our way of thanking early users who help us improve our platforms with their feedback.', 'early adopter, discount, special offer, lifetime discount, 20%', 85, 'en'),

('pricing', 'Can I cancel my subscription anytime?', 'Yes, you can cancel your subscription at any time from your account settings. There are no cancellation fees or penalties. If you cancel, you will retain access until the end of your current billing period.', 'cancel, cancellation, refund, subscription management', 80, 'en'),

('pricing', 'What is the difference between Basic and Premium plans?', 'Basic Plan includes core features like assessments, basic recommendations, and email notifications. Premium Plan adds advanced features like SMS notifications, detailed clinical reports, priority support, comparison tools, and access to all future platform updates.', 'basic, premium, plan comparison, features, difference', 85, 'en'),

-- EndoGuard Questions
('endoguard', 'What is EndoGuard?', 'EndoGuard™ is a clinical-grade hormone intelligence platform that helps you track and understand your hormone health. It assesses your risk of hormone disruption from microplastics, endocrine-disrupting chemicals (EDCs), and environmental exposures. The platform provides personalized recommendations, testing suggestions, and ongoing monitoring.', 'endoguard, hormone, EDC, microplastics, assessment', 95, 'en'),

('endoguard', 'How does the EndoGuard assessment work?', 'The EndoGuard assessment is a comprehensive questionnaire covering your symptoms, lifestyle, environmental exposures, and health history. It takes about 10-15 minutes to complete. Our AI algorithm analyzes your responses and generates a personalized risk score with detailed recommendations for reducing EDC exposure and improving hormone health.', 'endoguard, assessment, how it works, questionnaire, evaluation', 90, 'en'),

('endoguard', 'What are endocrine-disrupting chemicals (EDCs)?', 'Endocrine-disrupting chemicals (EDCs) are substances that interfere with your hormone system. Common EDCs include BPA in plastics, phthalates in personal care products, PFAS in non-stick cookware, and pesticides in food. These chemicals can cause hormone imbalances, fertility issues, thyroid problems, and other health concerns.', 'EDC, endocrine disruptors, chemicals, BPA, phthalates, PFAS', 85, 'en'),

('endoguard', 'Is the EndoGuard assessment a medical diagnosis?', 'No, the EndoGuard assessment is for educational purposes only and does not constitute medical advice or diagnosis. It provides risk assessment and recommendations based on scientific research, but you should always consult with a qualified healthcare provider before making any health decisions.', 'endoguard, medical advice, diagnosis, disclaimer, educational', 80, 'en'),

-- RxGuard Questions
('rxguard', 'What is RxGuard?', 'RxGuard™ is an AI-powered medication interaction checker designed for healthcare providers and patients. It analyzes drug combinations to identify dangerous interactions, suggests safer alternatives, and provides detailed interaction reports. The platform uses a comprehensive drug database and machine learning to predict potential adverse effects.', 'rxguard, medication, drug interactions, checker, safety', 95, 'en'),

('rxguard', 'Who should use RxGuard?', 'RxGuard is designed for healthcare providers (doctors, pharmacists, nurses) and patients taking multiple medications. It is especially useful for elderly patients on polypharmacy, patients with chronic conditions, and anyone concerned about drug interactions.', 'rxguard, who, users, healthcare providers, patients', 85, 'en'),

('rxguard', 'How accurate is RxGuard?', 'RxGuard uses a comprehensive drug database and AI algorithms trained on millions of drug interaction cases. While highly accurate, it should be used as a decision support tool alongside professional medical judgment. Always consult with your healthcare provider before making medication changes.', 'rxguard, accuracy, reliable, trustworthy, AI', 80, 'en'),

-- Technical Questions
('technical', 'What platforms are available?', 'Currently, EndoGuard™ (hormone health) and RxGuard™ (medication interactions) are live. Coming soon: ElderWatch™ (senior health monitoring), PediCalc Pro™ (pediatric dosing), ClinicalIQ™ (clinical decision support), ReguReady™ (regulatory compliance), and SkinScan™ (dermatology AI).', 'platforms, products, services, available, coming soon', 90, 'en'),

('technical', 'Do you have a mobile app?', 'Currently, our platforms are web-based and fully responsive, working on all devices (desktop, tablet, mobile). We are planning to release dedicated iOS and Android apps in 2025. You can access all features through your mobile browser for now.', 'mobile app, iOS, Android, smartphone, tablet', 75, 'en'),

('technical', 'Can I integrate RxGuard with my EHR system?', 'We are working on EHR integration capabilities. If you are interested in integrating RxGuard with your electronic health records system, please contact our enterprise team at enterprise@nexusbiomedical.ai for more information.', 'EHR, integration, API, electronic health records, enterprise', 70, 'en'),

-- Support Questions
('support', 'How do I contact support?', 'You can contact our support team at support@nexusbiomedical.ai or use the Report Bug button on any page to submit feedback. We typically respond within 24 hours. Premium subscribers get priority support with faster response times.', 'support, contact, help, email, customer service', 85, 'en'),

('support', 'How do I reset my password?', 'Click the "Forgot Password" link on the login page. Enter your email address, and we will send you a password reset link. The link expires after 1 hour for security reasons. If you do not receive the email, check your spam folder or contact support.', 'password, reset, forgot password, login issues', 75, 'en'),

('support', 'Can I share my assessment results with my doctor?', 'Yes! You can download your assessment results as a PDF and share them with your healthcare provider. Premium subscribers can also email results directly from the platform. Your doctor can use these insights to inform treatment decisions.', 'share, doctor, results, PDF, healthcare provider', 80, 'en');

-- Insert Spanish FAQ data
INSERT INTO faq_items (category, question, answer, keywords, priority, language) VALUES
-- Preguntas Generales
('general', '¿Qué es Nexus Biomedical Intelligence?', 'Nexus Biomedical Intelligence es una empresa de tecnología de salud que proporciona plataformas de apoyo a decisiones clínicas impulsadas por IA. Ofrecemos siete plataformas revolucionarias incluyendo EndoGuard™ (seguimiento de salud hormonal) y RxGuard™ (verificador de interacciones de medicamentos).', 'nexus, biomedical, empresa, acerca de, salud, IA', 100, 'es'),

('general', '¿Cómo funciona la prueba gratuita?', 'Ofrecemos una prueba gratuita de 7 días con acceso completo a la plataforma. No se requiere tarjeta de crédito para comenzar. Puede explorar todas las características de EndoGuard™ o RxGuard™ durante este período.', 'prueba gratuita, prueba, sin tarjeta, 7 días, acceso', 100, 'es'),

('general', '¿Mis datos de salud están seguros?', 'Sí, absolutamente. Cumplimos con HIPAA y usamos encriptación estándar de la industria (AES-256) para proteger sus datos. Todos los datos se almacenan de forma segura en bases de datos encriptadas.', 'seguridad, HIPAA, privacidad, protección de datos, encriptación', 100, 'es'),

-- Preguntas de Precios
('pricing', '¿Cuánto cuesta EndoGuard?', 'EndoGuard™ tiene dos niveles de precios: Plan Básico a $39/mes (o $390/año, ahorrando 17%) y Plan Premium a $79/mes (o $790/año, ahorrando 17%). También tenemos una Oferta Especial para Adoptadores Tempranos con 20% de descuento de por vida.', 'endoguard, precio, costo, suscripción, mensual, anual', 90, 'es'),

('pricing', '¿Cuánto cuesta RxGuard?', 'RxGuard™ tiene el mismo precio que EndoGuard: Plan Básico a $39/mes (o $390/año) y Plan Premium a $79/mes (o $790/año). Los adoptadores tempranos obtienen 20% de descuento de por vida.', 'rxguard, precio, costo, suscripción, mensual, anual', 90, 'es'),

-- Preguntas de EndoGuard
('endoguard', '¿Qué es EndoGuard?', 'EndoGuard™ es una plataforma de inteligencia hormonal de grado clínico que le ayuda a rastrear y entender su salud hormonal. Evalúa su riesgo de disrupción hormonal por microplásticos, químicos disruptores endocrinos (EDC) y exposiciones ambientales.', 'endoguard, hormona, EDC, microplásticos, evaluación', 95, 'es'),

('endoguard', '¿Cómo funciona la evaluación de EndoGuard?', 'La evaluación de EndoGuard es un cuestionario integral que cubre sus síntomas, estilo de vida, exposiciones ambientales e historial de salud. Toma aproximadamente 10-15 minutos completarlo. Nuestro algoritmo de IA analiza sus respuestas y genera una puntuación de riesgo personalizada.', 'endoguard, evaluación, cómo funciona, cuestionario', 90, 'es'),

-- Preguntas de RxGuard
('rxguard', '¿Qué es RxGuard?', 'RxGuard™ es un verificador de interacciones de medicamentos impulsado por IA diseñado para proveedores de atención médica y pacientes. Analiza combinaciones de medicamentos para identificar interacciones peligrosas y sugiere alternativas más seguras.', 'rxguard, medicamento, interacciones de medicamentos, verificador, seguridad', 95, 'es'),

-- Preguntas de Soporte
('support', '¿Cómo contacto al soporte?', 'Puede contactar a nuestro equipo de soporte en support@nexusbiomedical.ai o usar el botón Reportar Error en cualquier página. Generalmente respondemos dentro de 24 horas.', 'soporte, contacto, ayuda, email, servicio al cliente', 85, 'es');
