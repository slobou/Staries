import { Horizon } from '@stellar/stellar-sdk'
import { FRIENDBOT_URL, HORIZON_URL, STELLAR_NETWORK } from './config'

/** Shared Horizon client (used for loading accounts and submitting transactions). */
export const horizonServer = new Horizon.Server(HORIZON_URL)

export class StellarNotFoundError extends Error {
  constructor(message = 'Not found on the Stellar network') {
    super(message)
    this.name = 'StellarNotFoundError'
  }
}

/** Thin GET helper over the Horizon REST API (used for public, read-only lookups). */
export async function horizonGet<T>(path: string): Promise<T> {
  const response = await fetch(`${HORIZON_URL}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (response.status === 404) throw new StellarNotFoundError()
  if (!response.ok) {
    throw new Error(`Horizon request failed (${response.status})`)
  }
  return (await response.json()) as T
}

interface HorizonAccountResponse {
  balances: Array<{ asset_type: string; balance: string }>
}

/** Returns the native XLM balance, or `null` when the account does not exist yet. */
export async function getXlmBalance(address: string): Promise<string | null> {
  try {
    const account = await horizonGet<HorizonAccountResponse>(
      `/accounts/${address}`
    )
    return (
      account.balances.find((b) => b.asset_type === 'native')?.balance ?? '0'
    )
  } catch (error) {
    if (error instanceof StellarNotFoundError) return null
    throw error
  }
}

/** Testnet only: creates and funds an account with free test XLM. */
export async function fundWithFriendbot(address: string): Promise<void> {
  if (STELLAR_NETWORK !== 'testnet') {
    throw new Error('Friendbot is only available on Testnet')
  }
  const response = await fetch(
    `${FRIENDBOT_URL}?addr=${encodeURIComponent(address)}`
  )
  if (!response.ok) {
    throw new Error('Friendbot could not fund this account')
  }
}

interface HorizonErrorShape {
  response?: {
    data?: {
      extras?: {
        result_codes?: { transaction?: string; operations?: string[] }
      }
    }
  }
  message?: string
}

/** Turns SDK / Horizon / wallet failures into a message safe to show to a user. */
export function describeStellarError(error: unknown): string {
  const e = error as HorizonErrorShape
  const codes = e?.response?.data?.extras?.result_codes
  const op = codes?.operations?.[0]
  const tx = codes?.transaction

  if (op === 'op_no_destination') {
    return 'The destination account does not exist on the network yet.'
  }
  if (op === 'op_underfunded' || tx === 'tx_insufficient_balance') {
    return 'Insufficient XLM balance to complete this transaction.'
  }
  if (tx === 'tx_insufficient_fee') {
    return 'The network is busy. Please try again in a moment.'
  }
  if (tx === 'tx_bad_seq') {
    return 'Your account sequence changed. Please try again.'
  }
  if (op || tx) return `Stellar rejected the transaction (${op ?? tx}).`

  const message = e?.message ?? (typeof error === 'string' ? error : '')
  if (/404|not found/i.test(message)) {
    return 'Your account is not active on this network yet. Fund it with test XLM first.'
  }
  if (/reject|declin|cancel|denied|closed/i.test(message)) {
    return 'The signature request was cancelled in your wallet.'
  }
  return message || 'Something went wrong while talking to the Stellar network.'
}
