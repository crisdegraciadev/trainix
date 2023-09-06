import SearchBar from "@/components/ui/search-bar";
import { ExerciseFilters } from "./components/filters";
import { DataTable } from "../../../components/tables/data-table";

export default function ExercisesPage() {
  return (
    <section className="mt-1">
      <DataTable
        columns={WORKOUT_COLUMNS}
        createFormDialog={<WorkoutCreateFormDialog />}
        data={data}
        facetedFilters={FACETED_FILTERS}
      />
    </section>
  );
}
