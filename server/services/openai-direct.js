/**
 * Direct OpenAI API Service (Bypasses SDK)
 * 
 * This service uses raw HTTPS requests instead of the OpenAI SDK
 * to avoid authentication issues in certain environments.
 */

import https from 'https';

class OpenAIDirectService {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY;
    this.baseURL = 'api.openai.com';
  }

  /**
   * Make a raw HTTPS request to OpenAI API
   */
  async makeRequest(path, method, data = null) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: this.baseURL,
        port: 443,
        path: path,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      };

      if (data) {
        const postData = JSON.stringify(data);
        options.headers['Content-Length'] = Buffer.byteLength(postData);
      }

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsed = JSON.parse(responseData);
            
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(parsed);
            } else {
              reject(new Error(parsed.error?.message || `HTTP ${res.statusCode}: ${responseData}`));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${responseData}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Create a chat completion
   */
  async createChatCompletion(options) {
    const {
      model = 'gpt-4o-mini',
      messages,
      temperature = 0.7,
      max_tokens = 1000,
      top_p = 1,
      frequency_penalty = 0,
      presence_penalty = 0
    } = options;

    const data = {
      model,
      messages,
      temperature,
      max_tokens,
      top_p,
      frequency_penalty,
      presence_penalty
    };

    return await this.makeRequest('/v1/chat/completions', 'POST', data);
  }

  /**
   * Analyze drug interactions with AI
   */
  async analyzeDrugInteractions(medications) {
    const prompt = `You are a clinical pharmacist AI. Analyze potential interactions between these medications:

${medications.map((med, i) => `${i + 1}. ${med.name}`).join('\n')}

Provide:
1. Severity level (LOW/MODERATE/HIGH)
2. Key interactions to watch for
3. Clinical recommendations
4. Monitoring suggestions

Format as JSON with: { severity, interactions: [], recommendations: [], monitoring: [] }`;

    const response = await this.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a clinical pharmacist AI assistant. Provide evidence-based drug interaction analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    });

    try {
      const content = response.choices[0].message.content;
      // Try to extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { raw: content };
    } catch (error) {
      return { raw: response.choices[0].message.content };
    }
  }

  /**
   * Analyze hormone health assessment with AI
   */
  async analyzeHormoneHealth(assessmentData) {
    const prompt = `You are an endocrinology specialist AI. Analyze this hormone health assessment:

Age: ${assessmentData.age}
Sex: ${assessmentData.biologicalSex}
Symptoms: ${assessmentData.symptoms.join(', ')}
Lifestyle Factors: ${JSON.stringify(assessmentData.lifestyle)}
EDC Exposure: ${JSON.stringify(assessmentData.edcExposure)}

Provide:
1. Risk assessment (0-100 scale)
2. Hormone systems affected
3. Personalized recommendations
4. Priority actions
5. Educational insights

Format as JSON with: { riskScore, affectedSystems: [], recommendations: [], priorities: [], education: [] }`;

    const response = await this.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an endocrinology specialist AI assistant. Provide evidence-based hormone health analysis.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    try {
      const content = response.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { raw: content };
    } catch (error) {
      return { raw: response.choices[0].message.content };
    }
  }

  /**
   * Generate personalized health recommendations
   */
  async generateRecommendations(context) {
    const response = await this.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a healthcare AI assistant. Provide personalized, evidence-based health recommendations.'
        },
        {
          role: 'user',
          content: `Generate 5 personalized health recommendations based on: ${JSON.stringify(context)}`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    return response.choices[0].message.content;
  }

  /**
   * Test API connection
   */
  async testConnection() {
    try {
      const response = await this.createChatCompletion({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "Connected!"' }],
        max_tokens: 10
      });
      return {
        success: true,
        message: response.choices[0].message.content,
        model: response.model
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const openaiService = new OpenAIDirectService();
export default openaiService;

// Also export class for custom instances
export { OpenAIDirectService };
