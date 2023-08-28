"use client";

import { capitalize } from "@/app/workouts/utils/capitalize";
import { Workout } from "@/types/workout";
import { Row } from "@tanstack/react-table";
import { DifficultyIcons } from "../icons";

type DifficultyCellProps = {
  row: Row<Workout>;
};

export default function DifficultyCell({ row }: DifficultyCellProps) {
  const value: string = row.getValue("difficulty");
  const formattedValue = capitalize(value);

  return (
    <div className="flex items-center">
      {DifficultyIcons[value]}
      {formattedValue}
    </div>
  );
}
