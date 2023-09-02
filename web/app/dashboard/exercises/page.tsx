import SearchBar from "@/components/ui/search-bar";
import { ExerciseFilters } from "./components/filters";

export default function ExercisesPage() {
  return (
    <>
      <nav className="flex py-2">
        <div className="flex gap-2">
          <SearchBar />
          <ExerciseFilters />
        </div>
      </nav>

      <section className="grid-list mt-4"></section>
    </>
  );
}
