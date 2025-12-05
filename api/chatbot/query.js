import { query } from '../utils/db.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Search FAQ database for relevant answers
    const searchTerms = message.toLowerCase().split(' ').filter(term => term.length > 3);
    
    let relevantFAQs = [];
    if (searchTerms.length > 0) {
      // Build search query with LIKE conditions
      const searchConditions = searchTerms.map(() => 
        '(question LIKE ? OR answer LIKE ? OR keywords LIKE ?)'
      ).join(' OR ');
      
      const searchParams = searchTerms.flatMap(term => [
        `%${term}%`,
        `%${term}%`,
        `%${term}%`
      ]);

      const result = await query(
        `SELECT * FROM faq_items WHERE is_active = true AND (${searchConditions}) ORDER BY priority DESC LIMIT 5`,
        searchParams
      );
      
      relevantFAQs = result.rows;
    }

    // If we have relevant FAQs, use them to generate response
    if (relevantFAQs.length > 0) {
      // Use OpenAI to generate a natural response based on FAQ data
      const response = await generateAIResponse(message, relevantFAQs, conversationHistory);
      
      return res.status(200).json({
        response: response.answer,
        confidence: response.confidence,
        sources: relevantFAQs.map(faq => faq.question)
      });
    }

    // If no relevant FAQs found, use OpenAI with general context
    const generalResponse = await generateGeneralResponse(message, conversationHistory);
    
    return res.status(200).json({
      response: generalResponse,
      confidence: 60,
      sources: []
    });

  } catch (error) {
    console.error('Chatbot query error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chatbot query',
      details: error.message 
    });
  }
}

async function generateAIResponse(userMessage, faqs, conversationHistory) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      // Fallback to first FAQ answer if no OpenAI key
      return {
        answer: faqs[0].answer,
        confidence: 75
      };
    }

    // Build context from FAQs
    const faqContext = faqs.map((faq, idx) => 
      `FAQ ${idx + 1}:\nQ: ${faq.question}\nA: ${faq.answer}`
    ).join('\n\n');

    // Build conversation context
    const conversationContext = conversationHistory
      ? conversationHistory.slice(-3).map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    const systemPrompt = `You are a helpful AI assistant for Nexus Biomedical Intelligence, a healthcare technology company. 

Our platforms:
- EndoGuard™: Clinical-grade hormone intelligence platform for tracking hormone health and EDC exposure
- RxGuard™: Medication interaction checker for healthcare providers
- ElderWatch™: Senior health monitoring (coming soon)
- PediCalc Pro™: Pediatric medication dosing (coming soon)
- ClinicalIQ™: Clinical decision support system (coming soon)

Pricing:
- Free Trial: Full platform access for 7 days, no credit card required
- Basic Plan: $39/month (or $390/year, save 17%)
- Premium Plan: $79/month (or $790/year, save 17%)
- Early Adopter Special: 20% lifetime discount ($39/month instead of $49)

Key features:
- HIPAA compliant and secure
- AI-powered health assessments
- Personalized recommendations
- SMS and email notifications
- Evidence-based clinical insights

Use the following FAQ information to answer the user's question accurately:

${faqContext}

Previous conversation:
${conversationContext}

Provide a helpful, accurate, and conversational response. If the question is not covered in the FAQs, use your general knowledge about healthcare technology and AI, but always prioritize information from the FAQs when available.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return {
      answer,
      confidence: 85
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to first FAQ answer
    return {
      answer: faqs[0].answer,
      confidence: 70
    };
  }
}

async function generateGeneralResponse(userMessage, conversationHistory) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return "I'm here to help! I can answer questions about our platforms (EndoGuard™ and RxGuard™), pricing, features, and how to get started. What would you like to know?";
    }

    const conversationContext = conversationHistory
      ? conversationHistory.slice(-3).map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    const systemPrompt = `You are a helpful AI assistant for Nexus Biomedical Intelligence. Answer questions about our healthcare AI platforms, but if you don't have specific information, politely suggest the user contact support@nexusbiomedical.ai or visit our FAQ page.

Our platforms:
- EndoGuard™: Hormone health tracking ($39-79/month, 7-day free trial)
- RxGuard™: Medication interaction checker ($39-79/month, 7-day free trial)

Previous conversation:
${conversationContext}

Be helpful, professional, and concise.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('OpenAI API error:', error);
    return "I'm here to help! I can answer questions about our platforms, pricing, and features. For specific inquiries, please contact support@nexusbiomedical.ai or visit our FAQ page.";
  }
}
