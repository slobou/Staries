/**
 * Staries domain model.
 *
 * Vocabulary (from the Staries brand):
 *  - Star          -> a literary work (book, story, poem)
 *  - Chapter       -> a publishable unit of a Star
 *  - Certificate   -> the on-chain authorship record of one chapter version
 *  - Constellation -> a reader's list of Stars (future)
 */

export type LicenseKind = 'reading' | 'commercial' | 'translation' | 'adaptation'

/**
 * Price per license kind, in XLM. `null` means "not offered".
 * Personal reading is always free; the other kinds are opt-in.
 */
export type LicenseOffers = Record<LicenseKind, number | null>

export interface Work {
  id: string
  /** Stellar address of the author (public key). */
  authorAddress: string
  authorName: string
  title: string
  synopsis: string
  genre: string
  language: string
  offers: LicenseOffers
  createdAt: string
}

/** One immutable authorship record = one version of one chapter. */
export interface Registration {
  txId: string
  /** SHA-256 of the chapter text at the time of registration. */
  hash: string
  /** Ledger close time reported by Stellar (ISO 8601). */
  registeredAt: string
  ledger: number
}

export interface Chapter {
  id: string
  workId: string
  number: number
  title: string
  content: string
  createdAt: string
  updatedAt: string
  /** Oldest first. The last entry is the currently published version. */
  registrations: Registration[]
}

export interface LicensePurchase {
  id: string
  workId: string
  kind: LicenseKind
  buyerAddress: string
  authorAddress: string
  amount: number
  /** Stellar transaction that moved the payment (author is paid directly). */
  txId: string
  createdAt: string
}

export const LICENSE_KINDS: ReadonlyArray<{
  kind: LicenseKind
  label: string
  description: string
}> = [
  {
    kind: 'reading',
    label: 'Personal reading',
    description: 'Read the work for yourself.',
  },
  {
    kind: 'commercial',
    label: 'Commercial use',
    description: 'Use the work in a podcast, course, product or campaign.',
  },
  {
    kind: 'translation',
    label: 'Translation',
    description: 'Translate and publish the work in another language.',
  },
  {
    kind: 'adaptation',
    label: 'Adaptation',
    description: 'Adapt the work to film, series, audio or games.',
  },
]
