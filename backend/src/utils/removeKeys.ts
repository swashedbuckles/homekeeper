
/**
 * Safely remove keys from an object via a reduce operation
 * 
 * @param state source object
 * @param keysToRemove which keys to remove
 * @returns Object sans keys
 */
export function removeKeysReducer<T extends object, K extends keyof T>(
    state: T,
    keysToRemove: K[]
  ): Omit<T, K> {
    return Object.keys(state).reduce((acc, key) => {
      if (!keysToRemove.includes(key as K)) {
        acc[key as keyof Omit<T, K>] = state[key as keyof T] as Omit<T,K>[keyof Omit<T,K>];
      }
      return acc;
    }, {} as Omit<T, K>);
  }