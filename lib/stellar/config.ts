/**
 * Central Stellar network configuration.
 *
 * Everything network-specific lives here so that moving from Testnet to Mainnet
 * is a configuration change (env vars), not a code change.
 */

const TESTNET_PASSPHRASE = 'Test SDF Network ; September 2015'
const PUBLIC_PASSPHRASE = 'Public Global Stellar Network ; September 2015'

export type StellarNetworkName = 'testnet' | 'mainnet'

export const STELLAR_NETWORK: StellarNetworkName =
  process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'mainnet' ? 'mainnet' : 'testnet'

export const NETWORK_PASSPHRASE =
  STELLAR_NETWORK === 'mainnet' ? PUBLIC_PASSPHRASE : TESTNET_PASSPHRASE

export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ??
  (STELLAR_NETWORK === 'mainnet'
    ? 'https://horizon.stellar.org'
    : 'https://horizon-testnet.stellar.org')

export const FRIENDBOT_URL = 'https://friendbot.stellar.org'

export const EXPLORER_BASE_URL =
  STELLAR_NETWORK === 'mainnet'
    ? 'https://stellar.expert/explorer/public'
    : 'https://stellar.expert/explorer/testnet'

/**
 * `manageData` key used for every authorship record.
 * Value = SHA-256 (hex, 64 bytes — exactly the Stellar data-entry limit).
 * The key is reused on purpose: the *transaction* is the permanent proof, and
 * reusing the key avoids locking an extra 0.5 XLM reserve per registration.
 */
export const REGISTRY_DATA_KEY = 'staries:cert'

/** Memo (max 28 bytes) that tags a transaction as a Staries authorship record. */
export const REGISTRY_MEMO = 'staries:v1'

/** Prefix for license-payment memos. Final memo: `staries:lic:<8-char work id>`. */
export const LICENSE_MEMO_PREFIX = 'staries:lic:'

export const NATIVE_ASSET_CODE = 'XLM'
