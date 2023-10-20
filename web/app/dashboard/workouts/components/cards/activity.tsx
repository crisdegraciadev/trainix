import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";

export default function ActivityCard() {
  return (
    <Card className="flex mt-1">
      <CardHeader className="w-2/3 p-2 mx-3 flex justify-center">
        <CardTitle className="text-sm">Push Up</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex gap-2">
        <Input className="w-20" type="number" placeholder="Reps" />
        <Input className="w-20" type="number" placeholder="Sets" />
      </CardContent>
    </Card>
  );
}
