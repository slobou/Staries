import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Chapter,
  LicenseOffers,
  LicensePurchase,
  Registration,
  Work,
} from '@/lib/types'

/**
 * Off-chain library: works, chapters and purchases.
 *
 * Persisted in localStorage for the MVP. Only *proofs* live on Stellar; the text
 * stays here (and later in IPFS / a database). Swapping the persistence layer
 * only requires replacing this store — components talk to its actions.
 */

export const DEFAULT_OFFERS: LicenseOffers = {
  reading: 0,
  commercial: null,
  translation: null,
  adaptation: null,
}

export interface NewWorkInput {
  authorAddress: string
  authorName: string
  title: string
  synopsis: string
  genre: string
  language: string
  offers: LicenseOffers
}

export interface NewChapterInput {
  workId: string
  number: number
  title: string
  content: string
}

interface LibraryState {
  works: Work[]
  chapters: Chapter[]
  purchases: LicensePurchase[]

  createWork: (input: NewWorkInput) => Work
  updateOffers: (workId: string, offers: LicenseOffers) => void
  createChapter: (input: NewChapterInput) => Chapter
  updateChapter: (
    chapterId: string,
    patch: Partial<Pick<Chapter, 'title' | 'number' | 'content'>>
  ) => void
  addRegistration: (chapterId: string, registration: Registration) => void
  addPurchase: (purchase: Omit<LicensePurchase, 'id' | 'createdAt'>) => void
}

const now = () => new Date().toISOString()

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set) => ({
      works: [],
      chapters: [],
      purchases: [],

      createWork: (input) => {
        const work: Work = { ...input, id: crypto.randomUUID(), createdAt: now() }
        set((s) => ({ works: [work, ...s.works] }))
        return work
      },

      updateOffers: (workId, offers) =>
        set((s) => ({
          works: s.works.map((w) => (w.id === workId ? { ...w, offers } : w)),
        })),

      createChapter: (input) => {
        const timestamp = now()
        const chapter: Chapter = {
          ...input,
          id: crypto.randomUUID(),
          createdAt: timestamp,
          updatedAt: timestamp,
          registrations: [],
        }
        set((s) => ({ chapters: [...s.chapters, chapter] }))
        return chapter
      },

      updateChapter: (chapterId, patch) =>
        set((s) => ({
          chapters: s.chapters.map((c) =>
            c.id === chapterId ? { ...c, ...patch, updatedAt: now() } : c
          ),
        })),

      addRegistration: (chapterId, registration) =>
        set((s) => ({
          chapters: s.chapters.map((c) =>
            c.id === chapterId
              ? {
                  ...c,
                  registrations: [...c.registrations, registration],
                  updatedAt: now(),
                }
              : c
          ),
        })),

      addPurchase: (purchase) =>
        set((s) => ({
          purchases: [
            { ...purchase, id: crypto.randomUUID(), createdAt: now() },
            ...s.purchases,
          ],
        })),
    }),
    {
      name: 'staries-library',
      version: 1,
      skipHydration: true,
    }
  )
)
