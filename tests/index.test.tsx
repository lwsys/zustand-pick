/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom/vitest";
import { expect, afterEach, describe, it, beforeEach } from "vitest";
import { fireEvent, render, act, cleanup } from "@testing-library/react";
import { store } from "./helper";
import * as hooks from "./hooks";
import * as state from "./store";

describe.for([
  [
    "hooks",
    hooks.Count,
    hooks.Toggle,
    hooks.getCountRenderCount,
    hooks.getToggleRenderCount,
  ] as const,
  [
    "store",
    state.Count,
    state.Toggle,
    state.getCountRenderCount,
    state.getToggleRenderCount,
  ] as const,
])(
  "test %s",
  async ([, Count, Toggle, getCountRenderCount, getToggleRenderCount]) => {
    beforeEach(() => {
      store.setState(store.getInitialState());
      hooks.setCountRenderCount(0);
      hooks.setToggleRenderCount(0);
      state.setCountRenderCount(0);
      state.setToggleRenderCount(0);
    });

    afterEach(() => {
      cleanup();
    });

    it("use selector with params", async () => {
      const { findByText } = render(<Count />);
      const clickBtn = await findByText("inc");
      expect(await findByText("0")).toBeInTheDocument();
      act(() => {
        fireEvent.click(clickBtn);
      });
      expect(await findByText("1")).toBeInTheDocument();
    });

    it("only re-render with changed state.", async () => {
      const Parent = () => {
        return (
          <div>
            <Count />
            <Toggle />
          </div>
        );
      };
      const { findByText } = render(<Parent />);
      expect(await findByText("0")).toBeInTheDocument();
      expect(await findByText("off")).toBeInTheDocument();
      expect(getCountRenderCount()).toBe(1);
      expect(getToggleRenderCount()).toBe(1);

      const clickBtn = await findByText("inc");
      act(() => fireEvent.click(clickBtn));

      expect(await findByText("1")).toBeInTheDocument();
      expect(getCountRenderCount()).toBe(2);
      expect(getToggleRenderCount()).toBe(1);

      const toggleBtn = await findByText("toggle");
      act(() => fireEvent.click(toggleBtn));
      expect(await findByText("on")).toBeInTheDocument();
      expect(getCountRenderCount()).toBe(2);
      expect(getToggleRenderCount()).toBe(2);
    });
  }
);
