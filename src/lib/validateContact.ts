import type { ContactFormData } from '../types/index.ts';

const VALID_BUDGETS: ContactFormData['budget'][] = ['$10k–$25k', '$25k–$50k', '$50k+'];

type ValidationResult =
  | { valid: true; data: ContactFormData }
  | { valid: false; error: string };

export function validateContact(body: unknown): ValidationResult {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, error: 'Invalid request body' };
  }
  const b = body as Record<string, unknown>;

  if (!b.company || typeof b.company !== 'string' || b.company.trim().length < 2) {
    return { valid: false, error: 'Company name required' };
  }
  if (!b.email || typeof b.email !== 'string' || !b.email.includes('@')) {
    return { valid: false, error: 'Valid email required' };
  }
  if (!b.details || typeof b.details !== 'string' || b.details.trim().length < 10) {
    return { valid: false, error: 'Project details required (min 10 characters)' };
  }
  if (!VALID_BUDGETS.includes(b.budget as ContactFormData['budget'])) {
    return { valid: false, error: 'Invalid budget range' };
  }

  return {
    valid: true,
    data: {
      company: (b.company as string).trim(),
      budget: b.budget as ContactFormData['budget'],
      details: (b.details as string).trim(),
      email: (b.email as string).trim().toLowerCase(),
    },
  };
}
