import type { SVGProps } from 'react'

/**
 * The Staries star: a soft, rounded five-point star.
 * Rounded corners come from a thick same-color stroke with round joins,
 * so the shape scales cleanly at any size.
 */
function starPoints(outer: number, inner: number): string {
  const points: string[] = []
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : inner
    const angle = (Math.PI / 5) * i - Math.PI / 2
    points.push(
      `${(50 + radius * Math.cos(angle)).toFixed(2)},${(50 + radius * Math.sin(angle)).toFixed(2)}`
    )
  }
  return points.join(' ')
}

const POINTS = starPoints(36, 20)

export default function StarShape({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <polygon
        points={POINTS}
        stroke="currentColor"
        strokeWidth="12"
        strokeLinejoin="round"
      />
    </svg>
  )
}
