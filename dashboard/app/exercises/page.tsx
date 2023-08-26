import { ExerciseFilters } from "./components/filters";

export default function ExercisesPage() {
  return (
    <>
      <nav className="flex py-2">
        <div className="flex gap-2">
          <input
            placeholder="Search..."
            className="flex h-10 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[300px]"
          />
          <ExerciseFilters />
        </div>
      </nav>

      <section className="grid-list mt-4"></section>
    </>
  );
}
