import { FacetedFilter } from '@/components/faceted-filter';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Difficulty, Muscle } from '@/core/types';
import { formatString, StrFormat } from '@/core/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useExerciseHybridViewStore } from '../../state/exercise-hybrid-view-store';
import { useExerciseQueryStore } from '../../state/exercise-query-store';

const formSchema = z.object({
  name: z.string().optional(),
  userId: z.string().optional(),
  favourite: z
    .union([z.literal('all'), z.literal('fav'), z.literal('non-fav')])
    .optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
  muscles: z.array(z.nativeEnum(Muscle)).optional(),
});

function calcFavouriteValue(val?: string) {
  if (val === undefined) return 'all';
  return val === 'true' ? 'fav' : 'non-fav';
}

export default function ExerciseFilterForm() {
  const setFilterOpen = useExerciseHybridViewStore(
    ({ setFilterOpen }) => setFilterOpen,
  );

  const { filter, setFilter } = useExerciseQueryStore(
    ({ filter, setFilter }) => ({
      filter,
      setFilter,
    }),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...filter,
      favourite: calcFavouriteValue(filter.favourite),
    },
  });

  function reset() {
    form.setValue('name', undefined);
    form.setValue('favourite', 'all');
    form.setValue('difficulty', undefined);
    form.setValue('muscles', undefined);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setFilter({
      ...values,
      name: values.name === '' ? undefined : values.name,
      favourite:
        values.favourite === 'all'
          ? undefined
          : values.favourite === 'fav'
            ? 'true'
            : 'false',
    });

    setFilterOpen(false);
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
                  <Input
                    placeholder="Exercise name"
                    autoComplete="off"
                    onChange={field.onChange}
                    defaultValue={field.value}
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
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="all" />
                      </FormControl>
                      <FormLabel>
                        <Label className="font-normal">All exercises</Label>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="non-fav" />
                      </FormControl>
                      <FormLabel>
                        <Label className="font-normal">Regular exercises</Label>
                      </FormLabel>
                    </FormItem>

                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="fav" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        <Label className="font-normal">
                          Favourite exercises
                        </Label>
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
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
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
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
            render={() => (
              <FormItem>
                <FormLabel>Muscles</FormLabel>
                <FormControl>
                  <FacetedFilter
                    onChange={(muscles: string[]) =>
                      form.setValue('muscles', muscles as Muscle[])
                    }
                    defaultValues={filter.muscles as string[]}
                    title="Muscles"
                    options={Object.values(Muscle).map((muscle) => ({
                      label: formatString(muscle, StrFormat.TITLE_CASE),
                      value: muscle,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button
            className="w-full"
            variant="outline"
            type="submit"
            onClick={() => reset()}
          >
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
