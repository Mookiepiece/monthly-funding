<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { nextFrame } from './utils/scheduler';

const model = defineModel();

const props = defineProps<{
  options: (string | { label: string; value: string })[];
}>();

const options = computed(() =>
  props.options.map(option =>
    typeof option === 'string' ? { label: option, value: option } : option,
  ),
);
const _current = ref(options.value.findIndex(i => i.value === model.value));
const current = computed({
  get: () => {
    if (_current.value < 0 || _current.value >= options.value.length)
      return options.value.length ? 0 : -1;
    return _current.value;
  },
  set(v) {
    _current.value = v;
  },
});

const map = computed(() => options.value.map((_, i) => i));
const nav = (delta: number) => {
  // prettier-ignore
  switch (delta) {
    case -1: current.value = Math.max(0, current.value - 1); break;
    case 1: current.value = Math.min(map.value.length - 1, current.value + 1); break;
    case -Infinity: current.value = 0; break;
    case Infinity: current.value = map.value.length - 1; break;
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.target instanceof HTMLElement && e.target.closest('[role="radio"]')) {
    const _nav = (delta: number) => {
      e.preventDefault();
      nav(delta);
      if (current.value >= 0 && current.value < map.value.length)
        model.value = options.value[current.value].value;
    };

    // prettier-ignore
    switch (e.key) {
      case 'ArrowUp': case 'ArrowLeft': _nav(-1); break;
      case 'ArrowDown': case 'ArrowRight':  _nav(1); break;
      case 'Home': _nav(-Infinity); break;
      case 'End': _nav(Infinity); break;
    }
  }
};

let first = true;
const ready = ref(false);
const el = ref<HTMLElement>();
watchEffect(
  () => {
    model.value;
    const $el = el.value;
    if (!$el) return;
    const currEl = $el.querySelector<HTMLElement>(
      '[role="radio"][aria-selected="true"]',
    );
    if (!currEl) return;
    $el.style.setProperty('--l', currEl.offsetLeft + 'px');
    $el.style.setProperty('--w', currEl.offsetWidth + 'px');

    if (first) {
      first = false;
      nextFrame(() => {
        ready.value = true;
      });
    }
  },
  { flush: 'post' },
);
</script>

<template>
  <div role="radiogroup" @keydown="handleKeydown" ref="el" :class="{ ready }">
    <div
      role="radio"
      v-for="(option, index) in options"
      :key="index"
      :value="option.value"
      :aria-selected="model === option.value ? 'true' : undefined"
      :tabindex="current === index ? 0 : -1"
      @click="(model = option.value), (current = index)"
    >
      {{ option.label }}
    </div>
  </div>
</template>

<style scoped>
[role='radiogroup'] {
  position: relative;
  display: inline-flex;
  height: 25px;
  background: var(--air-1);
  color: var(--text-1);
  box-shadow: inset 0 1px 4px -1px #0003;
  border-radius: 999px;
  user-select: none;
  cursor: default;

  &:hover {
    background: var(--air-2);
  }
  &:active {
    background: var(--air-3);
  }

  &::before {
    position: absolute;
    top: 2px;
    bottom: 2px;
    left: calc(2px + var(--l));
    width: calc(var(--w) - 4px);
    display: block;

    background: var(--air-0);
    box-shadow: 0 1px 2px -1px #0003;

    border-radius: 999px;
    content: '';
  }
  &.ready::before {
    transition: all 0.2s var(--wave-s);
  }

  &:has(:focus-visible) {
    outline: 2px solid var(---main);
    outline-offset: -1px;
  }
}

[role='radio'] {
  position: relative;
  display: grid;
  place-content: center;
  min-width: 40px;

  outline: 0;
}
</style>
