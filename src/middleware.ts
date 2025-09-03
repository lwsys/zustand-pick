import { useCallback } from "react";
import {
  Mutate,
  StateCreator,
  StoreApi,
  StoreMutatorIdentifier,
  useStore,
} from "zustand";

type StatePick = <
  TState,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<TState, [...Mps, ["use", unknown]], Mcs>
) => StateCreator<TState, Mps, [["use", () => TState], ...Mcs]>;

type Write<T, U> = Omit<T, keyof U> & U;

declare module "zustand/vanilla" {
  interface StoreMutators<S, A> {
    use: Write<S, { use: A }>;
  }
}

export const createSelector = (<TState extends object>(
    fn: StateCreator<TState, [], []>
  ) =>
  (
    set: StoreApi<TState>["setState"],
    get: StoreApi<TState>["getState"],
    api: Mutate<StoreApi<TState>, [["use", () => TState]]>
  ) => {
    const proxyObject = new Proxy({} as TState, {
      get: (_, path) => {
        const selector = useCallback(
          (e: TState) => e[path as keyof TState],
          [api, path]
        );
        const value = useStore(api, selector);
        return value;
      },
    });
    // expose a "use" hooks to reducing mental load.
    api.use = () => proxyObject;

    return fn(set, get, api);
  }) as StatePick;
