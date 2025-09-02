import { ExtractState, StoreApi, UseBoundStore } from "zustand";

export const useStore = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends UseBoundStore<StoreApi<any>>,
  Paths extends (keyof ExtractState<T>)[]
>(
  store: T
) =>
  new Proxy(
    {},
    {
      get: (_, key) => {
        const values = store((e) => e[key]);
        return values;
      },
    }
  ) as { [K in Paths[number]]: ExtractState<T>[K] };
