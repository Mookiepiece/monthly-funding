<script lang="ts">
import { MaybeRef } from 'vue';
import { bagEffect, fx } from './utils';
import { forwardRef } from './utils/forwardRef';
import { nextFrame } from './utils/scheduler';

// prettier-ignore
const focusIn = (el:Element) => el.querySelector<any>(':is(button, input, [tabindex]):not(:disabled, [tabindex="-1"])')?.focus?.();

export const useDynamic = () => {
  const island = ref<HTMLElement>();
  const rect = reactive({ width: 0, height: 0 });

  const copy = ($: MaybeRef) => {
    const _ = unref($);
    [rect.width, rect.height] = [_.offsetWidth, _.offsetHeight];
  };

  let _ro = null as HTMLElement | null;
  const ro = new ResizeObserver(() => copy(_ro));
  const observe = ($el: HTMLElement) => (
    ro.disconnect(), ro.observe((_ro = $el))
  );

  const register = (open: Ref<boolean>, items: Ref<any>, appear = false) => {
    const visible = ref(open.value);

    bagEffect(bag => {
      const $island = island.value;
      if (!$island) return;

      const $open = open.value;
      const $item: HTMLElement = forwardRef(items).value;
      if (!$item) return;
      if ($open) {
        // NOTE: prevent from accessing offsetWidth during the mount
        // causing the browser paints and the enter animation broken due to it is called in this frame
        // e.g. VSegmented
        ro.disconnect();
        let abort = false;
        bag(() => (abort = true));

        if (appear) {
          appear = false;
          $island.style.setProperty('transition', 'none');
          nextFrame(() => $island.style.removeProperty('transition'));
          visible.value = true;
          copy($item);
          observe($item);
        } else {
          $item.style.display = 'none';
          nextFrame(() => {
            if (abort) return;
            $item.style.removeProperty('display');
            fx.cssTransition($item, 'v-enter', {
              from() {
                appear &&= false;
                visible.value = true;
                copy($item);
                focusIn($item);
              },
              done() {
                if (abort) return;
                observe($item);
              },
            });
          });
        }
      } else if (!$open) {
        fx.cssTransition($item, 'v-leave', {
          from(bag) {
            $item.style.position = 'absolute';
            $item.style.top = `calc(50% - ${$item.offsetHeight / 2 + 'px'})`;
            $item.style.left = `calc(50% - ${$item.offsetWidth / 2 + 'px'})`;
            bag(() => {
              $item.style.removeProperty('position');
              $item.style.removeProperty('top');
              $item.style.removeProperty('left');
            });
          },
          done() {
            $item.style.removeProperty('position');
            $item.style.removeProperty('display');
            $item.style.display = 'none';
            visible.value = false;
          },
        });
      }
    });

    return {
      visible: computed(() => visible.value || open.value),
    };
  };

  return {
    rect,
    copy,
    register,
    island,
  };
};
</script>

<script setup lang="ts">
import { computed, reactive, Ref, ref, unref, watchEffect } from 'vue';

const props = defineProps<{
  dynamic: ReturnType<typeof useDynamic>;
}>();

const root = ref<HTMLElement>();
// prettier-ignore
watchEffect(() => (props.dynamic.island.value = root.value), { flush: 'sync' });
</script>

<template>
  <div
    class="Dynamic"
    ref="root"
    :style="{
      width: dynamic.rect.width + 'px',
      height: dynamic.rect.height + 'px',
    }"
  >
    <slot />
  </div>
</template>

<style>
.Dynamic {
  position: relative;
  margin: auto;
  width: max-content;

  display: grid;
  place-content: center;

  border-radius: 25px;
  background: var(--air-0);

  transition: all 0.3s var(--wave);
}

.Dynamic > * {
  &.v-enter-from,
  &.v-leave-to {
    transform: scale(0);
    opacity: 0;
  }

  &.v-leave-active {
    transition: all 0.3s var(--wave);
    z-index: 2;
  }
  &.v-enter-active {
    transition: all 0.3s 0.1s var(--wave);
    z-index: 1;
  }
}
</style>
