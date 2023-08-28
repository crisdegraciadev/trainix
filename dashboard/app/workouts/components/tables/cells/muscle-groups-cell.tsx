"use client";

import { capitalize } from "@/app/workouts/utils/capitalize";
import { Badge } from "@/components/ui/badge";
import { Workout } from "@/types/workout";
import { Row } from "@tanstack/react-table";
import { nanoid } from "nanoid";

type MuscleGroupsCellProps = {
  row: Row<Workout>;
};

export default function MuscleGroupsCell({ row }: MuscleGroupsCellProps) {
  const values: string[] = row.getValue("muscleGroups");
  const formattedValues = values.map((value) => capitalize(value));

  return (
    <div>
      {formattedValues.map((value) => (
        <Badge className="rounded-md mr-1" key={nanoid()} variant="secondary">
          {value}
        </Badge>
      ))}
    </div>
  );
}
