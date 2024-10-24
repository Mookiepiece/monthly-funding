<script setup lang="ts">
import { Dayjs } from 'dayjs';
import { computed } from 'vue';

const props = defineProps<{
  today: Dayjs;
  salaryDay: number;
  budgets: number[];
}>();

// w: width of the capsule, h: height of the capsule, r: radius of the capsule
const [w, h, r] = [300, 150, 40];
// map: the draw area
const map = { H: h - 2 * r };

const paint = computed(() => {
  const { today, salaryDay } = props;
  const day = today;

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
  const balance = Number.parseInt('' + props.budgets[0] * capacity);

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
    <div class="header clr-1">
      <span> [{{ today.format('MMMDD') }}] </span>
      <div class="right">
        <span class="clr-2"> {{ (paint.capacity * 100).toFixed(0) }}% </span>
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
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
  width: 300px;

  user-select: none;
}

svg {
  position: relative;
  overflow: hidden;
  display: grid;
  place-content: center;
  /* NOTE: 40px - 15px = 25px */
  top: 15px;
  width: 300px;
  height: 150px;
  border-radius: 25px;
}

.header {
  position: absolute;
  top: 18px;
  left: 0;
  right: 0;
  display: flex;
  padding-inline: 12px;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  z-index: 1;
}

.right {
  margin-left: auto;
  display: flex;
  gap: 10px;
}
</style>
