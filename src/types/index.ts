import type { ImageMetadata } from 'astro'

export interface ImageItem {
	/** Imported image module — optimized by astro:assets at build time. */
	src: ImageMetadata
	/** Accessibility text. Falls back to a generic label when absent. */
	alt?: string
	/** Editorial text displayed on-page in the slideshow. */
	caption?: string
}

export interface VideoItem {
	src: string
	/** Imported image module shown before playback and as the thumbnail. */
	poster: ImageMetadata
	alt?: string
	caption?: string
}

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
	images: ImageItem[]
	videos?: VideoItem[]
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
	responsibilities?: string | string[]
	technologies?: string | string[]
}

export type ProjectEntry = Project | JobRole

export interface ContactFormData {
	company: string
	details: string
	email: string
}
