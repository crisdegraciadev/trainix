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
import { useState } from "react";
import DeleteExerciseDialog from "../dialogs/delete";
import { Exercise } from "../../../../../types/entities";
import EditExerciseDialog from "../dialogs/edit";

type ExerciseActionsCellProps = {
  row: Row<Exercise>;
};

export default function ExerciseActionsCell({ row }: ExerciseActionsCellProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          {process.env.NEXT_PUBLIC_ENV === "dev" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex"
                onSelect={() => setIsEditDialogOpen(true)}
              >
                <Pencil1Icon className="mr-2" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex"
                onSelect={() => setIsDeleteDialogOpen(true)}
              >
                <Cross2Icon className="mr-2" />
                <span>Delete</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem className="flex">
            <StarIcon className="mr-2" />
            <span>Favorite</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteExerciseDialog
        exerciseId={row.original.id}
        isDialogOpen={isDeleteDialogOpen}
        setIsDialogOpen={setIsDeleteDialogOpen}
      />

      <EditExerciseDialog
        exercise={row.original}
        isFormOpen={isEditDialogOpen}
        setIsFormOpen={setIsEditDialogOpen}
      />
    </>
  );
}
