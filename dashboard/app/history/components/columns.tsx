import { ColumnDef } from "@tanstack/react-table";

export type WorkoutRecord = {
  id: string;
  name: string;
  date: string;
};

export const records: WorkoutRecord[] = [
  {
    id: "728ed52f",
    name: "Muscle Up",
    date: "27/08/2023",
  },
  {
    id: "489e1d42",
    name: "Front Lever",
    date: "28/08/2023",
  },
];

export const columns: ColumnDef<WorkoutRecord>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
];
