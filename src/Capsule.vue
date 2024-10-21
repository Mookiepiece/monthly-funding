<script setup lang="ts">
import { Dayjs } from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{
  today: Dayjs;
  salaryDay: number;
  budgets: number[];
}>();

const [w, h, r] = [300, 150, 25];
const map = { H: h - 2 * r };

const paint = computed(() => {
  const { today, salaryDay } = props;
  const day = today.set('date', 20);

  const days = day.daysInMonth();
  const landmark = day.set('date', Math.min(salaryDay, days));

  const season = (() => {
    const [s, e] = day.isBefore(landmark)
      ? [landmark.subtract(1, 'month'), landmark]
      : [landmark, landmark.add(1, 'month')];

    const len = e.diff(s, 'day');
    return { s, e, len };
  })();

  const capacity =
    (1 / season.e.diff(season.s, 'day')) * season.e.diff(day, 'day');
  const balance = ~~(props.budgets[0] * capacity);

  const halfSpanWidth = w / days / 2;
  const span = halfSpanWidth;

  const todayX = (day.date() - 1) / days;

  const bar = `M ${todayX * w + span} ${r} v ${map.H}`;
  const barDash = `0 ${((1 - capacity) * map.H).toFixed(0)} ${h}`;

  const skew = (() => {
    const [S, E] = [today.startOf('M'), today.endOf('M')];

    const [from, to] = day.isBefore(landmark) ? [S, landmark] : [landmark, E];

    const x = (from.diff(S, 'day') / days) * w + span;
    const len = (to.diff(from, 'day') / days) * w;

    const h2 = day.isBefore(landmark)
      ? (to.diff(S, 'day') / season.len) * map.H
      : (E.diff(from, 'day') / season.len) * map.H;
    const h1 = day.isBefore(landmark) ? map.H - h2 + r : r;

    return `M ${x} ${h1} l ${len} ${h2}`;
  })();

  return { capacity, balance, span, bar, barDash, skew };
});
</script>

<template>
  <div class="Capsule">
    <div class="header clr1">
      <span> [{{ today.format('MMMDD') }}] </span>
      <div class="right">
        <span class="clr2"> {{ (paint.capacity * 100).toFixed(0) }}% </span>
        <span>
          {{
            paint.balance.toLocaleString('en-US', {
              style: 'currency',
              currency: 'JPY',
              currencyDisplay: 'narrowSymbol',
              useGrouping: false,
              minimumFractionDigits: 0,
            })
          }}
        </span>
      </div>
    </div>
    <svg :viewBox="`0 0 ${w} ${h}`">
      <path
        :d="paint.skew"
        stroke="#f32"
        stroke-width="1"
        stroke-dasharray="6 4"
      />
      <path :d="paint.bar" fill="none" stroke="#78a6" stroke-width="3" />
      <path
        :d="paint.bar"
        stroke="#f32"
        stroke-width="3"
        :stroke-dasharray="paint.barDash"
      />
    </svg>
  </div>
</template>

<style scoped>
.Capsule {
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 300px;

}

svg {
  position: relative;
  overflow: hidden;
  display: grid;
  place-content: center;
  width: 300px;
  height: 150px;
  border-radius: 25px;

  background: var(--air-1);
  user-select: none;
}

.header {
  width: 300px;
  display: flex;
  padding-inline: 20px;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  transform: translateY(22px);
  z-index: 1;
}

.right {
  margin-left: auto;
  display: flex;
  gap: 10px;
}
</style>
