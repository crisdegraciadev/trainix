import { ORDER_SCHEMA, OrderSchema } from "@/core/types";
import { z } from "zod";
import { useWorkoutHybridViewStore } from "../state/workout-hybrid-view-store";
import { useWorkoutQueryStore } from "../state/workout-query-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Unselect from "@/components/unselect";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: ORDER_SCHEMA,
  createdAt: ORDER_SCHEMA,
});

const SortOptions = {
  NAME: [
    { label: "Alphabetical", value: "asc" },
    { label: "Reverse", value: "desc" },
  ],
  CREATION: [
    { label: "Newer", value: "desc" },
    { label: "Older", value: "asc" },
  ],
};

export default function WorkoutSortForm() {
  const setOrderOpen = useWorkoutHybridViewStore(({ setOrderOpen }) => setOrderOpen);

  const { order, setOrder } = useWorkoutQueryStore(({ order, setOrder }) => ({
    order,
    setOrder,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { ...order },
  });

  function reset() {
    form.setValue("name", undefined);
    form.setValue("createdAt", "desc");
    setOrder({ name: undefined, createdAt: "desc" });
    setOrderOpen(false);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setOrder(values);
    setOrderOpen(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4 mb-8">
          <FormField
            control={form.control}
            name="name"
            render={() => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Unselect
                    options={SortOptions.NAME}
                    onChange={(value) => {
                      form.setValue("name", value as OrderSchema);
                    }}
                    defaultValue={order.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="createdAt"
            render={() => (
              <FormItem>
                <FormLabel>Creation</FormLabel>
                <FormControl>
                  <Unselect
                    options={SortOptions.CREATION}
                    onChange={(value) => {
                      form.setValue("createdAt", value as OrderSchema);
                    }}
                    defaultValue={order.createdAt}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2">
          <Button className="w-full" variant="outline" type="button" onClick={() => reset()}>
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
