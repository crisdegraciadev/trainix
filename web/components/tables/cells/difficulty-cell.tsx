"use client";

import { Row } from "@tanstack/react-table";
import { DifficultyIcons } from "../../../app/dashboard/workouts/components/tables/icons";
import { capitalize } from "../../../utils/capitalize";

type DifficultyCellProps<T> = {
  row: Row<T>;
  accessorKey: string;
};

export default function DifficultyCell<T>({
  row,
  accessorKey,
}: DifficultyCellProps<T>) {
  const value: string = row.getValue(accessorKey);
  const formattedValue = capitalize(value);

  return (
    <div className="flex items-center">
      {DifficultyIcons[value]}
      {formattedValue}
    </div>
  );
}
