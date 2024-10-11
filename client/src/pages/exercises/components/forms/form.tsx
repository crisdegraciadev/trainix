import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateExerciseMutation } from "@/core/api/mutations/use-create-exercise-mutation";
import { useFindAllDifficulties } from "@/core/api/queries/use-find-all-difficulties";
import { useFindAllMuscles } from "@/core/api/queries/use-find-all-muscles";
import { useToast } from "@/core/hooks/use-toast";
import { Difficulty, Muscle } from "@/core/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useExerciseHybridViewStore } from "../../state/exercise-hybrid-view-store";
import { MultiSelect } from "@/components/ui/multi-select";
import { formatString, StrFormat } from "@/core/utils";

const formSchema = z.object({
  name: z.string({ required_error: "Exercise name is required" }).min(1, "Exercise name is required"),
  description: z.string().optional(),
  difficultyId: z.number({ required_error: "Difficulty is required" }),
  muscleIds: z.array(z.number()).min(1, "At least 1 muscle must be selected"),
  videoUrl: z.union([z.string().url(), z.string().length(0)]).optional(),
});

export default function ExerciseForm() {
  const { data: muscles } = useFindAllMuscles();
  const { data: difficulties } = useFindAllDifficulties();

  const setFormOpen = useExerciseHybridViewStore(({ setFormOpen }) => setFormOpen);

  const { mutate, isSuccess, isError, isPending } = useCreateExerciseMutation();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      difficultyId: undefined,
      muscleIds: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ values });
    mutate({ ...values });
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Exercise created!",
        description: "Your exercise has been created successfully.",
      });

      setFormOpen(false);
    }
  }, [setFormOpen, isSuccess, toast]);

  useEffect(() => {
    if (isError) {
      toast({
        title: "Whoops! Something went wrong.",
        description: "Your exercise hasn't been created.",
        variant: "destructive",
      });
    }
  });

  if (!muscles || !difficulties) {
    return <p>Loading...</p>;
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
                  <Input placeholder="Push Up" disabled={isPending} autoComplete="off" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input placeholder="Explanatory Youtube video" type="url" disabled={isPending} autoComplete="off" {...field} />
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
                <FormLabel>
                  Description <span className="text-muted-foreground">(Optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="The perfect exercise to train your chest."
                    className="resize-none"
                    autoComplete="off"
                    disabled={isPending}
                    {...field}
                  />
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
                <Select onValueChange={(value) => form.setValue("difficultyId", Number(value))} disabled={isPending}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue className="placeholder:text-muted-foreground" placeholder="Select difficulty level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {difficulties.map(({ value, label }: Difficulty) => (
                      <SelectItem key={label} value={String(value)}>
                        {formatString(label, StrFormat.TITLE_CASE)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muscleIds"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Muscles</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={muscles.map((m: Muscle) => ({
                      label: formatString(m.label, StrFormat.TITLE_CASE),
                      value: String(m.value),
                    }))}
                    onValueChange={(muscles: string[]) => form.setValue("muscleIds", muscles?.map(Number))}
                    value={form.getValues("muscleIds")?.map(String) ?? []}
                    defaultValue={field.value.map(String)}
                    placeholder="Select muscles"
                    maxCount={3}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
          Save
        </Button>
      </form>
    </Form>
  );
}
