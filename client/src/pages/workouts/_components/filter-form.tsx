import { useFindAllDifficulties } from "@/core/api/queries/use-find-all-difficulties";
import { useFindAllMuscles } from "@/core/api/queries/use-find-all-muscles";
import { z } from "zod";
import { useWorkoutHybridViewStore } from "../_state/workout-hybrid-view-store";
import { useWorkoutQueryStore } from "../_state/workout-query-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Unselect from "@/components/unselect";
import { formatString, StrFormat } from "@/core/utils/string";
import { Difficulty, Muscle } from "@/core/types";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().optional(),
  difficultyId: z.number().optional(),
  muscleIds: z.array(z.number()).optional(),
});

export default function WorkoutFilterForm() {
  const { data: muscles } = useFindAllMuscles();
  const { data: difficulties } = useFindAllDifficulties();

  const setFilterOpen = useWorkoutHybridViewStore(({ setFilterOpen }) => setFilterOpen);

  const { filter, setFilter } = useWorkoutQueryStore(({ filter, setFilter }) => ({
    filter,
    setFilter,
  }));

  console.log({ filter });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...filter },
  });

  function reset() {
    form.setValue("name", undefined);
    form.setValue("difficultyId", undefined);
    form.setValue("muscleIds", undefined);
    setFilter({});
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFilter({ ...values });
    setFilterOpen(false);
  }

  if (!difficulties || !muscles) {
    return <p>Loading form...</p>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 mb-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Workout name" autoComplete="off" onChange={field.onChange} defaultValue={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficultyId"
            render={() => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <FormControl>
                  <Unselect
                    options={difficulties.map((d: Difficulty) => ({
                      label: formatString(d.label, StrFormat.TITLE_CASE),
                      value: String(d.value),
                    }))}
                    defaultValue={filter.difficultyId ? String(filter.difficultyId) : undefined}
                    onChange={(value) => {
                      form.setValue("difficultyId", Number(value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muscleIds"
            render={() => (
              <FormItem>
                <FormLabel>Muscles</FormLabel>
                <FormControl>
                  <MultiSelect
                    onChange={(muscles: string[]) => {
                      form.setValue("muscleIds", muscles.map(Number));
                    }}
                    defaultValues={filter.muscleIds?.map(String) ?? []}
                    title="Muscles"
                    options={muscles.map((m: Muscle) => ({
                      label: formatString(m.label, StrFormat.TITLE_CASE),
                      value: String(m.value),
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button className="w-full" variant="outline" type="submit" onClick={() => reset()}>
            Clear
          </Button>

          <Button className="w-full" type="submit">
            Search
          </Button>
        </div>
      </form>
    </Form>
  );
}
