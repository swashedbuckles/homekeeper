/**
 * Utility types to extract types from values. 
 */

export type SetElementType<T> = T extends Set<infer U> ? U : never;
export type ValuesOfObject<T> = T[keyof T];