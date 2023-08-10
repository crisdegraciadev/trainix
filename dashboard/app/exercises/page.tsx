import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ExerciseCard } from './components/card'
import { nanoid } from 'nanoid'
import { ExerciseFilters } from './components/filters'

const numberOfExercises = [0, 1, 2, 3, 4, 5, 6, 7]

export default function ExercisesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercises</CardTitle>
        <CardDescription>
          Navigate around exercises and create custom ones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 flex flex-col">
        <div className="flex justify-end py-2">
          <div className="flex gap-2">
            <ExerciseFilters />
            <input
              placeholder="Search..."
              className="flex h-10 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 lg:w-[500px]"
            />
          </div>
        </div>

        <div className="grid-list mt-4">
          {numberOfExercises.map((_) => (
            <ExerciseCard key={nanoid()} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
