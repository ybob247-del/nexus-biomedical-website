-- Expanded FAQ Database Migration
-- Adding 20+ new FAQs in both English and Spanish

-- English FAQs

-- Account Management
INSERT INTO faq_items (category, question, answer, keywords, priority, language) VALUES
('account', 'How do I update my account information?', 'You can update your account information by logging in and going to Settings > Account. Here you can change your name, email, password, notification preferences, and SMS settings. Changes are saved automatically.', 'account, update, settings, profile, change email', 75, 'en'),

('account', 'How do I delete my account?', 'To delete your account, go to Settings > Account and scroll to the bottom where you will find the "Delete Account" button. This action is permanent and will delete all your data. If you have an active subscription, it will be cancelled automatically.', 'delete account, remove account, cancel account, data deletion', 70, 'en'),

('account', 'Can I have multiple accounts?', 'Each email address can only be associated with one account. However, healthcare providers can upgrade to a Professional plan which allows managing multiple patient profiles under one account.', 'multiple accounts, multiple profiles, family accounts', 65, 'en'),

('account', 'How do I change my email address?', 'Go to Settings > Account and click "Change Email". Enter your new email address and we will send a verification link to confirm the change. You will need to verify both your old and new email addresses for security.', 'change email, update email, email address', 70, 'en'),

-- Billing & Subscriptions
('billing', 'What payment methods do you accept?', 'We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit cards. Payments are processed securely through Stripe. We do not store your credit card information on our servers.', 'payment, credit card, billing, payment methods, stripe', 80, 'en'),

('billing', 'When will I be charged?', 'For monthly subscriptions, you are charged on the same day each month. For annual subscriptions, you are charged once per year. Your first charge occurs when your free trial ends. You will receive an email reminder 3 days before your trial expires.', 'billing, charge, payment date, when charged', 75, 'en'),

('billing', 'Do you offer refunds?', 'We offer a 30-day money-back guarantee. If you are not satisfied within the first 30 days of your paid subscription, contact support@nexusbiomedical.ai for a full refund. Refunds are not available after 30 days.', 'refund, money back, guarantee, return', 80, 'en'),

('billing', 'Can I switch between monthly and annual billing?', 'Yes, you can switch between monthly and annual billing at any time from Settings > Subscription. If you switch from monthly to annual, you will receive a prorated credit. If you switch from annual to monthly, the change takes effect at the end of your annual period.', 'switch plan, change billing, monthly to annual, annual to monthly', 70, 'en'),

('billing', 'Do you offer discounts for healthcare providers?', 'Yes! Healthcare providers (doctors, nurses, pharmacists) can get 30% off Professional plans. Contact enterprise@nexusbiomedical.ai with proof of licensure to claim your discount.', 'healthcare discount, provider discount, professional discount, medical discount', 75, 'en'),

('billing', 'What happens if my payment fails?', 'If your payment fails, we will retry up to 3 times over 7 days. You will receive email notifications about the failed payment. If all retries fail, your subscription will be downgraded to the free tier and you will lose access to premium features.', 'payment failed, billing error, card declined, payment issue', 70, 'en'),

-- Technical Support
('technical', 'Why is my assessment not loading?', 'If your assessment is not loading, try these steps: 1) Refresh the page, 2) Clear your browser cache, 3) Try a different browser, 4) Check your internet connection. If the problem persists, contact support@nexusbiomedical.ai with details about your browser and device.', 'assessment not loading, loading error, technical issue, bug', 70, 'en'),

('technical', 'Can I export my data?', 'Yes, Premium subscribers can export all their data (assessments, results, history) as CSV or JSON files from Settings > Data Export. This allows you to keep a personal backup or transfer data to another healthcare provider.', 'export data, download data, data portability, backup', 75, 'en'),

('technical', 'What browsers do you support?', 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using Chrome or Firefox. Internet Explorer is not supported.', 'browser, compatibility, supported browsers, chrome, firefox', 65, 'en'),

('technical', 'Is there a desktop app?', 'Currently, we only offer a web-based platform accessible through any modern browser. We are considering desktop apps for Windows and macOS in the future. You can add our website to your home screen on mobile devices for an app-like experience.', 'desktop app, windows app, mac app, application', 60, 'en'),

-- SMS Notifications
('notifications', 'How do I enable SMS notifications?', 'Go to Settings > SMS to enable SMS notifications. Enter your phone number and verify it with the code we send. You can choose which notifications to receive: assessment reminders, health tips, subscription alerts, and more.', 'SMS, text messages, notifications, enable SMS, phone', 75, 'en'),

('notifications', 'How do I stop SMS notifications?', 'You can disable SMS notifications at any time from Settings > SMS. You can also reply STOP to any SMS message to opt out. To re-enable, go back to Settings > SMS and turn notifications back on.', 'stop SMS, disable SMS, unsubscribe SMS, opt out', 70, 'en'),

('notifications', 'Are SMS notifications free?', 'SMS notifications are included with Premium plans at no extra cost. Basic plan users can add SMS notifications for $5/month. Standard messaging rates from your carrier may apply.', 'SMS cost, SMS price, text message cost', 65, 'en'),

('notifications', 'Can I customize which notifications I receive?', 'Yes! Go to Settings > Notifications to customize which email and SMS notifications you receive. You can choose from assessment reminders, health tips, subscription updates, new feature announcements, and more.', 'customize notifications, notification preferences, email settings', 70, 'en'),

-- Privacy & Security
('privacy', 'Who can see my health data?', 'Only you can see your health data by default. We do not share your data with third parties without your explicit consent. If you choose to share your results with a healthcare provider, you control exactly what information is shared.', 'privacy, data sharing, who sees data, confidential', 85, 'en'),

('privacy', 'Is Nexus Biomedical HIPAA compliant?', 'Yes, we are fully HIPAA compliant. We implement administrative, physical, and technical safeguards to protect your health information. We conduct regular security audits and employee training to maintain compliance.', 'HIPAA, compliance, regulations, healthcare privacy', 90, 'en'),

('privacy', 'How long do you keep my data?', 'We keep your data for as long as your account is active. If you delete your account, all your data is permanently deleted within 30 days. You can request immediate deletion by contacting support@nexusbiomedical.ai.', 'data retention, how long, keep data, delete data', 70, 'en'),

('privacy', 'Do you sell my data?', 'No, we never sell your personal health data. We may use anonymized, aggregated data for research purposes, but this data cannot be traced back to individual users. Your privacy is our top priority.', 'sell data, data selling, privacy policy, data usage', 85, 'en'),

-- Platform-Specific
('endoguard', 'How often should I retake the EndoGuard assessment?', 'We recommend retaking the assessment every 3-6 months to track changes in your hormone health over time. You will receive automatic reminders. Premium subscribers can compare multiple assessments to see their progress.', 'retake assessment, how often, frequency, tracking', 75, 'en'),

('endoguard', 'Can men use EndoGuard?', 'Yes! EndoGuard is designed for all genders. The assessment includes gender-specific symptoms and recommendations. Men can track testosterone levels, erectile function, and other male hormone health indicators.', 'men, male, gender, testosterone, male hormones', 80, 'en'),

('rxguard', 'Can I check over-the-counter medications?', 'Yes, RxGuard includes over-the-counter medications, supplements, vitamins, and herbal products. Many dangerous interactions occur between prescription and OTC medications, so it is important to check everything you take.', 'OTC, over the counter, supplements, vitamins, herbal', 80, 'en'),

('rxguard', 'Does RxGuard include drug-food interactions?', 'Yes, RxGuard Premium includes drug-food and drug-alcohol interactions. For example, grapefruit juice interacts with many medications, and alcohol can be dangerous with certain drugs. The system will alert you to these interactions.', 'food interactions, drug food, grapefruit, alcohol, dietary', 75, 'en');


-- Spanish FAQs (Matching translations)

-- Gestión de Cuenta
INSERT INTO faq_items (category, question, answer, keywords, priority, language) VALUES
('account', '¿Cómo actualizo la información de mi cuenta?', 'Puede actualizar la información de su cuenta iniciando sesión y yendo a Configuración > Cuenta. Aquí puede cambiar su nombre, correo electrónico, contraseña, preferencias de notificación y configuración de SMS. Los cambios se guardan automáticamente.', 'cuenta, actualizar, configuración, perfil, cambiar email', 75, 'es'),

('account', '¿Cómo elimino mi cuenta?', 'Para eliminar su cuenta, vaya a Configuración > Cuenta y desplácese hasta el final donde encontrará el botón "Eliminar Cuenta". Esta acción es permanente y eliminará todos sus datos. Si tiene una suscripción activa, se cancelará automáticamente.', 'eliminar cuenta, borrar cuenta, cancelar cuenta, eliminación de datos', 70, 'es'),

('account', '¿Puedo tener múltiples cuentas?', 'Cada dirección de correo electrónico solo puede estar asociada con una cuenta. Sin embargo, los proveedores de atención médica pueden actualizar a un plan Profesional que permite administrar múltiples perfiles de pacientes bajo una cuenta.', 'múltiples cuentas, múltiples perfiles, cuentas familiares', 65, 'es'),

('account', '¿Cómo cambio mi dirección de correo electrónico?', 'Vaya a Configuración > Cuenta y haga clic en "Cambiar correo electrónico". Ingrese su nueva dirección de correo electrónico y le enviaremos un enlace de verificación para confirmar el cambio. Deberá verificar tanto su correo electrónico antiguo como el nuevo por seguridad.', 'cambiar email, actualizar email, dirección de correo', 70, 'es'),

-- Facturación y Suscripciones
('billing', '¿Qué métodos de pago aceptan?', 'Aceptamos todas las principales tarjetas de crédito (Visa, Mastercard, American Express, Discover) y tarjetas de débito. Los pagos se procesan de forma segura a través de Stripe. No almacenamos la información de su tarjeta de crédito en nuestros servidores.', 'pago, tarjeta de crédito, facturación, métodos de pago, stripe', 80, 'es'),

('billing', '¿Cuándo se me cobrará?', 'Para suscripciones mensuales, se le cobra el mismo día cada mes. Para suscripciones anuales, se le cobra una vez al año. Su primer cargo ocurre cuando termina su prueba gratuita. Recibirá un recordatorio por correo electrónico 3 días antes de que expire su prueba.', 'facturación, cargo, fecha de pago, cuándo cobran', 75, 'es'),

('billing', '¿Ofrecen reembolsos?', 'Ofrecemos una garantía de devolución de dinero de 30 días. Si no está satisfecho dentro de los primeros 30 días de su suscripción paga, contacte a support@nexusbiomedical.ai para un reembolso completo. Los reembolsos no están disponibles después de 30 días.', 'reembolso, devolución de dinero, garantía, devolución', 80, 'es'),

('billing', '¿Puedo cambiar entre facturación mensual y anual?', 'Sí, puede cambiar entre facturación mensual y anual en cualquier momento desde Configuración > Suscripción. Si cambia de mensual a anual, recibirá un crédito prorrateado. Si cambia de anual a mensual, el cambio entra en vigor al final de su período anual.', 'cambiar plan, cambiar facturación, mensual a anual, anual a mensual', 70, 'es'),

('billing', '¿Ofrecen descuentos para proveedores de atención médica?', 'Sí! Los proveedores de atención médica (médicos, enfermeras, farmacéuticos) pueden obtener un 30% de descuento en planes Profesionales. Contacte a enterprise@nexusbiomedical.ai con prueba de licencia para reclamar su descuento.', 'descuento médico, descuento proveedor, descuento profesional, descuento salud', 75, 'es'),

('billing', '¿Qué sucede si falla mi pago?', 'Si su pago falla, lo reintentaremos hasta 3 veces durante 7 días. Recibirá notificaciones por correo electrónico sobre el pago fallido. Si todos los reintentos fallan, su suscripción se degradará al nivel gratuito y perderá acceso a las funciones premium.', 'pago fallido, error de facturación, tarjeta rechazada, problema de pago', 70, 'es'),

-- Soporte Técnico
('technical', '¿Por qué no se carga mi evaluación?', 'Si su evaluación no se carga, intente estos pasos: 1) Actualice la página, 2) Borre el caché de su navegador, 3) Pruebe con un navegador diferente, 4) Verifique su conexión a internet. Si el problema persiste, contacte a support@nexusbiomedical.ai con detalles sobre su navegador y dispositivo.', 'evaluación no carga, error de carga, problema técnico, error', 70, 'es'),

('technical', '¿Puedo exportar mis datos?', 'Sí, los suscriptores Premium pueden exportar todos sus datos (evaluaciones, resultados, historial) como archivos CSV o JSON desde Configuración > Exportar Datos. Esto le permite mantener una copia de seguridad personal o transferir datos a otro proveedor de atención médica.', 'exportar datos, descargar datos, portabilidad de datos, respaldo', 75, 'es'),

('technical', '¿Qué navegadores soportan?', 'Soportamos las últimas versiones de Chrome, Firefox, Safari y Edge. Para la mejor experiencia, recomendamos usar Chrome o Firefox. Internet Explorer no está soportado.', 'navegador, compatibilidad, navegadores soportados, chrome, firefox', 65, 'es'),

('technical', '¿Hay una aplicación de escritorio?', 'Actualmente, solo ofrecemos una plataforma basada en web accesible a través de cualquier navegador moderno. Estamos considerando aplicaciones de escritorio para Windows y macOS en el futuro. Puede agregar nuestro sitio web a su pantalla de inicio en dispositivos móviles para una experiencia similar a una aplicación.', 'aplicación escritorio, app windows, app mac, aplicación', 60, 'es'),

-- Notificaciones SMS
('notifications', '¿Cómo habilito las notificaciones SMS?', 'Vaya a Configuración > SMS para habilitar las notificaciones SMS. Ingrese su número de teléfono y verifíquelo con el código que enviamos. Puede elegir qué notificaciones recibir: recordatorios de evaluación, consejos de salud, alertas de suscripción y más.', 'SMS, mensajes de texto, notificaciones, habilitar SMS, teléfono', 75, 'es'),

('notifications', '¿Cómo detengo las notificaciones SMS?', 'Puede deshabilitar las notificaciones SMS en cualquier momento desde Configuración > SMS. También puede responder STOP a cualquier mensaje SMS para cancelar la suscripción. Para volver a habilitar, regrese a Configuración > SMS y active las notificaciones nuevamente.', 'detener SMS, deshabilitar SMS, cancelar suscripción SMS, opt out', 70, 'es'),

('notifications', '¿Las notificaciones SMS son gratuitas?', 'Las notificaciones SMS están incluidas con los planes Premium sin costo adicional. Los usuarios del plan Básico pueden agregar notificaciones SMS por $5/mes. Pueden aplicarse tarifas de mensajería estándar de su operador.', 'costo SMS, precio SMS, costo mensaje de texto', 65, 'es'),

('notifications', '¿Puedo personalizar qué notificaciones recibo?', 'Sí! Vaya a Configuración > Notificaciones para personalizar qué notificaciones por correo electrónico y SMS recibe. Puede elegir entre recordatorios de evaluación, consejos de salud, actualizaciones de suscripción, anuncios de nuevas funciones y más.', 'personalizar notificaciones, preferencias de notificación, configuración de email', 70, 'es'),

-- Privacidad y Seguridad
('privacy', '¿Quién puede ver mis datos de salud?', 'Solo usted puede ver sus datos de salud de forma predeterminada. No compartimos sus datos con terceros sin su consentimiento explícito. Si elige compartir sus resultados con un proveedor de atención médica, usted controla exactamente qué información se comparte.', 'privacidad, compartir datos, quién ve datos, confidencial', 85, 'es'),

('privacy', '¿Nexus Biomedical cumple con HIPAA?', 'Sí, cumplimos completamente con HIPAA. Implementamos salvaguardas administrativas, físicas y técnicas para proteger su información de salud. Realizamos auditorías de seguridad regulares y capacitación de empleados para mantener el cumplimiento.', 'HIPAA, cumplimiento, regulaciones, privacidad de salud', 90, 'es'),

('privacy', '¿Cuánto tiempo conservan mis datos?', 'Conservamos sus datos mientras su cuenta esté activa. Si elimina su cuenta, todos sus datos se eliminan permanentemente dentro de 30 días. Puede solicitar la eliminación inmediata contactando a support@nexusbiomedical.ai.', 'retención de datos, cuánto tiempo, conservar datos, eliminar datos', 70, 'es'),

('privacy', '¿Venden mis datos?', 'No, nunca vendemos sus datos personales de salud. Podemos usar datos anonimizados y agregados con fines de investigación, pero estos datos no pueden rastrearse hasta usuarios individuales. Su privacidad es nuestra máxima prioridad.', 'vender datos, venta de datos, política de privacidad, uso de datos', 85, 'es'),

-- Específico de Plataforma
('endoguard', '¿Con qué frecuencia debo repetir la evaluación de EndoGuard?', 'Recomendamos repetir la evaluación cada 3-6 meses para rastrear cambios en su salud hormonal con el tiempo. Recibirá recordatorios automáticos. Los suscriptores Premium pueden comparar múltiples evaluaciones para ver su progreso.', 'repetir evaluación, con qué frecuencia, frecuencia, seguimiento', 75, 'es'),

('endoguard', '¿Pueden los hombres usar EndoGuard?', 'Sí! EndoGuard está diseñado para todos los géneros. La evaluación incluye síntomas y recomendaciones específicos de género. Los hombres pueden rastrear niveles de testosterona, función eréctil y otros indicadores de salud hormonal masculina.', 'hombres, masculino, género, testosterona, hormonas masculinas', 80, 'es'),

('rxguard', '¿Puedo verificar medicamentos de venta libre?', 'Sí, RxGuard incluye medicamentos de venta libre, suplementos, vitaminas y productos herbales. Muchas interacciones peligrosas ocurren entre medicamentos recetados y de venta libre, por lo que es importante verificar todo lo que toma.', 'venta libre, OTC, suplementos, vitaminas, herbales', 80, 'es'),

('rxguard', '¿RxGuard incluye interacciones medicamento-alimento?', 'Sí, RxGuard Premium incluye interacciones medicamento-alimento y medicamento-alcohol. Por ejemplo, el jugo de toronja interactúa con muchos medicamentos, y el alcohol puede ser peligroso con ciertos medicamentos. El sistema le alertará sobre estas interacciones.', 'interacciones alimentos, medicamento alimento, toronja, alcohol, dietético', 75, 'es');
