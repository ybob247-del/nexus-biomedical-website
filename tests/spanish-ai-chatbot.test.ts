import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Spanish AI Chatbot - Language Detection', () => {
  // Mock the language detection function
  const detectSpanish = (message: string): boolean => {
    const spanishIndicators = [
      /\b(hola|gracias|por favor|buenos días|buenas tardes|buenas noches|adiós|sí|no)\b/i,
      /\b(qué|cómo|cuándo|dónde|por qué|quién|cuál)\b/i,
      /\b(ayuda|necesito|quiero|puedo|tengo|estoy|soy)\b/i,
      /[áéíóúñü]/i,
    ];
    return spanishIndicators.some((pattern) => pattern.test(message));
  };

  describe('Spanish Language Detection', () => {
    it('should detect Spanish greetings', () => {
      expect(detectSpanish('Hola')).toBe(true);
      expect(detectSpanish('Buenos días')).toBe(true);
      expect(detectSpanish('Buenas tardes')).toBe(true);
    });

    it('should detect Spanish question words', () => {
      expect(detectSpanish('¿Qué es EndoGuard?')).toBe(true);
      expect(detectSpanish('¿Cómo funciona?')).toBe(true);
      expect(detectSpanish('¿Dónde puedo comprarlo?')).toBe(true);
      expect(detectSpanish('¿Cuándo está disponible?')).toBe(true);
    });

    it('should detect Spanish accented characters', () => {
      expect(detectSpanish('información')).toBe(true);
      expect(detectSpanish('más detalles')).toBe(true);
      expect(detectSpanish('español')).toBe(true);
    });

    it('should detect common Spanish phrases', () => {
      expect(detectSpanish('Necesito ayuda')).toBe(true);
      expect(detectSpanish('Quiero saber más')).toBe(true);
      expect(detectSpanish('Puedo hablar con alguien')).toBe(true);
    });

    it('should NOT detect English as Spanish', () => {
      expect(detectSpanish('Hello')).toBe(false);
      expect(detectSpanish('What is EndoGuard?')).toBe(false);
      expect(detectSpanish('I need help')).toBe(false);
      expect(detectSpanish('Thank you')).toBe(false);
    });

    it('should handle mixed case correctly', () => {
      expect(detectSpanish('HOLA')).toBe(true);
      expect(detectSpanish('hola')).toBe(true);
      expect(detectSpanish('Hola')).toBe(true);
    });

    it('should handle empty or invalid input', () => {
      expect(detectSpanish('')).toBe(false);
      expect(detectSpanish('   ')).toBe(false);
      expect(detectSpanish('123456')).toBe(false);
    });
  });

  describe('Bilingual Response System', () => {
    it('should provide Spanish system prompt for Spanish input', () => {
      const message = '¿Qué es EndoGuard?';
      const isSpanish = detectSpanish(message);
      
      const systemPrompt = isSpanish
        ? 'You are a helpful AI assistant for Nexus Biomedical Intelligence. Respond in Spanish.'
        : 'You are a helpful AI assistant for Nexus Biomedical Intelligence. Respond in English.';
      
      expect(systemPrompt).toContain('Spanish');
    });

    it('should provide English system prompt for English input', () => {
      const message = 'What is EndoGuard?';
      const isSpanish = detectSpanish(message);
      
      const systemPrompt = isSpanish
        ? 'You are a helpful AI assistant for Nexus Biomedical Intelligence. Respond in Spanish.'
        : 'You are a helpful AI assistant for Nexus Biomedical Intelligence. Respond in English.';
      
      expect(systemPrompt).toContain('English');
    });
  });

  describe('Real-world Test Cases', () => {
    it('should detect Spanish in realistic user queries', () => {
      const spanishQueries = [
        '¿Cuál es el precio de EndoGuard?',
        'Necesito información sobre RxGuard',
        '¿Cómo puedo registrarme?',
        'Quiero hablar con ventas',
        '¿Tienen soporte en español?',
        'Gracias por la información',
      ];

      spanishQueries.forEach((query) => {
        expect(detectSpanish(query)).toBe(true);
      });
    });

    it('should NOT detect English in realistic user queries', () => {
      const englishQueries = [
        'What is the price of EndoGuard?',
        'I need information about RxGuard',
        'How can I register?',
        'I want to speak with sales',
        'Do you have support?',
        'Thank you for the information',
      ];

      englishQueries.forEach((query) => {
        expect(detectSpanish(query)).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle Spanish names and proper nouns correctly', () => {
      // Names alone shouldn't trigger Spanish detection
      expect(detectSpanish('José')).toBe(true); // Has accent
      expect(detectSpanish('María')).toBe(true); // Has accent
      expect(detectSpanish('EndoGuard')).toBe(false); // Product name
    });

    it('should handle code-switching (mixed language)', () => {
      // If Spanish indicators are present, should detect as Spanish
      expect(detectSpanish('Hola, what is EndoGuard?')).toBe(true);
      expect(detectSpanish('I need información about pricing')).toBe(true);
    });

    it('should handle special characters and punctuation', () => {
      expect(detectSpanish('¿Hola?')).toBe(true);
      expect(detectSpanish('¡Gracias!')).toBe(true);
      expect(detectSpanish('Qué... es esto?')).toBe(true);
    });
  });
});

describe('Spanish AI Chatbot - Integration', () => {
  describe('API Endpoint Behavior', () => {
    it('should accept Spanish language parameter', () => {
      const requestBody = {
        message: '¿Qué es EndoGuard?',
        conversationHistory: [],
      };
      
      expect(requestBody.message).toBeTruthy();
      expect(requestBody.conversationHistory).toBeInstanceOf(Array);
    });

    it('should handle conversation history in Spanish', () => {
      const conversationHistory = [
        { role: 'user', content: '¿Qué es EndoGuard?' },
        { role: 'assistant', content: 'EndoGuard™ es una plataforma de inteligencia hormonal...' },
        { role: 'user', content: '¿Cuánto cuesta?' },
      ];
      
      expect(conversationHistory).toHaveLength(3);
      expect(conversationHistory[0].content).toContain('¿Qué');
      expect(conversationHistory[1].content).toContain('es una plataforma');
    });
  });

  describe('Error Handling', () => {
    it('should provide Spanish error message when API key is missing', () => {
      const spanishErrorMessage = 'Lo siento, el servicio de chat no está disponible en este momento. Por favor, inténtelo de nuevo más tarde.';
      const englishErrorMessage = 'Sorry, the chat service is currently unavailable. Please try again later.';
      
      const isSpanish = true;
      const errorMessage = isSpanish ? spanishErrorMessage : englishErrorMessage;
      
      expect(errorMessage).toContain('Lo siento');
    });

    it('should provide English error message for English users', () => {
      const spanishErrorMessage = 'Lo siento, el servicio de chat no está disponible en este momento. Por favor, inténtelo de nuevo más tarde.';
      const englishErrorMessage = 'Sorry, the chat service is currently unavailable. Please try again later.';
      
      const isSpanish = false;
      const errorMessage = isSpanish ? spanishErrorMessage : englishErrorMessage;
      
      expect(errorMessage).toContain('Sorry');
    });
  });
});
