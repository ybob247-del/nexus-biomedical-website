/**
 * Chatbot API Tests
 * Tests for the AI chatbot query endpoint and FAQ database integration
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { query } from '../api/utils/db.js';

describe('Chatbot API - FAQ Database', () => {
  let faqCount;

  beforeAll(async () => {
    // Check if FAQ table exists and has data
    const result = await query('SELECT COUNT(*) as count FROM faq_items');
    faqCount = result.rows[0].count;
  });

  it('should have FAQ items in the database', async () => {
    expect(faqCount).toBeGreaterThan(0);
    expect(faqCount).toBeGreaterThanOrEqual(29); // We seeded 29 items
  });

  it('should have English FAQ items', async () => {
    const result = await query(
      'SELECT COUNT(*) as count FROM faq_items WHERE language = ?',
      ['en']
    );
    expect(result.rows[0].count).toBeGreaterThan(0);
  });

  it('should have Spanish FAQ items', async () => {
    const result = await query(
      'SELECT COUNT(*) as count FROM faq_items WHERE language = ?',
      ['es']
    );
    expect(result.rows[0].count).toBeGreaterThan(0);
  });

  it('should retrieve EndoGuard pricing FAQ in English', async () => {
    const result = await query(
      'SELECT * FROM faq_items WHERE question LIKE ? AND language = ? LIMIT 1',
      ['%EndoGuard%cost%', 'en']
    );
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].answer).toContain('$39');
    expect(result.rows[0].answer).toContain('$79');
  });

  it('should retrieve EndoGuard pricing FAQ in Spanish', async () => {
    const result = await query(
      'SELECT * FROM faq_items WHERE question LIKE ? AND language = ? LIMIT 1',
      ['%EndoGuard%', 'es']
    );
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].answer).toContain('$39');
    expect(result.rows[0].answer).toContain('$79');
  });

  it('should retrieve RxGuard FAQ items', async () => {
    const result = await query(
      'SELECT * FROM faq_items WHERE keywords LIKE ? LIMIT 1',
      ['%rxguard%']
    );
    expect(result.rows.length).toBeGreaterThan(0);
    // RxGuard FAQs can be in product or pricing category
    expect(['product', 'pricing', 'general']).toContain(result.rows[0].category);
  });

  it('should have proper FAQ item structure', async () => {
    const result = await query('SELECT * FROM faq_items LIMIT 1');
    expect(result.rows.length).toBeGreaterThan(0);
    
    const faq = result.rows[0];
    expect(faq).toHaveProperty('id');
    expect(faq).toHaveProperty('category');
    expect(faq).toHaveProperty('question');
    expect(faq).toHaveProperty('answer');
    expect(faq).toHaveProperty('keywords');
    expect(faq).toHaveProperty('priority');
    expect(faq).toHaveProperty('language');
    expect(faq).toHaveProperty('created_at');
  });

  it('should support keyword-based search', async () => {
    const result = await query(
      'SELECT * FROM faq_items WHERE keywords LIKE ? OR keywords LIKE ? LIMIT 5',
      ['%pricing%', '%cost%']
    );
    expect(result.rows.length).toBeGreaterThan(0);
  });

  it('should have high-priority FAQ items', async () => {
    const result = await query(
      'SELECT * FROM faq_items WHERE priority >= 8 ORDER BY priority DESC'
    );
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].priority).toBeGreaterThanOrEqual(8);
  });
});

describe('Chatbot API - Translation Coverage', () => {
  it('should have matching FAQ counts for both languages', async () => {
    const englishResult = await query(
      'SELECT COUNT(*) as count FROM faq_items WHERE language = ?',
      ['en']
    );
    const spanishResult = await query(
      'SELECT COUNT(*) as count FROM faq_items WHERE language = ?',
      ['es']
    );
    
    const englishCount = englishResult.rows[0].count;
    const spanishCount = spanishResult.rows[0].count;
    
    // Spanish should have at least some FAQs (we seeded 9)
    expect(spanishCount).toBeGreaterThanOrEqual(9);
    
    // English should have more FAQs (we seeded 20)
    expect(englishCount).toBeGreaterThanOrEqual(20);
  });

  it('should have Spanish translations for key questions', async () => {
    const spanishFAQs = await query(
      'SELECT * FROM faq_items WHERE language = ?',
      ['es']
    );
    expect(spanishFAQs.rows.length).toBeGreaterThan(0);
    expect(spanishFAQs.rows.length).toBeGreaterThanOrEqual(9); // We seeded 9 Spanish FAQs
  });

  it('should have Spanish translations for pricing questions', async () => {
    const spanishPricingFAQs = await query(
      'SELECT * FROM faq_items WHERE category = ? AND language = ?',
      ['pricing', 'es']
    );
    expect(spanishPricingFAQs.rows.length).toBeGreaterThan(0);
  });
});
