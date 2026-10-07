# Architecture and decisions

## Overview

```text
 Author's browser                                    Stellar network (Testnet)
┌──────────────────────────┐                        ┌──────────────────────────┐
│ 1. normalize text        │                        │                          │
│ 2. SHA-256 (WebCrypto)   │   3. unsigned XDR      │  Horizon API             │
│ 4. build manageData tx   │ ─────────────────────▶ │                          │
│    (stellar-sdk)         │                        │                          │
│ 5. wallet signs          │ ◀───── signed XDR ──── │                          │
│    (Freighter, etc.)     │                        │                          │
│ 6. submit via Horizon ───┼──────────────────────▶ │  ledger: hash + author   │
│ 7. read certificate back │ ◀───────────────────── │  + timestamp (immutable) │
└──────────────────────────┘                        └──────────────────────────┘
        │ off-chain: Stars, chapters, prices, purchases (localStorage, MVP)
```

There is **no Staries backend** in this version. The browser talks to Horizon and to the user's wallet directly. This keeps the trust model simple and the deploy trivial (static-friendly Next.js).

## Authorship registry

### What is written

One transaction per registration, one operation:

| Field | Value |
| --- | --- |
| Operation | `manageData` |
| Key | `staries:cert` |
| Value | SHA-256 of the normalized text, hex-encoded (64 bytes = exactly the `manageData` value limit) |
| Memo (text) | `staries:v1` |
| Source account | The author's public key |

### Content fingerprint

`lib/stellar/hash.ts` normalizes the text before hashing so that invisible differences do not change the fingerprint: Unicode NFC, `CRLF`/`CR` to `LF`, trimmed. The hash is computed with WebCrypto in the browser. Changing any visible character yields a completely different hash — this is what the verify tool and the reader's "authorship verified" banner rely on.

### Why the same data key is reused

Each `manageData` entry normally adds a data entry to the account and increases its minimum balance by 0.5 XLM. If every chapter used a unique key, authors would lock funds forever. Instead every registration overwrites the **same** key (`staries:cert`) and the **transaction itself** is the permanent proof: its hash, ledger, timestamp, source account and operation value never change. Certificates are addressed by transaction id, not by account data. The account's current data entry only shows the latest hash and is not used for verification.

### Reading a certificate

`lib/stellar/registry.ts#fetchCertificate(txId)` reads `/transactions/{id}` and `/transactions/{id}/operations` from Horizon, decodes the base64 `manageData` value to the hex hash and returns `{ txId, hash, author, createdAt, ledger, explorerUrl }`. The public certificate page uses only this data. If the Staries database vanished tomorrow, every certificate would still be valid and readable.

### Verification

`verifyContent(text, certificate)` recomputes the fingerprint locally and compares it with the on-chain value. Nothing is sent to a server. The reader (`components/reader/ChapterReader.tsx`) does the same on every open and shows a banner with the result.

### Versioning

Editing a published chapter and publishing again creates a **new** registration. The chapter keeps a list of registrations (`Chapter.registrations`); the latest is the current version and older certificates remain valid proofs for the text as it was at that time.

## Licenses and payments

Authors set a price per license type on each Star: personal reading (always free), commercial use, translation, adaptation (`null` = not offered). A buyer pays the author **directly** with a Stellar `payment` operation; the memo is `staries:lic:<first 8 chars of the work id>`.

- Payments are in native **XLM** for the MVP. `PAYMENT_ASSET` in `lib/stellar/payments.ts` is the single swap point for a stablecoin such as USDC (it will also need a trustline check).
- The payment transaction is the receipt: public, timestamped, linkable on Stellar Expert.
- The purchase is also recorded off-chain in the buyer's library so the Activity page can list it.

## Wallets and keys (non-custodial)

Authors and buyers use their own wallet through Stellar Wallets Kit. Staries builds the transaction, the wallet signs it, and Staries submits it. **Private keys never reach the app.**

The original proposal suggested a custodial option for people who do not know crypto. That is intentionally **not** implemented here: holding user keys carries security and regulatory weight that is out of scope for the MVP. The path to a friendlier onboarding is a smart-wallet/passkey integration (see roadmap), not custody.

## Application layers

| Layer | Where | Notes |
| --- | --- | --- |
| Stellar core | `lib/stellar/*`, `utils/stellarUtils.ts` | Framework-free, also used by `scripts/smoke-stellar.ts` |
| Wallet and signing | `store/walletStore.ts`, `hooks/useWallet.ts`, `hooks/useStellarSigner.ts` | `TransactionSigner` is `(xdr) => Promise<signedXdr>` |
| Flows | `hooks/usePublishChapter.ts`, `hooks/usePurchaseLicense.ts`, `hooks/useCertificate.ts` | Step-by-step state for the UI |
| Off-chain data | `store/libraryStore.ts`, `lib/types.ts`, `lib/library.ts` | zustand + `persist`, key `staries-library` |
| UI | `components/*`, `app/*` | Tailwind v4 tokens in `app/globals.css` |

Hydration note: both persisted stores use `skipHydration` and are rehydrated once in `AppBootstrap`, so server and first client render match. Selectors that derive new objects must be memoized (see `CertificateView`).

## Limitations and honest caveats

- **Testnet only.** Switch with `NEXT_PUBLIC_STELLAR_NETWORK=mainnet` only after a security and legal review.
- **Not a legal registry.** A hash on a ledger proves that someone controlling a key committed to that exact text at a point in time. It does not prove they are the original author (someone could register a text they copied). Its strength is being early, public and verifiable. Moral rights and evidentiary value depend on jurisdiction.
- **Catalog is per browser.** Stars, chapters and purchases live in `localStorage`. The certificates are on-chain and global, but the *catalog* (titles, text, prices) is not shared between users yet. A backend or decentralized storage (IPFS) is the next step.
- **The text is not on-chain.** Only its fingerprint is. If the text is lost, the proof cannot recreate it. Authors should keep their originals.
- **Reading licenses are not paywalled.** Personal reading is free by design in this MVP; paid licenses are for commercial, translation and adaptation rights and are recorded as payments, not enforced by code.
- **XLM, not USDC**, and no automatic royalty splits yet.
- **No private drafts server-side.** Drafts are local to the browser until published.

## Roadmap

1. Shared backend/database for the catalog, with IPFS for chapter content (hash already compatible).
2. **Work token:** author-issued Stellar asset per Star (limited supply, collectible, tradable).
3. **Soroban license contract:** license terms enforced on-chain with automatic royalty splits between co-authors, translators and the platform.
4. USDC payments and trustline onboarding.
5. Passkey/smart-wallet onboarding for non-crypto users.
6. Mainnet launch after audit.
