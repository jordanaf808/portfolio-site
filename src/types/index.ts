import type { ImageMetadata } from 'astro'

export interface BaseEntry {
	slug: string
	title: string
	subtitle: string
	client?: string
	year: string
	category: string
	tech: string[]
	status: 'ACTIVE' | 'COMPLETE' | 'ARCHIVED'
	description: string | string[]
	/** Imported image modules — optimized by astro:assets at build time. */
	images: ImageMetadata[]
	featured: boolean
	externalLink?: string
}

export interface Project extends BaseEntry {
	type: 'project'
	challenge: string | string[]
	architecture: string | string[]
	results: string | string[]
}

export interface JobRole extends BaseEntry {
	type: 'jobRole'
	responsibilities: string | string[]
	technologies: string | string[]
}

export type ProjectEntry = Project | JobRole

export interface ContactFormData {
	company: string
	details: string
	email: string
}
