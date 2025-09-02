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
  config: StateCreator<TState, [...Mps, ["state", unknown]], Mcs>
) => StateCreator<TState, Mps, [["state", TState], ...Mcs]>;

type Write<T, U> = Omit<T, keyof U> & U;

declare module "zustand/vanilla" {
  interface StoreMutators<S, A> {
    state: Write<S, { state: A }>;
  }
}

export const createSelector = (<TState extends object>(
    fn: StateCreator<TState, [], []>
  ) =>
  (
    set: StoreApi<TState>["setState"],
    get: StoreApi<TState>["getState"],
    api: Mutate<StoreApi<TState>, [["state", TState]]>
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
    api.state = proxyObject;

    return fn(set, get, api);
  }) as StatePick;
