import { useResolutionStore } from "@/core/state/resolution-store";
import { useWorkoutHybridViewStore } from "../_state/workout-hybrid-view-store";
import HybridView from "@/components/hybrid-view";
import { Button } from "@/components/ui/button";
import { ArrowDownNarrowWide, ListFilter, PlusCircle } from "lucide-react";
import WorkoutSortForm from "./sort-form";
import WorkoutFilterForm from "./filter-form";
import WorkoutForm from "./form";

export default function WorkoutToolbar() {
  const { isDesktop } = useResolutionStore(({ isDesktop }) => ({
    isDesktop,
  }));

  const { formOpen, setFormOpen, filterOpen, setFilterOpen, orderOpen, setOrderOpen } = useWorkoutHybridViewStore((views) => ({
    ...views,
  }));

  return (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex gap-2">
        <HybridView
          isDesktop={isDesktop}
          open={orderOpen}
          setOpen={setOrderOpen}
          title="Sort Workouts"
          description="Select the order to sort the workouts. Click sort when you're done."
          content={<WorkoutSortForm />}
          hideFooterOnDrawer={true}
          trigger={
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <ArrowDownNarrowWide className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Sort</span>
            </Button>
          }
        />

        <HybridView
          isDesktop={isDesktop}
          open={filterOpen}
          setOpen={setFilterOpen}
          title="Filter Workouts"
          description="Select your filters to find matching workouts. Click search when you're done."
          content={<WorkoutFilterForm />}
          hideFooterOnDrawer={true}
          trigger={
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <ListFilter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
            </Button>
          }
        />
      </div>

      <HybridView
        isDesktop={isDesktop}
        open={formOpen}
        setOpen={setFormOpen}
        title="Create Workout"
        description="Create a custom workout here. Click save when you're done."
        content={<WorkoutForm />}
        trigger={
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Create Workout</span>
          </Button>
        }
      />
    </div>
  );
}
