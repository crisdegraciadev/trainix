"use client";

import { DataTable } from "@/components/tables/data-table";
import { WorkoutFilters } from "./components/filters";
import { WorkoutCreateForm } from "./components/forms/create";
import SearchBar from "@/components/ui/search-bar";
import { useFetchWorkouts } from "./hooks/useFetchWorkouts";
import { WORKOUT_COLUMNS } from "./components/tables/columns";

export default function WorkoutsPage() {
  const { data } = useFetchWorkouts();

  return (
    <>
      <nav className="flex justify-between py-2">
        <div className="flex gap-2">
          <SearchBar />
          <WorkoutFilters />
        </div>
        <div className="flex gap-2">
          <WorkoutCreateForm />
        </div>
      </nav>
      <section className="mt-1">
        <DataTable columns={WORKOUT_COLUMNS} data={data} />
      </section>
    </>
  );
}
