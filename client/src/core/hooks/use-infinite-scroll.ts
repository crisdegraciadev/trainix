import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from '@tanstack/react-query';
import { useCallback, useRef } from 'react';
import { Page } from '../types';

type FetchNextFn<T> = (
  options?: FetchNextPageOptions,
) => Promise<
  InfiniteQueryObserverResult<InfiniteData<Page<T>, unknown>, Error>
>;

export function useInfiniteScroll<T>(fetchNextPage: FetchNextFn<T>) {
  const observer = useRef<IntersectionObserver>();

  const ref = useCallback(
    (node: HTMLElement) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [fetchNextPage],
  );

  return { ref };
}
