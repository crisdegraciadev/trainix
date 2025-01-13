import { useFindWorkouts } from "@/core/api/queries/use-find-workouts";
import { useWorkoutQueryStore } from "../_state/workout-query-store";
import { useInfiniteScroll } from "@/core/hooks/use-infinite-scroll";
import { LegacyRef, useEffect } from "react";
import WorkoutCard from "./card";

export default function WorkoutList() {
  const query = useWorkoutQueryStore(({ order, filter }) => ({
    order,
    filter,
  }));

  const { data, isLoading, isError, fetchNextPage, refetch } = useFindWorkouts(query);

  const { ref: infiniteScrollRef } = useInfiniteScroll(fetchNextPage);

  useEffect(() => {
    if (!isError) {
      refetch();
    }
  }, [query, refetch, isError]);

  if (isLoading || !data) {
    return <p>Loading</p>;
  }

  const totalExercises = data.pages[0].totalItems;
  const exercises = data.pages.flatMap(({ values }) => values);

  if (!exercises.length) {
    return (
      <div className="flex flex-col items-center">
        <img className="mt-[22vh] w-128 mb-4" src="/empty_exercises.svg" />
        <p className="text-muted-foreground md:text-xl text-lg">No exercises created yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exercises.map((exercise) => (
          <WorkoutCard
            key={exercise.name}
            id={exercise.id}
            name={exercise.name}
            description={exercise.description}
            muscles={exercise.muscles}
            difficulty={exercise.difficulty}
            favourite={exercise.favourite}
            videoUrl={exercise.videoUrl}
          />
        ))}
      </div>

      {totalExercises > exercises.length && <div ref={infiniteScrollRef as LegacyRef<HTMLDivElement>} />}
    </>
  );
}
