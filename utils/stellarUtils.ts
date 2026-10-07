import { EXPLORER_BASE_URL } from '@/lib/stellar/config'

export function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export function isValidStellarAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address)
}

export function getExplorerUrl(address: string): string {
  return `${EXPLORER_BASE_URL}/account/${address}`
}

export function getTransactionExplorerUrl(txId: string): string {
  return `${EXPLORER_BASE_URL}/tx/${txId}`
}
