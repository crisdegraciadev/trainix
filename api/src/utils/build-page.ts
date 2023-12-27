import { Effect } from 'effect';
import { Paginated } from '../types/paginated';

type BuildPageArgs<T> = {
  skip: number;
  take: number;
  data: [T, number];
};

export const buildPage = <T>({
  skip,
  take,
  data: [resource, count],
}: BuildPageArgs<T>): Effect.Effect<never, never, Paginated<T>> => {
  return Effect.succeed({
    resource,
    count,
    pages: Math.ceil(count / take),
    current: skip,
  });
};
