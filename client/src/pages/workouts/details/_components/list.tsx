import HybridView from "@/components/hybrid-view";
import { Button } from "@/components/ui/button";
import { useFilterIterations } from "@/core/api/queries/use-filter-iterations";
import { useInfiniteScroll } from "@/core/hooks/use-infinite-scroll";
import { FilterIterationsDTO, OrderIterationsDTO } from "@/core/types";
import { useMediaQuery } from "@uidotdev/usehooks";
import { PlusCircle } from "lucide-react";
import { LegacyRef, useEffect } from "react";
import { useIterationHybridViewStore } from "../_state/iteration-hybrid-view-store";
import IterationForm from "./form";

export default function IterationList({ workoutId }: { workoutId: number }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { formOpen, setFormOpen } = useIterationHybridViewStore(({ formOpen, setFormOpen }) => ({ formOpen, setFormOpen }));

  const ORDER: OrderIterationsDTO = { createdAt: "asc" };
  const FILTER: FilterIterationsDTO = { workoutId };

  const { data, isLoading, isError, fetchNextPage, refetch } = useFilterIterations({ order: ORDER, filter: FILTER });

  const { ref: infiniteScrollRef } = useInfiniteScroll(fetchNextPage);

  useEffect(() => {
    if (!isError) {
      refetch();
    }
  }, [refetch, isError]);

  if (isLoading || !data) {
    return <p>Loading</p>;
  }

  const totalIterations = data.pages[0].totalItems;
  const iterations = data.pages.flatMap(({ values }) => values);

  console.log({ data });

  if (!iterations.length) {
    return (
      <div className="flex flex-col items-center">
        <img className="mt-[18vh] w-128 mb-4" src="/empty_exercises.svg" />
        <p className="text-muted-foreground md:text-xl text-lg">No iterations created yet.</p>

        <HybridView
          isDesktop={isDesktop}
          open={formOpen}
          setOpen={setFormOpen}
          title="Create Iteration"
          description="Create an iteration for this workout. Click save when you're done."
          content={<IterationForm />}
          trigger={
            <Button className="mt-4">
              <PlusCircle className="h-4 w-4" />
              <span className="ml-2">Create</span>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>

      {totalIterations > iterations.length && <div ref={infiniteScrollRef as LegacyRef<HTMLDivElement>} />}
    </>
  );
}
