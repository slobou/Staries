import type { Metadata } from 'next'
import Alert from '@/components/ui/Alert'
import Card from '@/components/ui/Card'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'Legal notes' }

const NOTES = [
  {
    title: 'What a certificate is',
    text: 'A certificate is a public, timestamped record that an account controlled by the author committed to an exact text at a specific moment. It is strong technical evidence of existence and integrity.',
  },
  {
    title: 'What it is not',
    text: 'It is not a legal copyright registration and it does not by itself prove who the original author is. Someone could register a text they copied; the value of the proof is being early, public and verifiable.',
  },
  {
    title: 'Evidence depends on the country',
    text: 'Moral rights and the evidentiary value of blockchain records vary between jurisdictions. For high-stakes disputes, consult a lawyer in your country.',
  },
  {
    title: 'Your text stays with you',
    text: 'Only the fingerprint of your text is recorded. Keep your original files and drafts: the fingerprint cannot recreate the text.',
  },
  {
    title: 'Licenses',
    text: 'A license payment on Stellar is a public receipt. The terms of use are the ones the author published for that work. Staries does not hold the money and is not a party to the license.',
  },
  {
    title: 'Testnet',
    text: 'Staries currently runs on Stellar Testnet, a practice network. Records and payments made here have no real-world value and may be reset.',
  },
]

export default function LegalPage() {
  return (
    <PageShell
      eyebrow="Legal"
      title="Legal notes"
      description="Plain-language limits of what Staries can and cannot prove."
      width="max-w-3xl"
    >
      <div className="space-y-6">
        <Alert tone="warning" title="This is not legal advice">
          Staries provides technical tools. If you need legal certainty about your rights, talk
          to a qualified professional.
        </Alert>
        <div className="grid gap-3">
          {NOTES.map((note) => (
            <Card key={note.title} className="space-y-1">
              <h2 className="font-extrabold">{note.title}</h2>
              <p className="text-sm text-white/70">{note.text}</p>
            </Card>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
