/**
 * @returns Object with keys that are not in the keys array
 */
export function filterBykeys(
  obj: Record<string, any>,
  keys: string[]
): Record<string, any> {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      ...(!keys.includes(key) ? { [key]: obj[key] } : {}),
    }),
    {}
  );
}
