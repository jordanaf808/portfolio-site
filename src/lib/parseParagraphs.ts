export function parseParagraphs(input?: string | string[]): string[] {
	if (!input) return []
	const items = Array.isArray(input) ? input : [input]
	const out: string[] = []
	for (let item of items) {
		if (!item) continue
		// Convert literal escape sequences ("\\n", "\\r") to real newlines
		item = item.replace(/\\r/g, '\r').replace(/\\n/g, '\n')
		// Convert <br/> tags to newlines so they are handled consistently
		item = item.replace(/<br\s*\/?\>/gi, '\n')
		// Normalize CRLF and stray CR to LF
		item = item.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
		const parts = item
			.split(/\n\s*\n/)
			.map((p) => p.trim())
			.filter(Boolean)
		out.push(...parts)
	}
	return out
}
