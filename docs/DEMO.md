# 5-minute demo script

Goal: show that an author can **prove** a text existed, unchanged, at a point in time — and get paid for licensing it — without trusting Staries.

## Before you start

- Two browser profiles (or one normal and one private window), each with a wallet extension set to **Testnet**: an **author** wallet and a **reader** wallet.
- `npm run dev` running at http://localhost:3000.
- A chapter of text ready to paste (a few paragraphs is enough).
- Optional: open [Stellar Expert (Testnet)](https://stellar.expert/explorer/testnet) in a tab.

## Script

### 1. The problem (30 s) — landing page

Open `/`. Read the mission line and the pain points: authors publish first and prove later; plagiarism and unclear dates leave them without evidence.

### 2. Create and protect (90 s) — author window

1. **Connect wallet.** Mention that Staries never sees the private key.
2. If the account is not active yet, press **Get free test XLM** (Friendbot funds it on Testnet).
3. **Write → New Star.** Fill in title, genre, language and synopsis. Set a price for **Commercial use** (e.g. 10 XLM). Reading stays free.
4. **New chapter.** Paste the text. Point at the **fingerprint** that updates live as you type: "this is the SHA-256 of the text, computed here in the browser."
5. **Publish & protect on Stellar.** Approve in the wallet. Walk through the steps: fingerprint → sign → submit → confirm.

### 3. The certificate (60 s)

Open the certificate that appears after publishing.

- Show the fingerprint, author address, date and ledger.
- Click **View on Stellar Expert** and show the `manageData` operation with the same hash. "This page is rebuilt from the blockchain, not from our database."

### 4. Verify (60 s)

1. In the certificate (or in **Verify**), paste the **exact** text → **Match**.
2. Change one character → **No match**. "Any alteration breaks the proof."

### 5. License and pay (60 s) — reader window

1. **Explore → open the Star.** Point at the **Authorship protected** badge.
2. **Buy license** (Commercial use). Approve in the wallet.
3. Show the "License purchased" confirmation with the payment link: the author was paid directly, wallet to wallet.
4. Open the chapter in the reader: the **Authorship verified — this text matches its record on Stellar** banner appears automatically.
5. **Activity** on both sides: the author sees income and the sold license; the reader sees the purchase and its proof.

### 6. Close (30 s) — roadmap

Work token for each Star, Soroban licenses with automatic royalty splits, and USDC payments. See [ARCHITECTURE.md](ARCHITECTURE.md#roadmap).

## If something goes wrong

| Symptom | Fix |
| --- | --- |
| "Account not found" / zero balance | Press **Get free test XLM** or use the [Friendbot](https://friendbot.stellar.org) |
| Wallet does not open | Check the extension is unlocked and on **Testnet** |
| Certificate shows "not found" right after publishing | The ledger needs a few seconds; refresh |
| Reader says text differs | The local text was edited after publishing; publish again to create a new version |
| Everything fails on stage | Run `npm run smoke` — it proves register, verify, tamper and payment on Testnet from the terminal |
