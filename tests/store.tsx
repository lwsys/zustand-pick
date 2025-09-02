import { store } from "./helper";

let countRenderCount = 0;
export const getCountRenderCount = () => countRenderCount;
export const setCountRenderCount = (v: number) => (countRenderCount = v);
export const Count = () => {
  const { count, inc } = store.state;
  countRenderCount++;
  return (
    <div>
      <span>{count}</span>
      <button onClick={() => inc(1)}>inc</button>
    </div>
  );
};

export let toggleRenderCount = 0;
export const getToggleRenderCount = () => toggleRenderCount;
export const setToggleRenderCount = (v: number) => (toggleRenderCount = v);
export const Toggle = () => {
  const { value, setValue } = store.state;
  toggleRenderCount++;
  return (
    <div>
      <span>{value}</span>
      <button onClick={() => setValue(value === "on" ? "off" : "on")}>
        toggle
      </button>
    </div>
  );
};
