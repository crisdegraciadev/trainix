'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { nanoid } from 'nanoid'

import { WorkoutCard } from './components/card'
import { WorkoutFilters } from './components/filters'
import { WorkoutCreateForm } from './components/forms/create'

const numberOfWorkouts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export default function WorkoutsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Workouts</CardTitle>
        <CardDescription>Create and update workouts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col">
        <div className="flex justify-between py-2">
          <div className="flex gap-2">
            <WorkoutCreateForm />
          </div>
          <div className="flex gap-2">
            <WorkoutFilters />
            <input
              placeholder="Search..."
              className="flex h-10 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[500px]"
            />
          </div>
        </div>
        <section>
          <div className="grid-list">
            {numberOfWorkouts.map((_) => (
              <WorkoutCard key={nanoid()} />
            ))}
          </div>
        </section>
      </CardContent>
    </Card>
  )
}
