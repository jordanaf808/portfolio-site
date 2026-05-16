import { describe, it, expect } from 'vitest';
import { validateContact } from './validateContact.ts';

describe('validateContact', () => {
  const valid = {
    company: 'Acme Corp',
    email: 'ceo@acme.com',
    details: 'We need a new headless Shopify storefront.',
  };

  it('rejects null body', () => {
    expect(validateContact(null).valid).toBe(false);
  });

  it('rejects missing company', () => {
    expect(validateContact({ ...valid, company: '' }).valid).toBe(false);
  });

  it('rejects company shorter than 2 chars', () => {
    expect(validateContact({ ...valid, company: 'A' }).valid).toBe(false);
  });

  it('rejects email without @', () => {
    expect(validateContact({ ...valid, email: 'notanemail' }).valid).toBe(false);
  });

  it('rejects details shorter than 10 chars', () => {
    expect(validateContact({ ...valid, details: 'Short' }).valid).toBe(false);
  });

  it('accepts valid input', () => {
    const result = validateContact(valid);
    expect(result.valid).toBe(true);
  });

  it('trims company and lowercases email', () => {
    const result = validateContact({ ...valid, company: '  Acme  ', email: 'CEO@ACME.COM' });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.company).toBe('Acme');
      expect(result.data.email).toBe('ceo@acme.com');
    }
  });
});
