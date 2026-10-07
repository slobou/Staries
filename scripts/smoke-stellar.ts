/**
 * End-to-end smoke test of the Stellar core against Testnet.
 *
 *   npm run smoke
 *
 * It creates throwaway accounts, funds them with Friendbot, registers a piece of
 * content, reads the certificate back from the network, verifies it (and a tampered
 * copy), and pays for a license. No wallet or browser needed.
 */
import { Keypair, TransactionBuilder } from '@stellar/stellar-sdk'
import { NETWORK_PASSPHRASE } from '../lib/stellar/config'
import { sha256Hex } from '../lib/stellar/hash'
import { fundWithFriendbot, getXlmBalance } from '../lib/stellar/horizon'
import { payForLicense } from '../lib/stellar/payments'
import {
  fetchCertificate,
  registerContent,
  verifyContent,
  type TransactionSigner,
} from '../lib/stellar/registry'

function signerFor(keypair: Keypair): TransactionSigner {
  return async (xdr) => {
    const tx = TransactionBuilder.fromXDR(xdr, NETWORK_PASSPHRASE)
    tx.sign(keypair)
    return tx.toXDR()
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`ASSERTION FAILED: ${message}`)
  console.log(`  ok  ${message}`)
}

async function main() {
  const author = Keypair.random()
  const buyer = Keypair.random()
  console.log('Funding accounts with Friendbot…')
  await fundWithFriendbot(author.publicKey())
  await fundWithFriendbot(buyer.publicKey())

  const text = 'The old man looked at the sea.\r\n'
  console.log('\n1. Register authorship')
  const started = Date.now()
  const cert = await registerContent({
    authorAddress: author.publicKey(),
    content: text,
    sign: signerFor(author),
    onStep: (step) => console.log(`  …${step}`),
  })
  console.log(`  registered in ${((Date.now() - started) / 1000).toFixed(1)}s`)
  console.log(`  tx: ${cert.explorerUrl}`)
  assert(cert.author === author.publicKey(), 'certificate author is the signer')
  assert(cert.hash === (await sha256Hex(text)), 'on-chain hash equals local hash')

  console.log('\n2. Independent verification (read-only, from the network)')
  const fetched = await fetchCertificate(cert.txId)
  assert(fetched.hash === cert.hash, 'certificate can be re-read from Horizon')
  assert(
    (await verifyContent('The old man looked at the sea.', fetched)).matches,
    'same text (different line endings / whitespace) verifies'
  )
  assert(
    !(await verifyContent('The old man looked at the Sea.', fetched)).matches,
    'a single changed letter does NOT verify'
  )

  console.log('\n3. License payment')
  const before = Number(await getXlmBalance(author.publicKey()))
  const receipt = await payForLicense({
    buyerAddress: buyer.publicKey(),
    authorAddress: author.publicKey(),
    amount: 25,
    workId: crypto.randomUUID(),
    sign: signerFor(buyer),
  })
  const after = Number(await getXlmBalance(author.publicKey()))
  console.log(`  tx: ${receipt.explorerUrl}`)
  assert(after - before === 25, 'author received exactly 25 XLM')

  console.log('\nAll checks passed.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
