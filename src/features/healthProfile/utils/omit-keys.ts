export function omitKeys<T, const K extends readonly (keyof T)[]>(
  obj: T,
  keys: K,
): Omit<T, K[number]> {
  const copy = { ...obj };
  for (const k of keys) delete copy[k];
  return copy as Omit<T, K[number]>;
}
