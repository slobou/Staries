# Staries × Stellar

**Authorship you can prove. Stories you can license.**

Staries is a reading and writing platform by NOIR. This version adds a blockchain layer on the [Stellar](https://stellar.org) network so that every author can generate **verifiable proof of authorship** for what they write, and get paid directly when someone licenses it.

> Status: hackathon MVP running on **Stellar Testnet**. See [Limitations](docs/ARCHITECTURE.md#limitations-and-honest-caveats) before using it for anything real.

## The problem

Authors publish before they can prove they wrote something. Plagiarism, copied work and unclear dates leave them without evidence, and licensing a story still means emails, contracts and intermediaries.

## What Staries does

1. **Fingerprint** — the chapter text is hashed (SHA-256) in the author's browser. The text itself never leaves the device for this step.
2. **Anchor** — the fingerprint is written to Stellar with a `manageData` operation, signed by the author's own wallet. The ledger gives it an immutable timestamp and the author's public key.
3. **Certificate** — every registration gets a public page, `/certificate/<transaction id>`, rebuilt only from data read from the Stellar network, with a link to Stellar Expert.
4. **Verify** — anyone can paste a text and check, in their own browser, whether it matches the registered fingerprint. A single changed character fails.
5. **License** — readers pay the author directly (wallet to wallet, no intermediary) for commercial, translation or adaptation licenses. The payment is public proof too.

| Capability | Status |
| --- | --- |
| Authorship registry on Stellar | Live |
| Public certificate + independent verification | Live |
| Versioned chapters (each edit = new certificate) | Live |
| Direct license payments in XLM | Live |
| Automatic "authorship verified" check in the reader | Live |
| Work token (author-issued asset) | Roadmap |
| Royalty splits / programmable licenses (Soroban) | Roadmap |
| Stablecoin (USDC) payments | Roadmap — one-line swap point |

## Quick start

Requirements: Node 20+, a Stellar wallet browser extension ([Freighter](https://www.freighter.app/) recommended) set to **Testnet**.

```bash
npm install
npm run dev          # http://localhost:3000
```

Then, in the app: **Connect wallet → Get free test XLM (Friendbot) → Write → New Star → New chapter → Publish & protect on Stellar.** The full walkthrough is in [docs/DEMO.md](docs/DEMO.md).

Optional configuration lives in `.env.local` (see `.env.example`): `NEXT_PUBLIC_STELLAR_NETWORK` and `NEXT_PUBLIC_HORIZON_URL`.

### Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | Static checks |
| `npm run smoke` | End-to-end proof on Testnet with throwaway accounts: register, verify, tamper check, license payment |
| `npm run handoff -- people` | Generate one zip per contributor with GitHub Desktop instructions, see [docs/WORK_PACKAGES.md](docs/WORK_PACKAGES.md) |

## Project map

```text
app/                    Next.js App Router pages (landing, write, certificate, verify, explore, stars, activity)
components/             UI by area: brand, ui, landing, studio, publish, certificate, license, catalog, reader, activity
hooks/                  Wallet, signer, publish, certificate and purchase flows
lib/stellar/            Stellar core: config, hashing, Horizon access, registry, payments
lib/                    Domain types and library helpers
store/                  Wallet and library state (zustand)
docs/                   Architecture, demo script, work packages
scripts/                Testnet smoke test and handoff tooling
```

## Documentation

- [Architecture and decisions](docs/ARCHITECTURE.md) — how it works, trust model, limitations, roadmap
- [Demo script](docs/DEMO.md) — a 5-minute walkthrough
- [Work packages](docs/WORK_PACKAGES.md) — who commits what

## Brand

Colors, typography and tone follow the Staries brand deck and user manual: teal `#3F8293`, star yellow `#FFD37D`, ink `#1E1E26`, Montserrat. The official Staries and NOIR logos (white, for dark backgrounds) live in `public/brand/` and are rendered by `components/brand/Logo.tsx`.

## Not legal advice

A Stellar record is strong **technical evidence** of *what existed, when, and under which key*. It does not replace a legal copyright registration and it does not by itself establish who the original author is. Moral rights and the validity of evidence vary by country.
