"use client";

import { DataTable } from "../../../components/tables/data-table";
import { EXERCISES_COLUMNS } from "./components/tables/columns";
import { FACETED_FILTERS } from "./data/faceted-filter";
import { useState } from "react";
import CreateExerciseDialog from "./components/dialogs/create";
import { useFetchExercises } from "../../../hooks/exercises/use-fetch-exercises";
import { PaginationState } from "@tanstack/react-table";

export default function ExercisesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data } = useFetchExercises(pagination);

  return (
    <section className="mt-1">
      <DataTable
        columns={EXERCISES_COLUMNS}
        createFormDialog={
          <CreateExerciseDialog
            isFormOpen={isFormOpen}
            useInternalTrigger={true}
            setIsFormOpen={setIsFormOpen}
          />
        }
        searchBarPlaceholder="Search by exercise name..."
        data={data}
        facetedFilters={FACETED_FILTERS}
        setPagination={setPagination}
        pagination={pagination}
      />
    </section>
  );
}
