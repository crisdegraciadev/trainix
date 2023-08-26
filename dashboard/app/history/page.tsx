import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { DataTable } from "./components/table";
import { WorkoutRecord, columns, records } from "./components/columns";

async function getData(): Promise<WorkoutRecord[]> {
  return [...records];
}

export default async function HistoryPage() {
  const data = await getData();

  return <DataTable columns={columns} data={data} />;
}
