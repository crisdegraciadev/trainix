"use client";

import { WorkoutConsts } from "@/app/workouts/consts";
import { capitalize } from "@/app/workouts/utils/capitalize";
import { Badge } from "@/components/ui/badge";
import { Workout } from "@/types/workout";
import { Row } from "@tanstack/react-table";

type CategoryCellProps = {
  row: Row<Workout>;
};

const { Category } = WorkoutConsts.WorkoutTable.Cells;

export default function CategoryCell({ row }: CategoryCellProps) {
  const value: string = row.getValue(Category.ACCESSOR_KEY);
  console.log(value);
  const formattedValue = capitalize(value);

  return (
    <Badge className="rounded-md" variant="outline">
      {formattedValue}
    </Badge>
  );
}
