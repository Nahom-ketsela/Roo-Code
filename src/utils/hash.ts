import { createHash } from "crypto"

/**
 * Generates a SHA-256 hash of the provided content.
 * This satisfies the content_hash requirement for the AI-Native Git Layer.
 *
 * @param content The string content to hash.
 * @returns The hash in the format: sha256:<hash_hex>
 */
export function generateContentHash(content: string): string {
	const hash = createHash("sha256").update(content).digest("hex")
	return `sha256:${hash}`
}
