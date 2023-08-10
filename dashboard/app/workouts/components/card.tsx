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

export function WorkoutCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Muscle Up</CardTitle>
        <CardDescription>
          Upper body workout oriented to explosive pull ups & muscle up
        </CardDescription>
      </CardHeader>
      <CardContent className="flex gap-1">
        <Badge>Upper</Badge>
        <Badge>Medium</Badge>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View</Button>
        <Button>Delete</Button>
      </CardFooter>
    </Card>
  )
}
