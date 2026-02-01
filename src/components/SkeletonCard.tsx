import Card from "@/components/ui/card";

export default function SkeletonCard() {
  return (
    <Card>
      <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/3" />
      <div className="mt-4 h-6 bg-gray-200 dark:bg-zinc-700 rounded w-3/4" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded" />
        <div className="h-12 bg-gray-200 dark:bg-zinc-700 rounded" />
      </div>
    </Card>
  );
}
