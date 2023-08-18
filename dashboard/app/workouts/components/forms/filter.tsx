"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

const WORKOUT_CATEGORY = ["upper", "legs", "abs", "cardio"] as const;
const WORKOUT_DIFFICULTY = ["easy", "medium", "hard"] as const;
const WORKOUT_DURATION = ["half", "one", "moreThanOne"] as const;

const WorkoutFilterFormSchema = z.object({
  name: z.string().optional(),
  numberOfExercises: z.string().optional(),
  category: z.enum(WORKOUT_CATEGORY).optional(),
  difficulty: z.enum(WORKOUT_DIFFICULTY).optional(),
  duration: z.enum(WORKOUT_DURATION),
});

export function WorkoutFilterForm() {
  const form = useForm<z.infer<typeof WorkoutFilterFormSchema>>({
    resolver: zodResolver(WorkoutFilterFormSchema),
  });

  function onSubmit(data: z.infer<typeof WorkoutFilterFormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Workout name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="numberOfExercises"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of exercises</FormLabel>
              <FormControl>
                <Input placeholder="Workout exercises count" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workout category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="upper">Upper</SelectItem>
                  <SelectItem value="legs">Legs</SelectItem>
                  <SelectItem value="abs">Abs</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workout duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="half">&lt; 30</SelectItem>
                  <SelectItem value="one">30 - 60</SelectItem>
                  <SelectItem value="moreThanOne">&gt; 60</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Search
        </Button>
      </form>
    </Form>
  );
}
