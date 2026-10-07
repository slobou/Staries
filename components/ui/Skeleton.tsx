/** Pulsing placeholder block. Size it with className, e.g. `h-4 w-1/2`. */
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-white/10 ${className}`}
    />
  );
}
