"use client";

import { ColumnDef } from "@tanstack/react-table";
import DifficultyCell from "../../../../../components/tables/cells/difficulty-cell";
import MuscleGroupsCell from "../../../../../components/tables/cells/muscle-groups-cell";
import { DataTableColumnHeader } from "../../../../../components/tables/data-table-column-header";
import { Checkbox } from "../../../../../components/ui/checkbox";
import { Exercise } from "../../../../../types/entities/exercise";
import { Muscle } from "../../../../../types/enums";
import { ExerciseConsts } from "../../consts";
import ExerciseActionsCell from "./actions-cell";

const { Cells } = ExerciseConsts.ExerciseTable;

export const EXERCISES_COLUMNS: ColumnDef<Exercise>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: Cells.Name.ACCESSOR_KEY,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={Cells.Name.TITLE} />
    ),
  },
  {
    accessorKey: Cells.Description.ACCESSOR_KEY,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={Cells.Description.TITLE} />
    ),
  },
  {
    accessorKey: Cells.Difficulty.ACCESSOR_KEY,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={Cells.Difficulty.TITLE} />
    ),
    cell: ({ row }) => (
      <DifficultyCell row={row} accessorKey={Cells.Difficulty.ACCESSOR_KEY} />
    ),
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: Cells.MuscleGroups.ACCESSOR_KEY,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={Cells.MuscleGroups.TITLE} />
    ),
    cell: ({ row }) => (
      <MuscleGroupsCell
        row={row}
        accessorKey={Cells.MuscleGroups.ACCESSOR_KEY}
      />
    ),
    filterFn: (row, id, value) => {
      return value.some((val: Muscle) =>
        row.getValue<string[]>(id).includes(val.toUpperCase())
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ExerciseActionsCell row={row} />,
  },
];
