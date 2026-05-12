export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  client?: string;
  year: number;
  category: string;
  tech: string[];
  status: 'ACTIVE' | 'ARCHIVED';
  description: string;
  challenge: string;
  architecture: string;
  results: string;
  images: string[];
  featured: boolean;
  externalLink?: string;
}

export interface ContactFormData {
  company: string;
  budget: '$10k–$25k' | '$25k–$50k' | '$50k+';
  details: string;
  email: string;
}
