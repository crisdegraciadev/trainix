"use client";

import { Workout } from "@/types/workout";
import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "@radix-ui/react-icons";
import { MoreHorizontal } from "lucide-react";
import { nanoid } from "nanoid";

type Icons = Record<string, JSX.Element>;

const DifficultyIcons: Icons = {
  easy: (
    <ArrowDownIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={4}
    />
  ),
  medium: (
    <ArrowRightIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={4}
    />
  ),
  hard: (
    <ArrowUpIcon
      className="mr-2 h-4 w-4 text-muted-foreground"
      strokeWidth={4}
    />
  ),
};

const capitalize = (value: string) => {
  return value[0].toUpperCase() + value.slice(1);
};

export const WORKOUT_COLUMNS: ColumnDef<Workout>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const value: string = row.getValue("difficulty");
      const formattedValue = capitalize(value);

      return (
        <div className="flex items-center">
          {DifficultyIcons[value]}
          {formattedValue}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const value: string = row.getValue("category");
      const formattedValue = capitalize(value);

      return (
        <Badge className="rounded-md" variant="outline">
          {formattedValue}
        </Badge>
      );
    },
  },
  {
    accessorKey: "muscleGroups",
    header: "Muscle Groups",
    cell: ({ row }) => {
      const values: string[] = row.getValue("muscleGroups");
      console.log({ values });
      const formattedValues = values.map((value) => capitalize(value));

      return (
        <div>
          {formattedValues.map((value) => (
            <Badge
              className="rounded-md mr-1"
              key={nanoid()}
              variant="secondary"
            >
              {value}
            </Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
