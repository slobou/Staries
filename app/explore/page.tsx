import Skeleton from "@/components/ui/Skeleton";

/** Placeholder grid shown while the catalog loads. */
export default function ExploreLoading() {
  return (
    <main
      className="mx-auto w-full max-w-5xl flex-1 px-6 py-12"
      role="status"
      aria-label="Loading the catalog"
    >
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-3 h-10 w-72 max-w-full" />
      <Skeleton className="mb-10 h-4 w-96 max-w-full" />
      <Skeleton className="mb-8 h-11 w-full" />
      <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <li key={i} className="space-y-3">
            <Skeleton className="aspect-2/3 rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </li>
        ))}
      </ul>
    </main>
  );
}
