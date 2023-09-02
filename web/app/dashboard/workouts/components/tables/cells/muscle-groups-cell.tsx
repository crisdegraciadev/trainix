"use client";

import { Badge } from "@/components/ui/badge";
import { Workout } from "@/types/workout";
import { Row } from "@tanstack/react-table";
import { nanoid } from "nanoid";
import { WorkoutConsts } from "../../../consts";
import { capitalize } from "../../../utils/capitalize";

type MuscleGroupsCellProps = {
  row: Row<Workout>;
};

const { MuscleGroups } = WorkoutConsts.WorkoutTable.Cells;

export default function MuscleGroupsCell({ row }: MuscleGroupsCellProps) {
  const values: string[] = row.getValue(MuscleGroups.ACCESSOR_KEY);
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
