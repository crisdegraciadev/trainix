"use client";

import { Badge } from "@/components/ui/badge";
import { Row } from "@tanstack/react-table";
import { WorkoutConsts } from "../../../consts";
import { capitalize } from "../../../../../../utils/capitalize";
import { Workout } from "../../../../../../types/entities";

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
