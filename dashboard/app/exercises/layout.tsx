import DataTablePageLayout from "@/layouts/data-table-page";
import React from "react";

export default function ExercisesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataTablePageLayout
      title="Exercises"
      subtitle="Explore different exercises and create your owns"
    >
      {children}
    </DataTablePageLayout>
  );
}
