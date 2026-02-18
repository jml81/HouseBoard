import { describe, it, expect } from 'vitest';
import { isValidEmail } from './validation-utils.js';

describe('isValidEmail', () => {
  it('accepts valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('asukas@talo.fi')).toBe(true);
    expect(isValidEmail('first.last@domain.co.uk')).toBe(true);
    expect(isValidEmail('user+tag@example.com')).toBe(true);
  });

  it('rejects invalid email addresses', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @domain.com')).toBe(false);
    expect(isValidEmail('user@domain com')).toBe(false);
  });

  it('rejects emails exceeding 254 characters', () => {
    const longLocal = 'a'.repeat(243);
    const longEmail = `${longLocal}@example.com`;
    expect(longEmail.length).toBeGreaterThan(254);
    expect(isValidEmail(longEmail)).toBe(false);
  });
});
