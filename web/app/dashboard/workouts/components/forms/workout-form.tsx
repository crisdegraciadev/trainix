import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CreateWorkoutSchema } from "./workout-form-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { nanoid } from "nanoid";
import { capitalize } from "@/utils";
import { Category, Difficulty, Muscle } from "@/types/enums";
import { Checkbox } from "@/components/ui/checkbox";
import { Icons } from "@/components/ui/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/clsx";
import { ChevronsUpDown } from "lucide-react";
import ExerciseSelector from "./inputs/exercise-selector";
import { useState } from "react";
import ActivityCard from "../cards/activity";
import { Separator } from "@/components/ui/separator";

export type WorkoutFormDialogProps = {
  form: UseFormReturn<CreateWorkoutSchema>;
  isLoading: boolean;
  submitText: string;
  onSubmit: (values: CreateWorkoutSchema) => void;
};

export function WorkoutForm({
  form,
  isLoading,
  submitText,
  onSubmit,
}: WorkoutFormDialogProps) {
  const [isExercisePopoverOpen, setIsExercisePopoverOpen] = useState(false);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);

  console.log({ selectedExerciseIds });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <section className="flex justify-start gap-4">
          <section className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Muscle Up"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      placeholder="Pushing and pulling exercise where..."
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full" disabled={isLoading}>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent id="difficulty">
                        <SelectGroup>
                          <SelectLabel>Difficulties</SelectLabel>
                          {Object.values(Difficulty).map((difficulty) => (
                            <SelectItem key={nanoid()} value={difficulty}>
                              {capitalize(difficulty)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full" disabled={isLoading}>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                      <SelectContent id="category">
                        <SelectGroup>
                          <SelectLabel>Categories</SelectLabel>
                          {Object.values(Category).map((category) => (
                            <SelectItem key={nanoid()} value={category}>
                              {capitalize(category)}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="muscles"
              render={() => (
                <FormItem>
                  <FormLabel>Muscles</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(Muscle).map((muscle) => (
                      <FormField
                        key={muscle}
                        control={form.control}
                        name="muscles"
                        render={({ field }) => (
                          <FormItem
                            key={muscle}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value.includes(muscle)}
                                onCheckedChange={(selected) => {
                                  selected
                                    ? field.onChange([...field.value, muscle])
                                    : field.onChange(
                                        field.value.reduce<Muscle[]>(
                                          (acc, currentMuscle) =>
                                            currentMuscle === muscle
                                              ? [...acc]
                                              : [...acc, currentMuscle],
                                          []
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {capitalize(muscle)}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>

          <Separator orientation="vertical" className="h-[2000]" />

          <section className="grow space-y-8">
            <FormField
              control={form.control}
              name="activities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exercises</FormLabel>
                  <Popover open={isExercisePopoverOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          onClick={() =>
                            setIsExercisePopoverOpen(!isExercisePopoverOpen)
                          }
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          Select your exercises
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[432px] p-0">
                      <ExerciseSelector
                        setIsOpen={setIsExercisePopoverOpen}
                        selectedExerciseIds={selectedExerciseIds}
                        setSelectedExerciseIds={setSelectedExerciseIds}
                      />
                    </PopoverContent>
                  </Popover>
                  <div className="mt-4">
                    {selectedExerciseIds.map((id) => (
                      <ActivityCard key={id} />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        </section>
        <div className="flex justify-end">
          <Button disabled={isLoading} type="submit">
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {submitText}
          </Button>
        </div>
      </form>
    </Form>
  );
}
