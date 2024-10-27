<script lang="ts">
import { computed, InputHTMLAttributes, ref, watchEffect } from 'vue';
import { bagEffect, on } from './utils';

/**
 * To support touchpad which triggers delta less than 50 frequently.
 */
export const onStepWheel = (
  el: HTMLElement | SVGElement,
  cb: (delta: number) => void,
) => {
  let delta = 0;

  return on(el).wheel.prevent(e => {
    delta += e.deltaY;

    if (delta > 20) {
      delta = 0;
      cb(1);
    } else if (delta < 20) {
      delta = 0;
      cb(-1);
    }
  });
};
</script>

<script setup lang="ts">
const model = defineModel<number | null>({ default: null });
const props = defineProps<{
  name?: InputHTMLAttributes['name'];
  id?: InputHTMLAttributes['id'];
  tabindex?: InputHTMLAttributes['tabindex'];
  min?: number | string;
  max?: number | string;
}>();
const el = ref<HTMLInputElement>();

const clamp = (v: number) => {
  if (!Number.isFinite(v)) return v;
  if (props.min !== undefined) v = Math.max(v, Number(props.min));
  if (props.max !== undefined) v = Math.min(v, Number(props.max));
  return v;
};

const nav = (delta: number) => {
  model.value = clamp((model.value ?? 0) + delta);
};

watchEffect(onCleanup => {
  const $el = el.value;
  if (!$el) return;
  onCleanup(
    onStepWheel($el, v => {
      if ($el !== document.activeElement) $el.focus();
      nav(-v);
    }),
  );
});

bagEffect(bag => {
  const $el = el.value;
  if (!$el) return;
  bag(on($el).keydown['ArrowUp'].prevent(() => nav(1)));
  bag(on($el).keydown['ArrowRight'].prevent(() => nav(1)));
  bag(on($el).keydown['ArrowLeft'].prevent(() => nav(-1)));
  bag(on($el).keydown['ArrowDown'].prevent(() => nav(-1)));
});

const shadow = ref(null as string | null);
const composed = computed({
  get: () => String(shadow.value ?? model.value),
  set: _v => {
    shadow.value = _v;
    _v = _v.trim();
    if (!_v) return (model.value = null);

    const v = clamp(Number(_v));
    if (!Number.isFinite(v)) return;
    model.value = v;
  },
});
</script>

<template>
  <div>
    <input
      ref="el"
      v-model="composed"
      @blur="shadow = null"
      :name
      :id
      :tabindex
    />
  </div>
</template>

<style scoped>
div {
  display: flex;
}
input {
  width: 100%;
  height: 25px;
  line-height: 25px;
  border: 0;
  outline: 0;
  padding: 0 10px;
  background: var(--air-1);
  color: var(--text-1);

  box-shadow: inset 0 1px 4px -1px #0003;
  border-radius: 999px;

  &:hover {
    background: var(--air-2);
  }
  &:focus-visible {
    outline: 2px solid var(---main);
    outline-offset: -1px;
  }
}
</style>
