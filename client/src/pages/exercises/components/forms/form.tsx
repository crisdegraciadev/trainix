import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useCreateExerciseMutation } from '@/core/api/mutations/use-create-exercise-mutation';
import { Difficulty, Muscle } from '@/core/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';
import { useExerciseHybridViewStore } from '../../state/exercise-hybrid-view-store';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Checkbox } from '@/components/ui/checkbox';

const muscles = Object.values(Muscle).map((value) => ({
  value,
  label: value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
}));

const formSchema = z.object({
  name: z
    .string({ required_error: 'Exercise name is required' })
    .min(1, 'Exercise name is required'),
  description: z.string().optional(),
  difficulty: z.nativeEnum(Difficulty, {
    required_error: 'Difficulty is required',
  }),
  muscles: z
    .array(z.nativeEnum(Muscle))
    .min(1, 'At least 1 muscle must be selected'),
  favourite: z.boolean(),
  video: z.union([z.string().url(), z.string().length(0)]).optional(),
});

export default function ExerciseForm() {
  const setFormOpen = useExerciseHybridViewStore(
    ({ setFormOpen }) => setFormOpen,
  );

  const { mutate, isSuccess, isError, isPending } = useCreateExerciseMutation();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      difficulty: undefined,
      muscles: [],
      favourite: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate({ id: uuid(), ...values });
  }

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: 'Exercise created!',
        description: 'Your exercise has been created successfully.',
      });

      setFormOpen(false);
    }
  }, [setFormOpen, isSuccess, toast]);

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Whoops! Something went wrong.',
        description: "Your exercise hasn't been created.",
        variant: 'destructive',
      });
    }
  });

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
                  <Input
                    placeholder="Push Up"
                    disabled={isPending}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Explanatory Youtube video"
                    type="url"
                    disabled={isPending}
                    autoComplete="off"
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
                <FormLabel>
                  Description{' '}
                  <span className="text-muted-foreground">(Optional)</span>
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
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        className="placeholder:text-muted-foreground"
                        placeholder="Select difficulty level"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={Difficulty.EASY}>Easy</SelectItem>
                    <SelectItem value={Difficulty.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={Difficulty.HARD}>Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="muscles"
            disabled={isPending}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Muscles</FormLabel>
                <FormControl>
                  <MultiSelect
                    {...field}
                    options={muscles}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    placeholder="Select muscles"
                    maxCount={3}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="favourite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Favourite</FormLabel>
                <FormControl>
                  <div className="flex flex-row gap-2 items-center">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                    <FormDescription className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Add this exercise to your favourite list
                    </FormDescription>
                  </div>
                </FormControl>
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
