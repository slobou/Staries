import {
  BASE_FEE,
  Memo,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk'
import {
  EXPLORER_BASE_URL,
  NETWORK_PASSPHRASE,
  REGISTRY_DATA_KEY,
  REGISTRY_MEMO,
} from './config'
import { isValidHash, sha256Hex } from './hash'
import { StellarNotFoundError, horizonGet, horizonServer } from './horizon'

/**
 * Signs an unsigned transaction envelope (XDR) and returns the signed XDR.
 * Injected by the caller so this module stays free of any wallet/UI dependency
 * (and can be exercised from plain Node scripts with a Keypair).
 */
export type TransactionSigner = (xdr: string) => Promise<string>

/** A public authorship record, reconstructed purely from the Stellar network. */
export interface OnChainCertificate {
  txId: string
  /** SHA-256 fingerprint of the registered content. */
  hash: string
  /** Stellar account that signed the record (the author's wallet). */
  author: string
  /** Ledger close time of the transaction (ISO 8601). Immutable timestamp. */
  createdAt: string
  ledger: number
  explorerUrl: string
}

export function getTransactionUrl(txId: string): string {
  return `${EXPLORER_BASE_URL}/tx/${txId}`
}

export function getAccountUrl(address: string): string {
  return `${EXPLORER_BASE_URL}/account/${address}`
}

/** Builds the unsigned transaction that anchors `hash` to the author's account. */
export async function buildRegistrationXdr(
  authorAddress: string,
  hash: string
): Promise<string> {
  if (!isValidHash(hash)) throw new Error('Invalid content hash')

  const account = await horizonServer.loadAccount(authorAddress)
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(Operation.manageData({ name: REGISTRY_DATA_KEY, value: hash }))
    .addMemo(Memo.text(REGISTRY_MEMO))
    .setTimeout(60)
    .build()

  return transaction.toXDR()
}

/**
 * Registers authorship of a piece of content:
 * hash it locally -> build tx -> sign (wallet) -> submit -> read it back from the network.
 * The certificate that is returned is read from Horizon, not echoed from local state,
 * so what the author sees is exactly what any third party will see.
 */
export async function registerContent(params: {
  authorAddress: string
  content: string
  sign: TransactionSigner
  onStep?: (step: 'hashing' | 'signing' | 'submitting' | 'confirming') => void
}): Promise<OnChainCertificate> {
  const { authorAddress, content, sign, onStep } = params

  onStep?.('hashing')
  const hash = await sha256Hex(content)

  onStep?.('signing')
  const unsignedXdr = await buildRegistrationXdr(authorAddress, hash)
  const signedXdr = await sign(unsignedXdr)

  onStep?.('submitting')
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  const result = await horizonServer.submitTransaction(signedTx)

  onStep?.('confirming')
  return fetchCertificateWithRetry(result.hash)
}

/** Horizon can take a moment to expose a just-submitted transaction. */
async function fetchCertificateWithRetry(
  txId: string,
  attempts = 5
): Promise<OnChainCertificate> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await fetchCertificate(txId)
    } catch (error) {
      const isLast = i === attempts - 1
      if (!(error instanceof StellarNotFoundError) || isLast) throw error
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
  }
  throw new StellarNotFoundError()
}

/** Raw Horizon shapes we rely on (only the fields we actually read). */
interface HorizonTransaction {
  id: string
  successful: boolean
  created_at: string
  ledger: number
  source_account: string
  memo?: string
}

interface HorizonOperation {
  type: string
  name?: string
  /** base64-encoded data-entry value */
  value?: string
}

function decodeBase64Utf8(value: string): string {
  const binary = atob(value)
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/**
 * Reads a Staries authorship certificate straight from the Stellar network.
 * Throws `StellarNotFoundError` if the transaction does not exist, or a regular
 * `Error` if it exists but is not a valid Staries record.
 */
export async function fetchCertificate(
  txId: string
): Promise<OnChainCertificate> {
  if (!/^[0-9a-f]{64}$/i.test(txId)) {
    throw new StellarNotFoundError('That is not a valid transaction id')
  }

  const [tx, ops] = await Promise.all([
    horizonGet<HorizonTransaction>(`/transactions/${txId}`),
    horizonGet<{ _embedded: { records: HorizonOperation[] } }>(
      `/transactions/${txId}/operations`
    ),
  ])

  if (!tx.successful) {
    throw new Error('This transaction failed on the network, so it is not a valid record')
  }

  const record = ops._embedded.records.find(
    (op) => op.type === 'manage_data' && op.name === REGISTRY_DATA_KEY
  )
  if (!record?.value) {
    throw new Error('This transaction is not a Staries authorship record')
  }

  const hash = decodeBase64Utf8(record.value)
  if (!isValidHash(hash)) {
    throw new Error('This transaction does not contain a valid content fingerprint')
  }

  return {
    txId: tx.id,
    hash,
    author: tx.source_account,
    createdAt: tx.created_at,
    ledger: tx.ledger,
    explorerUrl: getTransactionUrl(tx.id),
  }
}

export interface VerificationResult {
  matches: boolean
  /** Hash computed from the text supplied by the verifier. */
  computedHash: string
}

/** Checks whether `content` is exactly the text that was registered in `certificate`. */
export async function verifyContent(
  content: string,
  certificate: OnChainCertificate
): Promise<VerificationResult> {
  const computedHash = await sha256Hex(content)
  return { matches: computedHash === certificate.hash, computedHash }
}
