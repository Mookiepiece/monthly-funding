<script lang="ts">
import Capsule from './Capsule.vue';
import Dynamic, { useDynamic } from './Dynamic.vue';
import Calendar from './Calendar.vue';
import { Bag, bagEffect, fx, on } from './utils';
import Settings from './Settings.vue';
import { forwardRef } from './utils/forwardRef';
import { AppState } from './App';
</script>

<script setup lang="ts">
import dayjs from 'dayjs';
import { ComponentInstance, computed, ref, toRef } from 'vue';

const today = dayjs();
const model = ref(dayjs());

const salaryDay = toRef(AppState, 'salaryDay');
const budgets = toRef(AppState, 'budgets');

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
        }, 300);
      } else {
        cb();
        cooldown = setTimeout(() => {}, 3000);
      }
    };
  };

  bag(on($island).mouseenter(throttleBoth(() => (open.value = 1))));
  bag(on($island).mouseleave(throttleBoth(() => (open.value = 0))));

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
    <Capsule v-if="visibleA" ref="capsule" :today :salaryDay :budgets />
    <!-- prettier-ignore -->
    <Calendar v-if="visibleB" ref="calendar" :today :salaryDay :budgets v-model="model" />
  </Dynamic>
  <Settings />
</template>
