import { QueryClient } from "@tanstack/react-query";

export function optimisticSet<T>(
  queryClient: QueryClient,
  key: unknown[],
  updater: (prev: T[]) => T[],
): T[] {
  const prev = queryClient.getQueryData<T[]>(key) || [];
  const updated = updater(prev);
  queryClient.setQueryData<T[]>(key, updated);
  return prev;
}

export function rollback<T>(
  queryClient: QueryClient,
  key: unknown[],
  prev: T[],
): void {
  if (prev) {
    queryClient.setQueryData<T[]>(key, prev);
  }
}

export function optimisticAdd<T>(
  queryClient: QueryClient,
  key: unknown[],
  newItem: T,
): T[] {
  return optimisticSet<T>(queryClient, key, (prev) => [...prev, newItem]);
}

export function optimisticRemove<T>(
  queryClient: QueryClient,
  key: unknown[],
  predicate: (item: T) => boolean,
): T[] {
  return optimisticSet<T>(queryClient, key, (prev) =>
    prev.filter((item) => !predicate(item)),
  );
}

export function optimisticUpdate<T>(
  queryClient: QueryClient,
  key: unknown[],
  predicate: (item: T) => boolean,
  updater: (item: T) => T,
): T[] {
  return optimisticSet<T>(queryClient, key, (prev) =>
    prev.map((item) => (predicate(item) ? updater(item) : item)),
  );
}
