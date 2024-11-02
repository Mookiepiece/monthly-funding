<script lang="ts">
import Capsule from './Capsule.vue';
import Dynamic, { useDynamic } from './Dynamic.vue';
import Calendar from './Calendar.vue';
import { bagEffect, on } from './utils';
import Settings from './Settings.vue';
import { forwardRef } from './utils/forwardRef';
</script>

<script setup lang="ts">
import { ComponentInstance, computed, ref } from 'vue';

// dynamic
const capsule = ref<ComponentInstance<typeof Capsule>>();
const calendar = ref<ComponentInstance<typeof Calendar>>();
const dynamic = useDynamic();

const island = ref<InstanceType<typeof Dynamic>>();
const islandEl = forwardRef(island);

const open = ref(0);

const { visible: visibleA } = dynamic.register(
  computed(() => !open.value),
  capsule,
  true,
);

const { visible: visibleB } = dynamic.register(
  computed(() => !!open.value),
  calendar,
);

bagEffect(bag => {
  const $island: HTMLElement = islandEl.value;
  if (!$island) return;

  let cooldown: ReturnType<typeof setTimeout>;
  const throttleBoth = (cb: () => any) => {
    return () => {
      if (cooldown > -1) {
        clearTimeout(cooldown);
        cooldown = setTimeout(() => {
          cooldown = -1;
          cb();
        }, 500);
      } else {
        cb();
        cooldown = setTimeout(() => {}, 500);
      }
    };
  };

  bag(on($island).mouseenter(throttleBoth(() => (open.value = 1))));
  bag(on($island).mouseleave(throttleBoth(() => (open.value = 0))));
});
bagEffect(bag => {
  const $island: HTMLElement = islandEl.value;
  if (!$island) return;

  if (!open.value) {
    bag(on($island).touchstart(() => (open.value = 1)));
  } else {
    bag(
      on(document).touchstart(e => {
        if (e.target instanceof Element && e.target.closest('button')) return;

        if (e.target instanceof Element && !$island.contains(e.target))
          open.value = 0;
      }),
    );
  }
});
</script>

<template>
  <Dynamic :dynamic ref="island">
    <Capsule v-if="visibleA" ref="capsule" />
    <!-- prettier-ignore -->
    <Calendar v-if="visibleB" ref="calendar" />
  </Dynamic>
  <Settings />
</template>
