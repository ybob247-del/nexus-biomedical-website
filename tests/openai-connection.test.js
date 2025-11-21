/**
 * Test OpenAI API Connection
 * Validates that the OpenAI API key is working correctly
 */

import { describe, it, expect } from 'vitest';
import { testOpenAIConnection } from '../server/services/openai-service.js';

describe('OpenAI API Connection', () => {
  it('should successfully connect to OpenAI API', async () => {
    const result = await testOpenAIConnection();
    
    expect(result).toBeDefined();
    expect(result.success).toBe(true);
    expect(result.message).toBeDefined();
    expect(typeof result.message).toBe('string');
    expect(result.message.length).toBeGreaterThan(0);
  }, 15000); // 15 second timeout for API call
});
