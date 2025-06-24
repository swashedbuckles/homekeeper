export type Optional<T> = T | undefined;
export type Nullable<T> = T | null;

export function isNull<T>(value: Nullable<T>): value is null {
  return value === null;
}

export function hasValue<T>(value: Nullable<T>): value is T {
  return value !== null;
}