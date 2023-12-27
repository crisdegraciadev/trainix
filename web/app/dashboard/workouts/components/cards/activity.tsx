import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export type ActivityCardProps = {
  exerciseId: string;
};

export default function ActivityCard({ exerciseId }: ActivityCardProps) {
  return (
    <Card className="flex mt-1">
      <CardHeader className="w-2/3 p-2 mx-3 flex justify-center">
        <CardTitle className="text-sm">{exerciseId}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex gap-2">
        <Input className="w-20" type="number" placeholder="Reps" />
        <Input className="w-20" type="number" placeholder="Sets" />
      </CardContent>
    </Card>
  );
}
