"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/tables/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import ActionsCell from "../../../../../components/tables/cells/actions-cell";
import DifficultyCell from "../../../../../components/tables/cells/difficulty-cell";
import MuscleGroupsCell from "../../../../../components/tables/cells/muscle-groups-cell";
import { Workout } from "../../../../../types/entities";
import { Muscle } from "../../../../../types/enums";
import { WorkoutConsts } from "../../consts";
import CategoryCell from "./cells/category-cell";

const { Cells } = WorkoutConsts.WorkoutTable;

export const WORKOUT_COLUMNS: ColumnDef<Workout>[] = [
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
    accessorKey: Cells.Category.ACCESSOR_KEY,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={Cells.Category.TITLE} />
    ),
    cell: ({ row }) => <CategoryCell row={row} />,
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
        row.getValue<Muscle[]>(id).includes(val)
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
