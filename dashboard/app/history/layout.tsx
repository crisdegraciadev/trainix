import DataTablePageLayout from "@/layouts/data-table-page";
import React from "react";

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataTablePageLayout title="History" subtitle="Review your progress">
      {children}
    </DataTablePageLayout>
  );
}
