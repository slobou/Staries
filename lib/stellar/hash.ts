/**
 * Content fingerprinting.
 *
 * The hash is the "digital fingerprint" of a work: same text -> same hash,
 * one changed letter -> a completely different hash. Only the hash goes on-chain;
 * the text itself never leaves the author's browser through this module.
 */

/**
 * Canonical form used before hashing, so that invisible differences
 * (line endings, Unicode composition, surrounding whitespace) never
 * produce a different fingerprint for the "same" text.
 */
export function normalizeContent(text: string): string {
  return text.normalize('NFC').replace(/\r\n?/g, '\n').trim()
}

export async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(normalizeContent(text))
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function isValidHash(value: string): boolean {
  return /^[0-9a-f]{64}$/.test(value)
}

export function shortHash(hash: string, size = 8): string {
  return hash.length <= size * 2 + 1
    ? hash
    : `${hash.slice(0, size)}…${hash.slice(-size)}`
}
