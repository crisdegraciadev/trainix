'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function ExerciseCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Push Ups</CardTitle>
        <CardDescription>
          From a prone position, the hands are placed under the shoulders with
          the elbows extended...
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-wrap gap-1">
          <Badge>Chest</Badge>
          <Badge>Triceps</Badge>
          <Badge>Shoulders</Badge>
          <Badge>Abs</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View</Button>
      </CardFooter>
    </Card>
  )
}
