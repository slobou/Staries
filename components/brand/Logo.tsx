import Image from 'next/image'

/**
 * Official Staries logo (white wordmark with the yellow star, for dark backgrounds).
 *
 * Size it with a height class, e.g. `className="h-9"`; the width follows the
 * aspect ratio. Pass `byline` to add the "by NOIR" endorsement underneath.
 */
export default function Logo({
  className = 'h-9',
  byline = false,
}: {
  className?: string
  /** Show the "by NOIR" endorsement under the logo. */
  byline?: boolean
}) {
  return (
    <span className="inline-flex flex-col items-center gap-1.5">
      <Image
        src="/brand/staries-logo.png"
        alt="Staries"
        width={648}
        height={196}
        className={`w-auto ${className}`}
      />
      {byline && (
        <Image
          src="/brand/noir-logo.png"
          alt="by NOIR"
          width={98}
          height={30}
          className="h-5 w-auto"
        />
      )}
    </span>
  )
}
