import fs from 'fs';
import path from 'path';

// Load FAQ database
const loadFAQDatabase = () => {
  try {
    const faqPath = path.join(process.cwd(), 'docs/MASTER_DOCUMENTATION/faq/CHATBOT_FAQ.md');
    const faqContent = fs.readFileSync(faqPath, 'utf-8');
    
    // Parse FAQ entries
    const entries = [];
    const sections = faqContent.split('---').filter(section => section.trim());
    
    sections.forEach(section => {
      const lines = section.trim().split('\n');
      let question = '';
      let answer = '';
      let tags = [];
      let confidence = 100;
      
      let currentSection = 'content';
      let answerLines = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('### ')) {
          question = line.replace('### ', '');
        } else if (line.startsWith('**Tags:**')) {
          tags = line.replace('**Tags:**', '').trim().split(',').map(t => t.trim());
        } else if (line.startsWith('**Confidence:**')) {
          confidence = parseInt(line.replace('**Confidence:**', '').replace('%', '').trim());
        } else if (line && !line.startsWith('**') && !line.startsWith('#') && question) {
          answerLines.push(line);
        }
      }
      
      if (question && answerLines.length > 0) {
        answer = answerLines.join(' ').trim();
        entries.push({
          question,
          answer,
          tags,
          confidence
        });
      }
    });
    
    return entries;
  } catch (error) {
    console.error('Error loading FAQ database:', error);
    return [];
  }
};

// Simple text similarity scoring
const calculateSimilarity = (text1, text2) => {
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 2);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
};

// Find best matching FAQ entry
const findBestMatch = (query, faqEntries) => {
  let bestMatch = null;
  let bestScore = 0;
  
  faqEntries.forEach(entry => {
    // Check question similarity
    const questionScore = calculateSimilarity(query, entry.question);
    
    // Check tag relevance
    const tagScore = entry.tags.some(tag => 
      query.toLowerCase().includes(tag.toLowerCase())
    ) ? 0.3 : 0;
    
    // Check answer keyword relevance
    const answerScore = calculateSimilarity(query, entry.answer) * 0.5;
    
    const totalScore = questionScore + tagScore + answerScore;
    
    if (totalScore > bestScore && totalScore > 0.2) {
      bestScore = totalScore;
      bestMatch = { ...entry, matchScore: totalScore };
    }
  });
  
  return bestMatch;
};

// Generate contextual response
const generateResponse = (match, query) => {
  if (!match) {
    return {
      response: "I'm sorry, I don't have specific information about that topic. Here are some things I can help you with:\n\n• Platform pricing and features\n• Account and subscription management\n• RxGuard™ drug interaction checking\n• EndoGuard™ hormone health assessments\n• Data security and privacy\n• Trial and cancellation policies\n\nFor technical support or specific medical questions, please contact our support team at support@nexusbiomedical.ai or visit our comprehensive FAQ page.",
      confidence: 0,
      sources: ['General FAQ', 'Support Contact']
    };
  }
  
  // Enhance response based on context
  let response = match.answer;
  
  // Add contextual information for specific topics
  if (match.tags.includes('pricing')) {
    response += "\n\n💡 **Tip:** All platforms offer generous free trials with no credit card required. You can explore full features before subscribing.";
  }
  
  if (match.tags.includes('trial')) {
    response += "\n\n🎯 **Next Step:** Visit the platform homepage and click 'Start Free Trial' to begin exploring immediately.";
  }
  
  if (match.tags.includes('security')) {
    response += "\n\n🔒 **Additional Info:** We use bank-level security and never store sensitive medical records. Your privacy is our top priority.";
  }
  
  return {
    response,
    confidence: Math.round(match.confidence * match.matchScore * 100),
    sources: [`FAQ Database (${match.matchScore.toFixed(2)} relevance)`]
  };
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { message, conversationHistory = [] } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Load FAQ database
    const faqEntries = loadFAQDatabase();
    
    if (faqEntries.length === 0) {
      return res.status(500).json({ error: 'FAQ database not available' });
    }
    
    // Enhance query with conversation context
    let enhancedQuery = message;
    if (conversationHistory.length > 0) {
      const recentUserMessages = conversationHistory
        .filter(msg => msg.role === 'user')
        .slice(-2)
        .map(msg => msg.content)
        .join(' ');
      enhancedQuery = `${recentUserMessages} ${message}`;
    }
    
    // Find best matching FAQ entry
    const match = findBestMatch(enhancedQuery, faqEntries);
    
    // Generate response
    const result = generateResponse(match, message);
    
    // Log for analytics (in production, store in database)
    console.log('Chatbot Query:', {
      query: message,
      match: match?.question || 'No match',
      confidence: result.confidence,
      timestamp: new Date().toISOString()
    });
    
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Chatbot API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment or contact support at support@nexusbiomedical.ai",
      confidence: 0
    });
  }
}
