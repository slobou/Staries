import {
  Asset,
  BASE_FEE,
  Memo,
  Operation,
  TransactionBuilder,
} from '@stellar/stellar-sdk'
import { LICENSE_MEMO_PREFIX, NETWORK_PASSPHRASE } from './config'
import { horizonServer } from './horizon'
import { getTransactionUrl, type TransactionSigner } from './registry'

/**
 * Asset used for license payments.
 *
 * MVP: native XLM (works on Testnet with zero setup). Switching to USDC means
 * changing this to `new Asset('USDC', ISSUER)` and making sure both wallets hold
 * a trustline — everything else in this module stays the same.
 */
export const PAYMENT_ASSET = Asset.native()
export const PAYMENT_ASSET_CODE = 'XLM'

export interface LicensePaymentReceipt {
  txId: string
  explorerUrl: string
}

/** Stellar amounts allow at most 7 decimals. */
export function formatAmount(amount: number): string {
  return amount.toFixed(7).replace(/\.?0+$/, '') || '0'
}

/** Memo links the payment to a work (memo text is limited to 28 bytes). */
export function licenseMemo(workId: string): string {
  return `${LICENSE_MEMO_PREFIX}${workId.replace(/-/g, '').slice(0, 8)}`
}

/** Builds the unsigned payment that buys a license directly from the author. */
export async function buildLicensePaymentXdr(params: {
  buyerAddress: string
  authorAddress: string
  amount: number
  workId: string
}): Promise<string> {
  const { buyerAddress, authorAddress, amount, workId } = params
  if (!(amount > 0)) throw new Error('License price must be greater than zero')
  if (buyerAddress === authorAddress) {
    throw new Error('You cannot buy a license for your own work')
  }

  const account = await horizonServer.loadAccount(buyerAddress)
  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: authorAddress,
        asset: PAYMENT_ASSET,
        amount: formatAmount(amount),
      })
    )
    .addMemo(Memo.text(licenseMemo(workId)))
    .setTimeout(60)
    .build()

  return transaction.toXDR()
}

/** Buys a license: the payment goes straight from buyer to author, no intermediary. */
export async function payForLicense(params: {
  buyerAddress: string
  authorAddress: string
  amount: number
  workId: string
  sign: TransactionSigner
}): Promise<LicensePaymentReceipt> {
  const { sign, ...paymentParams } = params
  const unsignedXdr = await buildLicensePaymentXdr(paymentParams)
  const signedXdr = await sign(unsignedXdr)
  const signedTx = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE)
  const result = await horizonServer.submitTransaction(signedTx)
  return { txId: result.hash, explorerUrl: getTransactionUrl(result.hash) }
}
