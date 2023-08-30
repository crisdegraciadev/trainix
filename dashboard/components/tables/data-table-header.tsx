"use client";

import { flexRender } from "@tanstack/react-table";
import { TableHeader, TableRow, TableHead } from "../ui/table";

import { Table as ReactTable } from "@tanstack/react-table";

type DataTableHeaderProps<T> = {
  table: ReactTable<T>;
};

export default function DataTableHeader<T>({ table }: DataTableHeaderProps<T>) {
  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <TableHead key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </TableHead>
            );
          })}
        </TableRow>
      ))}
    </TableHeader>
  );
}
