"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Table } from "@/components/ui/table";

import { ReactElement, useState } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";
import { nanoid } from "nanoid";
import DataTableHeader from "./data-table-header";
import DataTableBody from "./data-table-body";
import DataTableVisibility from "./data-table-visibility";
import SearchBar from "../ui/search-bar";

type FaceTedFilterOptions = {
  title: string;
  accessorKey: string;
  options: { value: string; label: string }[];
};

type DataTableProps<T, K> = {
  columns: ColumnDef<T, K>[];
  createFormDialog: ReactElement;
  data?: T[];
  facetedFilters?: FaceTedFilterOptions[];
};

export function DataTable<T, K>({
  columns,
  createFormDialog,
  data = [],
  facetedFilters = [],
}: DataTableProps<T, K>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div>
      <div className="mb-2 flex gap-2">
        <SearchBar />
        {facetedFilters.map(({ title, accessorKey: columnName, options }) => (
          <DataTableFacetedFilter
            key={nanoid()}
            title={title}
            column={table.getColumn(columnName)}
            options={options}
          />
        ))}
        <DataTableVisibility table={table} />
        {createFormDialog}
      </div>
      <div className="rounded-md border mb-4">
        <Table>
          <DataTableHeader table={table} />
          <DataTableBody table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
