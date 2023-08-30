"use client";

import {
  ColumnDef,
  Table as ReactTable,
  flexRender,
} from "@tanstack/react-table";
import { TableBody, TableRow, TableCell } from "../ui/table";
type DataTableBodyProps<T, K> = {
  table: ReactTable<T>;
  columns: ColumnDef<T, K>[];
};

export default function DataTableBody<T, K>({
  table,
  columns,
}: DataTableBodyProps<T, K>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
