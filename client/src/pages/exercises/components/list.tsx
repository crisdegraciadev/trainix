import { useFindExercises } from '@/core/api/queries/use-find-exercises';
import { useExerciseQueryStore } from '../state/exercise-query-store';
import ExerciseCard from './card';
import { LegacyRef, useEffect } from 'react';
import { useInfiniteScroll } from '@/core/hooks/use-infinite-scroll';

export default function ExerciseList() {
  const query = useExerciseQueryStore(({ order, filter }) => ({
    order,
    filter,
  }));

  const { data, isLoading, isError, fetchNextPage, refetch } =
    useFindExercises(query);

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

  console.log({ data, totalExercises, exercisesLength: exercises.length });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {exercises.map((exercise, idx) => (
          <ExerciseCard
            key={exercise.id + idx}
            id={exercise.id}
            name={exercise.name}
            description={exercise.description}
            muscles={exercise.muscles}
            difficulty={exercise.difficulty}
            favourite={exercise.favourite}
            video={exercise.video}
          />
        ))}
      </div>

      {totalExercises > exercises.length && (
        <div ref={infiniteScrollRef as LegacyRef<HTMLDivElement>} />
      )}
    </>
  );
}
