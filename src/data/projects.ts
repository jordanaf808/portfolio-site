import type { Project } from '../types/index.ts'

export const projects: Project[] = []

export function getFeaturedProjects(): Project[] {
	return projects.filter((p) => p.featured)
}
