<script setup lang="ts">
import { Dayjs } from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{
  today: Dayjs;
  salaryDay: number;
}>();

const remain = computed(() => {
  const { today, salaryDay } = props;
  const day = today;

  const landmark = today.set('date', Math.min(salaryDay, today.daysInMonth()));

  const [start, end] = day.isBefore(landmark)
    ? [landmark.subtract(1, 'month'), landmark]
    : [landmark, landmark.add(1, 'month')];

  const diff = end.diff(start, 'day');
  const remainDays = end.diff(day, 'day');

  const remain = (100 / diff) * remainDays;
  return remain.toFixed(0);
});

const useTimeline = () =>
  computed(() => {
    const { today } = props;
    const days = today.daysInMonth();
    const cells = Array(90)
      .fill(0)
      .map((_, i) => today.add(i + 45 - 90, 'day'))

      .map(day => {
        const start = day.date() === 1;
        const end = day.date() === day.daysInMonth();

        const label = day.isSame(today, 'month')
          ? day.format('DD')
          : day.format('MM-DD');

        return {
          day,
          label,
          clsx: {
            start,
            end,
            today: day.isSame(today, 'date'),
          },
        };
      });
    return cells;
  });

const cells = useTimeline();
</script>

<template>
  <div class="Timeline">
    <div class="TimelineInner">
      <div v-for="{ day, label, clsx } in cells" class="cell" :class="clsx">
        {{ label }}
      </div>
    </div>
  </div>
  {{ remain }}
</template>

<style scoped>
.Timeline {
  overflow: hidden;
  display: grid;
  place-content: center;

  user-select: none;
}

.TimelineInner {
  height: 100px;
  outline: 1px solid;

  display: grid;
  grid-auto-columns: 15px;
  grid-auto-flow: column;
}

.cell {
  /* outline: 1px solid pink; */
  border-right: 1px solid pink;
  writing-mode: vertical-lr;
  font-size: 12px;
  line-height: 1;
}

.today {
  font-weight: 600;
}
.end {
  border-right: 2px solid salmon;
}
</style>
