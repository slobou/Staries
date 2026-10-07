# Work packages

> Generated from `docs/work-packages.json` by `npm run handoff -- docs`. Do not edit by hand.

Two kinds of packages, to keep commits simple and safe:

- **Person 1** (the lead) commits **all the logic and the base app** (WP-01 to WP-12) straight from the working folder. Nothing risky is delegated.
- **Everyone else** adds **one small, self-contained page** (WP-13 to WP-18). Each package is one or two **new** files that no one else touches, so commits cannot conflict and nobody needs to write code.

## How to use

```bash
npm run handoff -- verify        # every changed file belongs to exactly one package
npm run handoff -- people        # writes ./handoff/people/*
```

- `handoff/people/person-1-LEAD-GUIDE.md`: the lead's checklist (commit the base, merge it first, then collect the rest).
- `handoff/people/person-N.zip` for everyone else: a `START HERE.md` with step-by-step **GitHub Desktop** instructions (no terminal) and the new file(s) with their commit message. `./handoff` and `./contrib` are git-ignored.

Other commands: `export all` (one zip per package), `list`, `check` (replays all packages in order and typechecks each step), `docs` (regenerates this file).

**Order:** the lead merges the base first. After that the small page packages can be merged in any order.

## Overview

Merge **wave** = the earliest round in which a package can be merged (everything it depends on is in an earlier wave). Packages in the same wave can be merged in any order.

| WP | Package | Wave | Depends on | Files | Assignee |
| --- | --- | --- | --- | --- | --- |
| 01 | Stellar core: network config, hashing and authorship registry | 1 | — | 7 | Person 1 |
| 02 | License payments, wallet signing hooks and Testnet smoke test | 2 | WP-01 | 6 | Person 1 |
| 03 | Domain model and library store | 1 | — | 5 | Person 1 |
| 04 | Brand foundation and UI kit | 1 | — | 14 | Person 1 |
| 05 | App shell and wallet gating | 3 | WP-01, WP-02, WP-03, WP-04 | 7 | Person 1 |
| 06 | Landing page | 2 | WP-04 | 9 | Person 1 |
| 07 | Author studio: Stars and license pricing | 4 | WP-03, WP-04, WP-05 | 8 | Person 1 |
| 08 | Chapter editor and publish-to-Stellar flow | 5 | WP-01, WP-02, WP-03, WP-04, WP-05, WP-07 | 7 | Person 1 |
| 09 | Public certificate and verification | 2 | WP-01, WP-03, WP-04 | 6 | Person 1 |
| 10 | License purchase and activity history | 4 | WP-02, WP-03, WP-04, WP-05 | 4 | Person 1 |
| 11 | Catalog, Star page and chapter reader | 5 | WP-03, WP-04, WP-09, WP-10 | 7 | Person 1 |
| 12 | Documentation and contributor tooling | 1 | — | 8 | Person 1 |
| 13 | 404 page and loading screen | 2 | WP-04 | 2 | Person 2 |
| 14 | Error page and catalog skeleton | 2 | WP-04 | 3 | Person 3 |
| 15 | About and How it works pages | 2 | WP-04 | 2 | Person 4 |
| 16 | FAQ and Glossary pages | 2 | WP-04 | 2 | Person 5 |
| 17 | Roadmap and Legal notes pages | 2 | WP-04 | 2 | Person 6 |
| 18 | Wallet guide and Brand kit pages | 2 | WP-04 | 2 | Person 7 |

## By person

- **Person 1**: WP-01 stellar-core, WP-02 payments-and-signing, WP-03 data-layer, WP-04 brand-and-ui, WP-05 app-shell-and-wallet, WP-06 landing-page, WP-07 author-studio, WP-08 chapter-publishing, WP-09 certificates-and-verification, WP-10 licensing-and-activity, WP-11 catalog-and-reader, WP-12 docs-and-tooling
- **Person 2**: WP-13 not-found-and-loading
- **Person 3**: WP-14 error-and-skeletons
- **Person 4**: WP-15 about-and-how-it-works
- **Person 5**: WP-16 faq-and-glossary
- **Person 6**: WP-17 roadmap-and-legal
- **Person 7**: WP-18 wallet-guide-and-brand-kit

## WP-01 — Stellar core: network config, hashing and authorship registry

The heart of the product: SHA-256 content fingerprint, the manageData registration transaction, and reading a certificate back from Horizon.

Depends on: nothing

Suggested commit message:

```text
Add Stellar core: config, content hashing and authorship registry

Hash content with SHA-256 in the browser, anchor it on Stellar with a
manageData operation, and read certificates back from Horizon so anyone
can verify them without trusting Staries.
```

Files:

- `.env.example`
- `.gitignore`
- `lib/stellar/config.ts`
- `lib/stellar/hash.ts`
- `lib/stellar/horizon.ts`
- `lib/stellar/registry.ts`
- `utils/stellarUtils.ts`

## WP-02 — License payments, wallet signing hooks and Testnet smoke test

Direct author payments, the hook that signs with the connected wallet, Friendbot funding, and an end-to-end script that proves the core works on Testnet.

Depends on: WP-01

Suggested commit message:

```text
Add license payments, wallet signer hook and Testnet smoke test

Payments go buyer -> author with no intermediary. useStellarSigner delegates
signing to the connected wallet (Staries never sees private keys).
`npm run smoke` exercises register -> verify -> tamper -> pay on Testnet.
```

Files:

- `hooks/useAccountBalance.ts`
- `hooks/useStellarSigner.ts`
- `lib/stellar/payments.ts`
- `package-lock.json`
- `package.json`
- `scripts/smoke-stellar.ts`

## WP-03 — Domain model and library store

Types for Stars, chapters, registrations and purchases, plus the persisted zustand store that holds off-chain data.

Depends on: nothing

Suggested commit message:

```text
Add domain model and persisted library store

Works, chapters (with versioned on-chain registrations) and license
purchases. Persisted in localStorage for the MVP behind a single store so
the backend can be swapped later.
```

Files:

- `hooks/useLibrary.ts`
- `lib/catalog.ts`
- `lib/library.ts`
- `lib/types.ts`
- `store/libraryStore.ts`

## WP-04 — Brand foundation and UI kit

Design tokens from the Staries brand deck (teal #3F8293, star #FFD37D, ink #1E1E26), the official Staries and NOIR logos, the star shape and the shared UI primitives.

Depends on: nothing

Suggested commit message:

```text
Add Staries brand tokens, logo and UI kit

Colors and typography follow the brand deck and user manual. Adds the
official Staries and NOIR logos, Logo, StarShape and the shared primitives (Button, Card, Badge, Field, Alert,
Spinner, EmptyState, Icon, PageShell).
```

Files:

- `app/globals.css`
- `components/brand/Logo.tsx`
- `components/brand/StarShape.tsx`
- `components/ui/Alert.tsx`
- `components/ui/Badge.tsx`
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`
- `components/ui/EmptyState.tsx`
- `components/ui/Field.tsx`
- `components/ui/Icon.tsx`
- `components/ui/PageShell.tsx`
- `components/ui/Spinner.tsx`
- `public/brand/noir-logo.png`
- `public/brand/staries-logo.png`

## WP-05 — App shell and wallet gating

Root layout, branded navbar and footer, startup bootstrap (wallet kit + store hydration), and the RequireWallet / FundingNotice components.

Depends on: WP-01, WP-02, WP-03, WP-04

Suggested commit message:

```text
Add branded app shell, navbar and wallet gating

Root layout with Montserrat, navbar with network badge and wallet pill,
footer, AppBootstrap, and RequireWallet/FundingNotice (one-click Testnet
funding through Friendbot).
```

Files:

- `app/layout.tsx`
- `components/AppBootstrap.tsx`
- `components/Footer.tsx`
- `components/Navbar.tsx`
- `components/wallet/FundingNotice.tsx`
- `components/wallet/RequireWallet.tsx`
- `hooks/useWallet.ts`

## WP-06 — Landing page

Mission, pain points, how it works, before/after, offerings (live vs coming soon) and audience — adapted from the brand deck.

Depends on: WP-04

Suggested commit message:

```text
Add landing page based on the brand deck

Hero with a sample certificate, mission quote, pain points, how it works,
before/after comparison, offerings with live/coming-soon status, audience.
```

Files:

- `app/page.tsx`
- `components/landing/Audience.tsx`
- `components/landing/BeforeAfter.tsx`
- `components/landing/FinalCta.tsx`
- `components/landing/Hero.tsx`
- `components/landing/HowItWorks.tsx`
- `components/landing/Mission.tsx`
- `components/landing/Obstacles.tsx`
- `components/landing/Offerings.tsx`

## WP-07 — Author studio: Stars and license pricing

My Stars list, New Star form and the Star management page with chapter list and license pricing.

Depends on: WP-03, WP-04, WP-05

Suggested commit message:

```text
Add author studio for Stars and license pricing

Authors create Stars, set per-license prices (commercial, translation,
adaptation) and manage chapters. Personal reading is always free.
```

Files:

- `app/write/[workId]/page.tsx`
- `app/write/new/page.tsx`
- `app/write/page.tsx`
- `components/studio/LicenseOffersEditor.tsx`
- `components/studio/Studio.tsx`
- `components/studio/WorkCard.tsx`
- `components/studio/WorkForm.tsx`
- `components/studio/WorkManager.tsx`

## WP-08 — Chapter editor and publish-to-Stellar flow

Editor with live fingerprint, step-by-step publish progress, and versioned registrations (each changed publish adds a new certificate).

Depends on: WP-01, WP-02, WP-03, WP-04, WP-05, WP-07

Suggested commit message:

```text
Add chapter editor with Publish & protect on Stellar

Live SHA-256 fingerprint while writing, wallet-signed registration with
progress steps, and versioning: every changed publish adds a certificate.
```

Files:

- `app/write/[workId]/chapters/[chapterId]/page.tsx`
- `app/write/[workId]/chapters/new/page.tsx`
- `components/publish/ChapterEditor.tsx`
- `components/publish/FingerprintPreview.tsx`
- `components/publish/PublishProgress.tsx`
- `hooks/useContentHash.ts`
- `hooks/usePublishChapter.ts`

## WP-09 — Public certificate and verification

Certificate page read live from Horizon, the verify-a-text tool and the Verify entry page. No wallet or account needed.

Depends on: WP-01, WP-03, WP-04

Suggested commit message:

```text
Add public certificate page and text verification

Certificates are read straight from the Stellar network. Anyone can paste
a text and check it against the registered fingerprint in their browser.
```

Files:

- `app/certificate/[txId]/page.tsx`
- `app/verify/page.tsx`
- `components/certificate/CertificateCard.tsx`
- `components/certificate/CertificateView.tsx`
- `components/certificate/VerifyTextPanel.tsx`
- `hooks/useCertificate.ts`

## WP-10 — License purchase and activity history

License panel with direct on-chain payments to the author, and the Activity page with records, sales and purchases.

Depends on: WP-02, WP-03, WP-04, WP-05

Suggested commit message:

```text
Add license purchase and activity history

Buyers pay the author directly on Stellar. Activity shows authorship
records, licenses sold, income and purchases with links to public proofs.
```

Files:

- `app/activity/page.tsx`
- `components/activity/ActivityView.tsx`
- `components/license/LicensePanel.tsx`
- `hooks/usePurchaseLicense.ts`

## WP-11 — Catalog, Star page and chapter reader

Explore with search and genre filters, the public Star page, and the reader that re-verifies the text against Stellar on every open.

Depends on: WP-03, WP-04, WP-09, WP-10

Suggested commit message:

```text
Add catalog, Star page and verified chapter reader

Readers browse protected Stars, read chapters and see an automatic
"authorship verified" check that recomputes the fingerprint and compares it
with the record on Stellar.
```

Files:

- `app/explore/page.tsx`
- `app/stars/[workId]/page.tsx`
- `app/stars/[workId]/read/[chapterId]/page.tsx`
- `components/catalog/CoverArt.tsx`
- `components/catalog/ExploreView.tsx`
- `components/catalog/StarDetail.tsx`
- `components/reader/ChapterReader.tsx`

## WP-12 — Documentation and contributor tooling

README, architecture notes, demo script, generated work-package guide and the handoff script.

Depends on: nothing

Suggested commit message:

```text
Add documentation, demo script and handoff tooling

README, architecture decisions and limitations, 5-minute demo script,
work-package guide and the script used to split work between contributors.
```

Files:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/DEMO.md`
- `docs/WORK_PACKAGES.md`
- `docs/work-packages.json`
- `eslint.config.mjs`
- `scripts/handoff.mjs`
- `tsconfig.json`

## WP-13 — 404 page and loading screen

A friendly 404 and a branded loading screen. Two new files, picked up automatically by Next.js.

Depends on: WP-04

Suggested commit message:

```text
Add branded 404 page and loading screen

Not-found page with links back home, and a pulsing star shown while pages load.
```

Files:

- `app/loading.tsx`
- `app/not-found.tsx`

## WP-14 — Error page and catalog skeleton

A friendly error page plus a reusable Skeleton and a placeholder grid while the catalog loads.

Depends on: WP-04

Suggested commit message:

```text
Add error page, Skeleton and catalog loading placeholder

Error boundary with a try-again button, a reusable Skeleton block and a
placeholder grid for the Explore page.
```

Files:

- `app/error.tsx`
- `app/explore/loading.tsx`
- `components/ui/Skeleton.tsx`

## WP-15 — About and How it works pages

Why Staries exists, and a plain-language walkthrough of what happens when you publish. Pages at /about and /how-it-works.

Depends on: WP-04

Suggested commit message:

```text
Add About and How it works pages

Mission and values from the brand deck, and a five-step explanation of
fingerprint, signature, timestamp and certificate without jargon.
```

Files:

- `app/about/page.tsx`
- `app/how-it-works/page.tsx`

## WP-16 — FAQ and Glossary pages

Honest answers about proofs, keys, costs and licenses, plus a plain-language glossary. Pages at /faq and /glossary.

Depends on: WP-04

Suggested commit message:

```text
Add FAQ and Glossary pages

Collapsible questions about authorship proofs, keys, costs and licenses,
and definitions for the few technical terms users may meet.
```

Files:

- `app/faq/page.tsx`
- `app/glossary/page.tsx`

## WP-17 — Roadmap and Legal notes pages

What is live and what is next, and the honest limits of what a certificate proves. Pages at /roadmap and /legal.

Depends on: WP-04

Suggested commit message:

```text
Add Roadmap and Legal notes pages

Live and upcoming features, and plain-language legal notes: what a
certificate is, what it is not, and the Testnet caveat.
```

Files:

- `app/legal/page.tsx`
- `app/roadmap/page.tsx`

## WP-18 — Wallet guide and Brand kit pages

Five steps to get a wallet ready, and a visual brand kit with logo, colors, type, star, buttons and badges. Pages at /wallet-help and /brand.

Depends on: WP-04

Suggested commit message:

```text
Add wallet guide and brand kit pages

Step-by-step guide to install Freighter, choose Testnet and get free coins,
and a brand kit page showing the logo, color palette and UI components.
```

Files:

- `app/brand/page.tsx`
- `app/wallet-help/page.tsx`
