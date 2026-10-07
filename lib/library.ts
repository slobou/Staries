import type { Chapter, Registration, Work } from './types'

/** Pure helpers over the library model (no React, no store access). */

export function latestRegistration(chapter: Chapter): Registration | undefined {
  return chapter.registrations[chapter.registrations.length - 1]
}

/** A chapter is published once at least one version is anchored on Stellar. */
export function isPublished(chapter: Chapter): boolean {
  return chapter.registrations.length > 0
}

export function chaptersOf(chapters: Chapter[], workId: string): Chapter[] {
  return chapters
    .filter((c) => c.workId === workId)
    .sort((a, b) => a.number - b.number)
}

/** A work is visible to readers as soon as one of its chapters is published. */
export function isWorkPublished(work: Work, chapters: Chapter[]): boolean {
  return chapters.some((c) => c.workId === work.id && isPublished(c))
}

export function nextChapterNumber(chapters: Chapter[], workId: string): number {
  const numbers = chaptersOf(chapters, workId).map((c) => c.number)
  return numbers.length ? Math.max(...numbers) + 1 : 1
}

export function wordCount(text: string): number {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}
