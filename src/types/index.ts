interface BaseEntry {
	slug: string
	title: string
	subtitle: string
	client?: string
	year: string
	category: string
	tech: string[]
	status: 'ACTIVE' | 'COMPLETE' | 'ARCHIVED'
	description: string
	images: string[]
	featured: boolean
	externalLink?: string
}

export interface Project extends BaseEntry {
	type: 'project'
	challenge: string
	architecture: string
	results: string
}

export interface JobRole extends BaseEntry {
	type: 'jobRole'
	responsibilities: string
	technologies: string
}

export type ProjectEntry = Project | JobRole

export interface ContactFormData {
	company: string
	budget: '$10k–$25k' | '$25k–$50k' | '$50k+'
	details: string
	email: string
}
