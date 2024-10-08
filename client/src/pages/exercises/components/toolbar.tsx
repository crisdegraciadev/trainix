import HybridView from '@/components/hybrid-view';
import { ArrowDownNarrowWide, ListFilter, PlusCircle } from 'lucide-react';
import ExerciseForm from './forms/form';
import { useResolutionStore } from '@/core/state/resolution-store';
import { useExerciseHybridViewStore } from '../state/exercise-hybrid-view-store';
import ExerciseSortForm from './forms/sort-form';
import ExerciseFilterForm from './forms/filter-form';
import { Button } from '@/components/ui/button';

export default function ExerciseToolbar() {
  const { isDesktop } = useResolutionStore(({ isDesktop }) => ({
    isDesktop,
  }));

  const {
    formOpen,
    setFormOpen,
    filterOpen,
    setFilterOpen,
    orderOpen,
    setOrderOpen,
  } = useExerciseHybridViewStore((views) => ({
    ...views,
  }));


  return (
    <div className="flex items-center justify-between w-full gap-2">
      <div className="flex gap-2">
        <HybridView
          isDesktop={isDesktop}
          open={orderOpen}
          setOpen={setOrderOpen}
          title="Sort Exercises"
          description="Select the order to sort the exercises. Click sort when you're done."
          content={<ExerciseSortForm />}
          hideFooterOnDrawer={true}
          trigger={
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <ArrowDownNarrowWide className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Sort
              </span>
            </Button>
          }
        />

        <HybridView
          isDesktop={isDesktop}
          open={filterOpen}
          setOpen={setFilterOpen}
          title="Filter Exercises"
          description="Select your filters to find matching exercises. Click search when you're done."
          content={<ExerciseFilterForm />}
          hideFooterOnDrawer={true}
          trigger={
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <ListFilter className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Filter
              </span>
            </Button>
          }
        />
      </div>

      <HybridView
        isDesktop={isDesktop}
        open={formOpen}
        setOpen={setFormOpen}
        title="Create Exercise"
        description="Create a custom exercise here. Click save when you're done."
        content={<ExerciseForm />}
        trigger={
          <Button size="sm" className="h-8 gap-1">
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Exercise
            </span>
          </Button>
        }
      />
    </div>
  );
}
