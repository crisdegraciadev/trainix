import DataTablePageLayout from "@/layouts/data-table-page";
import React from "react";

export default function WorkoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataTablePageLayout
      title="Workouts"
      subtitle="Create and organize your workouts"
    >
      {children}
    </DataTablePageLayout>
  );
}
