import type { Project } from '../types/index.ts'

export const projects: Project[] = []

function parseEndYear(year: string): number {
	const parts = year.split(' - ')
	return new Date(parts[parts.length - 1].trim()).getTime()
}

export function sortByMostRecent<T extends { year: string }>(entries: T[]): T[] {
	return [...entries].sort((a, b) => parseEndYear(b.year) - parseEndYear(a.year))
}

export function getFeaturedProjects(): Project[] {
	return sortByMostRecent(projects.filter((p) => p.featured))
}
