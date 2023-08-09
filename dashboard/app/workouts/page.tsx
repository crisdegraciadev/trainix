'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { nanoid } from 'nanoid'

import './styles.css'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Label } from '@radix-ui/react-label'
import { Input } from '@/components/ui/input'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const numberOfWorkouts = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

function WorkoutCreateForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function WorkoutFilters() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when your&apos;e done
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

function WorkoutCard() {
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
          <div className="workout-list">
            {numberOfWorkouts.map((_) => (
              <WorkoutCard key={nanoid()} />
            ))}
          </div>
        </section>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  )
}
