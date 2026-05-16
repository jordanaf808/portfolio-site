import { contactSchema } from './contactSchema'

export type { ContactData } from './contactSchema'

export type ValidationResult =
  | { valid: true; data: import('./contactSchema').ContactData }
  | { valid: false; errors: Record<string, string> }

export function validateContact(raw: unknown): ValidationResult {
  const result = contactSchema.safeParse(raw)
  if (result.success) {
    return { valid: true, data: result.data }
  }
  const errors: Record<string, string> = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0])
    if (!errors[key]) errors[key] = issue.message
  }
  return { valid: false, errors }
}
