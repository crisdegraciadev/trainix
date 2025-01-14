import { useFilterWorkouts } from "@/core/api/queries/use-filter-workouts";
import { useWorkoutQueryStore } from "../_state/workout-query-store";
import { useInfiniteScroll } from "@/core/hooks/use-infinite-scroll";
import { LegacyRef, useEffect } from "react";
import WorkoutCard from "./card";
import { Link } from "react-router-dom";
import { AppRoutes } from "@/core/constants/app-routes";

export default function WorkoutList() {
  const query = useWorkoutQueryStore(({ order, filter }) => ({
    order,
    filter,
  }));

  const { data, isLoading, isError, fetchNextPage, refetch } = useFilterWorkouts(query);

  const { ref: infiniteScrollRef } = useInfiniteScroll(fetchNextPage);

  useEffect(() => {
    if (!isError) {
      refetch();
    }
  }, [query, refetch, isError]);

  if (isLoading || !data) {
    return <p>Loading</p>;
  }

  const totalWorkouts = data.pages[0].totalItems;
  const workouts = data.pages.flatMap(({ values }) => values);

  if (!workouts.length) {
    return (
      <div className="flex flex-col items-center">
        <img className="mt-[22vh] w-128 mb-4" src="/empty_exercises.svg" />
        <p className="text-muted-foreground md:text-xl text-lg">No workouts created yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {workouts.map((workout) => (
          <Link key={workout.name} to={`${AppRoutes.WORKOUTS}/${workout.id}`}>
            <WorkoutCard
              id={workout.id}
              name={workout.name}
              description={workout.description}
              muscles={workout.muscles}
              difficulty={workout.difficulty}
              favourite={workout.favourite}
              videoUrl={workout.videoUrl}
            />
          </Link>
        ))}
      </div>

      {totalWorkouts > workouts.length && <div ref={infiniteScrollRef as LegacyRef<HTMLDivElement>} />}
    </>
  );
}
