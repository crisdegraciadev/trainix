import { Row } from "@tanstack/react-table";
import React, { useState } from "react";
import { Exercise } from "../../../../../types/entities";
import ViewExerciseDialog from "../dialogs/view";

type ExerciseDetailsCellProps = {
  row: Row<Exercise>;
};

export default function ExerciseDetailsCell({ row }: ExerciseDetailsCellProps) {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  return (
    <>
      <span
        className="cursor-pointer"
        onClick={() => setIsViewDialogOpen(true)}
      >
        {row.original.name}
      </span>
      <ViewExerciseDialog
        exercise={row.original}
        isDialogOpen={isViewDialogOpen}
        setIsDialogOpen={setIsViewDialogOpen}
      />
    </>
  );
}
