"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pencil1Icon, Cross2Icon, StarIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

type ActionsCellProps<T> = {
  row: Row<T>;
};

export default function ActionsCell<T>({ row }: ActionsCellProps<T>) {
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
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex">
          <Pencil1Icon className="mr-2" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex">
          <Cross2Icon className="mr-2" />
          <span>Delete</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex">
          <StarIcon className="mr-2" />
          <span>Favorite</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
