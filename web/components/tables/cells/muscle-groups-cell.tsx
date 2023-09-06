"use client";

import { Badge } from "@/components/ui/badge";
import { Row } from "@tanstack/react-table";
import { nanoid } from "nanoid";
import { capitalize } from "../../../utils";

type MuscleGroupsCellProps<T> = {
  row: Row<T>;
  accessorKey: string;
};

export default function MuscleGroupsCell<T>({
  row,
  accessorKey,
}: MuscleGroupsCellProps<T>) {
  const values: string[] = row.getValue(accessorKey);
  console.log({ values });
  const formattedValues = values.map((value) => capitalize(value));

  return (
    <div>
      {formattedValues.map((value) => (
        <Badge className="rounded-md mr-1" key={nanoid()} variant="secondary">
          {value}
        </Badge>
      ))}
    </div>
  );
}
