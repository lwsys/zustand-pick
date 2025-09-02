import { createSelector } from "./../src";
import { create } from "zustand";
export const store = create<{
  count: number;
  inc: (num: number) => void;
  dec: (num: number) => void;
  value: string;
  setValue: (str: string) => void;
}>()(
  createSelector((set) => ({
    count: 0,
    inc: (num) =>
      set((prev) => ({
        count: prev.count + num,
      })),
    dec: (num) =>
      set((prev) => ({
        count: prev.count - num,
      })),
    value: "off",
    setValue: (str) =>
      set({
        value: str,
      }),
  }))
);
