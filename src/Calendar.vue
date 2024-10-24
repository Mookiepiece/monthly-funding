<script setup lang="ts">
import { computed, Ref } from 'vue';
import { Dayjs } from 'dayjs';

import VButton from './VButton.vue';
import TIcon from './TIcon.vue';
import Cell from './Cell.vue';

const model = defineModel<Dayjs>({ required: true });

defineProps<{
  today: Dayjs;
  salaryDay: number;
  budgets: number[];
}>();

const firstDayOfWeek = computed(() =>
  model.value.localeData().firstDayOfWeek(),
);
const columns = computed(() => {
  const raw = [...model.value.localeData().weekdaysMin()];
  let i = firstDayOfWeek.value;
  while (i--) raw.push(raw.shift()!);
  return raw;
});
const useCells = (_today: Ref<Dayjs>) =>
  computed(() => {
    const today = _today.value;

    const firstDayOfWeek = today.localeData().firstDayOfWeek();
    const days = today.daysInMonth();
    const day = today.startOf('M').day();

    const prepend = Array((day - firstDayOfWeek + 7) % 7).fill(0);
    const cells = Array(days)
      .fill(0)
      .map((_, i) => i + 1);
    const append = Array(42 - prepend.length - cells.length).fill(0);

    return [...prepend, ...cells, ...append];
  });
const cells = useCells(model);

const mav = (delta: number) => {
  // prettier-ignore
  switch (delta) {
    case -1: model.value = model.value.add(-1, 'month'); break;
    case 1:  model.value = model.value.add(1, 'month'); break;
  }
};
</script>

<template>
  <section class="Calendar" style="width: min(800px, 800px)">
    <header class="nav">
      <VButton
        @click="mav(-1)"
        @keydown.left.prevent="mav(-1)"
        @keydown.right.prevent="mav(1)"
      >
        <TIcon i="chevron-left" />
      </VButton>
      <VButton @click="mav(1)" tabindex="-1">
        <TIcon i="chevron-right" />
      </VButton>
      <span>{{ model.month() + 1 }}</span>

   
    </header>
    <div class="grid">
      <div
        class="columnheader"
        v-for="(i, index) in columns"
        :data-weekday="(index - firstDayOfWeek + 7) % 7"
      >
        {{ i }}
      </div>
      <Cell
        v-for="(cell, index) in cells"
        :key="index"
        :month="model"
        :today
        :cell
        :salaryDay
        :budgets
      />
    </div>
  </section>
</template>

<style>
.Calendar {
  padding: 15px 20px;
  user-select: none;

  header {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);

  > * {
    padding: 10px;
  }

  .columnheader {
    font-size: 75%;
    height: 45px;
  }
}
</style>
