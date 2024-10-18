<script setup lang="ts">
import { Dayjs } from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{
  month: Dayjs;
  today: Dayjs;
  cell: number;
  salaryDay: number;
  budgets: number[];
}>();

const day = computed(() => props.month.set('date', props.cell));

const remain = computed(() => {
  const { month: $month, salaryDay } = props;

  const landmark = $month.set(
    'date',
    Math.min(salaryDay, $month.daysInMonth()),
  );

  const [start, end] = day.value.isBefore(landmark)
    ? [landmark.subtract(1, 'month'), landmark]
    : [landmark, landmark.add(1, 'month')];

  const diff = end.diff(start, 'day');
  const remainDays = end.diff(day.value, 'day');

  const remain = (props.budgets[0] / diff) * remainDays;

  return remain.toFixed(0);
});
</script>

<template>
  <div :data-day="cell" :data-today="day.isSame(today, 'date') || undefined">
    {{ cell || '' }}

    <span class="Remain"> {{ remain }} </span>
  </div>
</template>
<style scoped>
[data-day='0'] {
  opacity: 0;
}
[data-today] {
  background: #f1f1f1;
  box-shadow: inset 0 0 0 2px wheat;
}

.Remain {
  font-size: 12px;
}
</style>
