<script lang="ts">
import { MaybeRef } from 'vue';
import { fx } from './utils';
import { forwardRef } from './utils/forwardRef';

export const useDynamic = () => {
  const island = ref<any>();
  const rect = reactive({
    width: 0,
    height: 0,
  });

  const copy = ($: MaybeRef) => {
    const _ = unref($);
    [rect.width, rect.height] = [_.offsetWidth, _.offsetHeight];
  };

  const register = (open: Ref<boolean>, items: Ref<any>, appear = false) => {
    const visible = ref(open.value);

    const off = watchEffect(() => {
      const $island = island.value;
      if (!$island) return;

      const $open = open.value;
      const $item: HTMLElement = forwardRef(items).value;
      if (!$item) return;
      if ($open) {
        if (appear) {
          appear = false;
          $island.style.transition = 'none';
          visible.value = true;
          copy($item);
          requestAnimationFrame(() => {
            $island.style.removeProperty('transition');
          });
          return;
        }

        fx.cssTransition($item, 'v-enter', {
          from() {
            visible.value = true;
            copy($item);
            $item.style.removeProperty('position');
            $item.style.removeProperty('display');
          },
          to() {},
        });
      } else if (!$open) {
        fx.cssTransition($item, 'v-leave', {
          from() {
            $item.style.position = 'absolute';
            $item.style.top = `calc(50% - ${$item.offsetHeight / 2 + 'px'})`;
            $item.style.left = `calc(50% - ${$item.offsetWidth / 2 + 'px'})`;
          },
          done() {
            visible.value = false;
            $item.style.display = 'none';
          },
        });
      }
    });

    return {
      visible: computed(() => visible.value || open.value),
      off,
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

  transition: all 0.3s var(--wave);

  border-radius: 25px;
  background: var(--air-0);

  overflow: clip;
}

.Dynamic > * {
  &.v-enter-from,
  &.v-leave-to {
    transform: scale(0);
    opacity: 0;
  }

  &.v-leave-active {
    transition: all 0.3s var(--wave);
  }
  &.v-enter-active {
    transition: all 0.3s 0.1s var(--wave);
  }
}
</style>
