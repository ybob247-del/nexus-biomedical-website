import mysql from 'mysql2/promise';

// Parse DATABASE_URL
const parseConnectionString = (url) => {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  return {
    host: match[3],
    user: match[1],
    password: match[2],
    database: match[5].split('?')[0],
    port: parseInt(match[4]),
    ssl: { rejectUnauthorized: false },
    connectTimeout: 10000
  };
};

// Static fallback FAQs shown when database is unavailable
const STATIC_FAQS = {
  en: [
    {
      id: 1,
      question: 'What is Nexus Biomedical Intelligence?',
      answer: 'Nexus Biomedical Intelligence is an AI-powered healthcare platform that provides specialized clinical decision-support tools for patients, clinicians, and healthcare organizations. Our platforms include EndoGuard™, RxGuard™, ReguReady™, ClinicalIQ™, ElderWatch™, PediCalc Pro™, and SkinScan Pro™.',
      category: 'general',
      language: 'en',
      priority: 10,
      is_active: true
    },
    {
      id: 2,
      question: 'What is EndoGuard™?',
      answer: 'EndoGuard™ is a preventive hormone risk stratification platform. It analyzes your symptoms, health history, and environmental exposures to generate a personalized hormone risk report (Low / Moderate / High) with actionable next steps for your primary care visit.',
      category: 'endoguard',
      language: 'en',
      priority: 9,
      is_active: true
    },
    {
      id: 3,
      question: 'What is RxGuard™?',
      answer: 'RxGuard™ is an AI-assisted medication interaction predictor that helps surface potential drug–drug risks and safety considerations to support clinical decision-making.',
      category: 'rxguard',
      language: 'en',
      priority: 9,
      is_active: true
    },
    {
      id: 4,
      question: 'Is EndoGuard™ a medical diagnosis tool?',
      answer: 'No. EndoGuard™ is a preventive screening and education tool. It does not diagnose disease or replace medical care. Its output is designed to help individuals and clinicians decide — together — whether further evaluation or testing may be appropriate.',
      category: 'endoguard',
      language: 'en',
      priority: 8,
      is_active: true
    },
    {
      id: 5,
      question: 'Is there a free trial?',
      answer: 'Yes. EndoGuard™ offers a free hormone risk assessment with no credit card required. Other platforms offer free trials — visit the Platforms page for current availability.',
      category: 'pricing',
      language: 'en',
      priority: 7,
      is_active: true
    },
    {
      id: 6,
      question: 'How is my data protected?',
      answer: 'Nexus Biomedical Intelligence is built on HIPAA-ready infrastructure. Your data is yours — we never sell, share, or train on it. All data is encrypted in transit and at rest.',
      category: 'technical',
      language: 'en',
      priority: 7,
      is_active: true
    },
    {
      id: 7,
      question: 'How do I contact support?',
      answer: 'You can reach our support team at support@nexusbiomedical.ai. We typically respond within one business day.',
      category: 'support',
      language: 'en',
      priority: 6,
      is_active: true
    }
  ],
  es: [
    {
      id: 1,
      question: '¿Qué es Nexus Biomedical Intelligence?',
      answer: 'Nexus Biomedical Intelligence es una plataforma de salud impulsada por IA que proporciona herramientas especializadas de apoyo a la decisión clínica para pacientes, médicos y organizaciones de salud.',
      category: 'general',
      language: 'es',
      priority: 10,
      is_active: true
    },
    {
      id: 2,
      question: '¿Qué es EndoGuard™?',
      answer: 'EndoGuard™ es una plataforma preventiva de estratificación de riesgo hormonal. Analiza sus síntomas, historial de salud y exposiciones ambientales para generar un informe personalizado de riesgo hormonal con pasos a seguir para su visita de atención primaria.',
      category: 'endoguard',
      language: 'es',
      priority: 9,
      is_active: true
    },
    {
      id: 3,
      question: '¿Es EndoGuard™ una herramienta de diagnóstico médico?',
      answer: 'No. EndoGuard™ es una herramienta de educación y detección preventiva. No diagnostica enfermedades ni reemplaza la atención médica.',
      category: 'endoguard',
      language: 'es',
      priority: 8,
      is_active: true
    },
    {
      id: 4,
      question: '¿Cómo contacto al soporte?',
      answer: 'Puede comunicarse con nuestro equipo de soporte en support@nexusbiomedical.ai.',
      category: 'support',
      language: 'es',
      priority: 6,
      is_active: true
    }
  ]
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { language = 'en', category } = req.query;

  // If DATABASE_URL is not set or is not a MySQL URL, return static fallback
  const dbUrl = process.env.DATABASE_URL || '';
  if (!dbUrl || !dbUrl.startsWith('mysql://')) {
    const lang = language === 'es' ? 'es' : 'en';
    let faqs = STATIC_FAQS[lang];
    if (category && category !== 'all') {
      faqs = faqs.filter(f => f.category === category);
    }
    return res.status(200).json(faqs);
  }

  let connection;
  try {
    // Create database connection
    const dbConfig = parseConnectionString(dbUrl);
    connection = await mysql.createConnection(dbConfig);

    // Build query
    let query = 'SELECT * FROM faq_items WHERE is_active = true AND language = ?';
    const params = [language];

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY priority DESC, created_at DESC';

    // Execute query
    const [rows] = await connection.execute(query, params);

    return res.status(200).json(rows);
  } catch (error) {
    console.error('FAQ API error:', error);
    // Fall back to static FAQs on any database error
    const lang = language === 'es' ? 'es' : 'en';
    let faqs = STATIC_FAQS[lang];
    if (category && category !== 'all') {
      faqs = faqs.filter(f => f.category === category);
    }
    return res.status(200).json(faqs);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
