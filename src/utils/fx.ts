import { nextFrame } from './scheduler';
import { Bag, Bags } from './collection';
import { on } from './on';

const { resetBag } = Bags();

type TransitionInit = {
  from?: (bag: ReturnType<typeof Bag>) => (() => void) | void;
  to?: (bag: ReturnType<typeof Bag>) => (() => void) | void;
  done?: () => (() => void) | void;
};

const transition = (el: HTMLElement | SVGElement, options: TransitionInit) => {
  const bag = resetBag(el);

  let aborted = false;
  bag(() => (aborted = true));

  options.from?.(bag);

  nextFrame(() => {
    if (aborted) return;

    options.to?.(bag);

    const transitionDurations = window
      .getComputedStyle(el)
      .transitionDuration.split(',');

    let count = 0;
    bag(
      on(el).transitionend.self(_ => {
        if (++count === transitionDurations.length) {
          if (aborted) return;
          bag();
          options.done?.();
        }
      }),
    );
  });
};

const cssTransition = (
  el: HTMLElement | SVGElement,
  cssname: string = 'v',
  options?: TransitionInit,
) => {
  transition(el, {
    from(bag) {
      el.classList.add(cssname + '-from');
      el.classList.add(cssname + '-active');
      bag(() => {
        el.classList.remove(cssname + '-from');
        el.classList.remove(cssname + '-active');
      });

      options?.from?.(bag);
    },
    to(bag) {
      el.classList.remove(cssname + '-from');
      el.classList.add(cssname + '-to');
      bag(() => {
        el.classList.remove(cssname + '-to');
      });

      options?.to?.(bag);
    },
    done() {
      el.classList.remove(cssname + '-active');
      el.classList.remove(cssname + '-to');
      options?.done?.();
    },
  });
};

/**
 * Inspired by https://vuejs.org/guide/built-ins/transition.html
 */
export const fx = {
  transition,
  cssTransition,
};
