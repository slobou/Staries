'use client'

import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { useAccountBalance } from '@/hooks/useAccountBalance'
import { STELLAR_NETWORK } from '@/lib/stellar/config'

/**
 * Warns when the connected account is not active on the network yet (it holds
 * no XLM), which makes every transaction fail. On Testnet it offers a one-click
 * top-up from Friendbot. Renders nothing when the account is ready.
 */
export default function FundingNotice({
  address,
  onFunded,
}: {
  address: string
  onFunded?: () => void
}) {
  const { balance, loading, funding, error, fund } = useAccountBalance(address)

  if (loading && balance === null) {
    return (
      <p className="flex items-center gap-2 text-sm text-white/50">
        <Spinner /> Checking your account…
      </p>
    )
  }

  if (error) return <Alert tone="error">{error}</Alert>

  if (balance !== null) return null

  return (
    <Alert tone="warning" title="Your account is not active on the network yet">
      <p>
        Stellar accounts need a small XLM balance before they can sign
        transactions.
        {STELLAR_NETWORK === 'testnet'
          ? ' On Testnet you can get free test XLM with one click.'
          : ' Send some XLM to this address first.'}
      </p>
      {STELLAR_NETWORK === 'testnet' && (
        <div className="mt-3">
          <Button
            size="sm"
            variant="accent"
            disabled={funding}
            onClick={async () => {
              await fund()
              onFunded?.()
            }}
          >
            {funding ? (
              <>
                <Spinner /> Funding…
              </>
            ) : (
              'Get free test XLM'
            )}
          </Button>
        </div>
      )}
    </Alert>
  )
}
