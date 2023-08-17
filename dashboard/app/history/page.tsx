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

  return (
    <Card>
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>Take a look at your recent activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col">
        <div className="py-4">
          <DataTable columns={columns} data={data} />
        </div>
      </CardContent>
    </Card>
  );
}
