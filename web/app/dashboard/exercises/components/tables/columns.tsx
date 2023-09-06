import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Exercise } from "../../../../../types/exercise";

const { Cells } = ;

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
    cell: ({ row }) => <DifficultyCell row={row} />,
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
    cell: ({ row }) => <MuscleGroupsCell row={row} />,
    filterFn: (row, id, value) => {
      return value.every((val: WorkoutMuscleGroup) =>
        row.getValue<WorkoutMuscleGroup[]>(id).includes(val)
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];
