<script lang="ts">
import localeData from 'dayjs/plugin/localeData';
import { computed, MaybeRef, ref, unref } from 'vue';
import ja from 'dayjs/locale/ja';
import VButton from './VButton.vue';
import TIcon from './TIcon.vue';
import Cell from './Cell.vue';
import Timeline from './Capsule.vue';

dayjs.extend(localeData);
dayjs.locale(ja);

const useCells = (_today: MaybeRef<Dayjs>) =>
  computed(() => {
    const today = unref(_today);

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
</script>

<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';

const today = dayjs();
const model = ref(dayjs());
const cells = useCells(model);

const nav = (delta: number) => {
  // prettier-ignore
  switch (delta) {
    case -Infinity: model.value = model.value.startOf('M'); break;
    case Infinity:  model.value = model.value.endOf('M'); break;
    default:        model.value = model.value.add(delta, 'day');
  }
};

const mav = (delta: number) => {
  // prettier-ignore
  switch (delta) {
    case -1:        model.value = model.value.add(-1, 'month'); break;
    case 1:         model.value = model.value.add(1, 'month'); break;
  }
};

const firstDayOfWeek = computed(() =>
  model.value.localeData().firstDayOfWeek(),
);
const columns = computed(() => {
  const raw = [...model.value.localeData().weekdaysMin()];
  let i = firstDayOfWeek.value;
  while (i--) raw.push(raw.shift()!);
  return raw;
});

const salaryDay = ref(15);
const budgets = ref([1500]);
</script>

<template>
  <div>
    <form @submit.prevent="">
      <label for="SalaryDay">Salary Day</label>
      <input name="SalaryDay" type="number" v-model.number="salaryDay" />
      <label for="SalaryDay">Monthly Funding</label>
      <input name="MonthlyFunding" type="number" v-model.number="budgets[0]" />
    </form>
  </div>
  <Timeline :today :salaryDay :budgets />
  <div style="width: min(800px, 100%)">
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
  </div>
  <div class="Calendar" style="width: min(800px, 100%)">
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
</template>

<style scoped>
.Calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: var(--air-1);

  > * {
    padding: 10px;
  }

  .columnheader {
    font-size: 75%;
    aspect-ratio: 2;
  }
}
</style>
