/**
 * Supports AbortSignal for unsubscription (e.g. Vue SFC unmount)
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  timeout = 300,
): T => {
  let i: ReturnType<typeof setTimeout>;
  return ((...args) => {
    i = (clearTimeout(i), setTimeout(() => fn(...args), timeout));
  }) as T;
};

export const onTimeout = <T extends (...args: any[]) => void>(
  fn: T,
  timeout = 300,
): (() => void) => {
  const timer = setTimeout(fn, timeout);
  return () => clearTimeout(timer);
};

// https://github.com/vuejs/core/blob/ee4cd78a06e6aa92b12564e527d131d1064c2cd0/packages/runtime-dom/src/components/Transition.ts#L316
export const nextFrame = (cb: () => void) =>
  requestAnimationFrame(() => requestAnimationFrame(() => cb()));

export const longPress = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
) => {
  fn();
  let i: ReturnType<typeof setTimeout>, j: ReturnType<typeof setInterval>;
  i = setTimeout(() => (j = setInterval(fn, 100)), 300);

  return () => {
    clearTimeout(i), clearInterval(j);
  };
};
