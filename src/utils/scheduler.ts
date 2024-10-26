// https://github.com/vuejs/core/blob/ee4cd78a06e6aa92b12564e527d131d1064c2cd0/packages/runtime-dom/src/components/Transition.ts#L316
export const nextFrame = (cb: () => void) =>
  requestAnimationFrame(() => requestAnimationFrame(() => cb()));
