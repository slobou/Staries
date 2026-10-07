import type { Metadata } from 'next'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import PageShell from '@/components/ui/PageShell'

export const metadata: Metadata = { title: 'About' }

const VALUES = [
  {
    title: 'Fast publishing',
    text: 'Write or paste a chapter and publish it in seconds. Protection happens automatically.',
  },
  {
    title: 'Immersive reading',
    text: 'A calm, distraction-free reader, and every chapter can be checked against its public record.',
  },
  {
    title: 'Curated quality',
    text: 'Stories are organized as Stars and Constellations so readers find what is worth their time.',
  },
]

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Staries, by NOIR"
      description="We connect authors and readers through fast publishing, immersive reading, and curated quality."
      width="max-w-3xl"
    >
      <div className="space-y-10">
        <Card className="space-y-3">
          <h2 className="text-xl font-extrabold">Why we exist</h2>
          <p className="text-white/70">
            Authors publish first and prove later. Plagiarism, copied work and unclear dates leave
            them without evidence, and licensing a story still means emails, contracts and
            intermediaries.
          </p>
          <p className="text-white/70">
            Staries uses the Stellar network as an invisible trust layer: every chapter gets a
            public, tamper-proof record of what was written, by whom and when, and licenses are paid
            directly to the author.
          </p>
        </Card>

        <div className="grid gap-4 sm:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title} className="space-y-2">
              <h3 className="font-extrabold">{value.title}</h3>
              <p className="text-sm text-white/65">{value.text}</p>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button href="/write" variant="accent">
            Publish my first Star
          </Button>
          <Button href="/faq" variant="outline">
            Read the FAQ
          </Button>
        </div>
      </div>
    </PageShell>
  )
}
