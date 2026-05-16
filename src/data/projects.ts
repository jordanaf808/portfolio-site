import type { Project } from '../types/index.ts'

export const projects: Project[] = []

export function getProjectBySlug(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug)
}

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.featured)
}
