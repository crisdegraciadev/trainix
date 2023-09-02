"use client";

import { Workout } from "@/types/workout";
import { Row } from "@tanstack/react-table";
import { DifficultyIcons } from "../icons";
import { WorkoutConsts } from "../../../consts";
import { capitalize } from "../../../utils/capitalize";

type DifficultyCellProps = {
  row: Row<Workout>;
};

const { Difficulty } = WorkoutConsts.WorkoutTable.Cells;

export default function DifficultyCell({ row }: DifficultyCellProps) {
  const value: string = row.getValue(Difficulty.ACCESSOR_KEY);
  const formattedValue = capitalize(value);

  return (
    <div className="flex items-center">
      {DifficultyIcons[value]}
      {formattedValue}
    </div>
  );
}
