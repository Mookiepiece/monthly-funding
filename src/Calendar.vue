<script setup lang="ts">
import { computed, ref, Ref } from 'vue';
import { Dayjs } from 'dayjs';
import VButton from './VButton.vue';
import TIcon from './TIcon.vue';
import { App } from './App';

const model = ref(App.today);

const firstDayOfWeek = computed(() =>
  model.value.localeData().firstDayOfWeek(),
);
const columns = computed(() => {
  const raw = [...model.value.localeData().weekdaysMin()];
  let i = firstDayOfWeek.value;
  while (i--) raw.push(raw.shift()!);
  return raw.map((label, index) => ({
    label,
    value: (index + firstDayOfWeek.value) % 7,
  }));
});

const useCells = (_today: Ref<Dayjs>) =>
  computed<
    (
      | {
          day: Dayjs;
          remain: string;
        }
      | 0
    )[]
  >(() => {
    const today = _today.value;

    const firstDayOfWeek = today.localeData().firstDayOfWeek();
    const days = today.daysInMonth();
    const day = today.startOf('M').day();

    const prepend = Array((day - firstDayOfWeek + 7) % 7).fill(0);
    const _cells = Array(days)
      .fill(0)
      .map((_, i) => i + 1);
    const append = Array(42 - prepend.length - _cells.length).fill(0);

    const $month = model.value;
    const landmark = $month.set(
      'date',
      Math.min(App.salaryDay, $month.daysInMonth()),
    );

    const cells = _cells.map(i => {
      const day = $month.set('date', i);
      const [start, end] = day.isBefore(landmark)
        ? [landmark.subtract(1, 'month'), landmark]
        : [landmark, landmark.add(1, 'month')];

      const [diff, remainDays] = [end.diff(start, 'day'), end.diff(day, 'day')];
      const remain = Number.parseInt('' + (App.budgets[0] / diff) * remainDays);
      return { day, remain };
    });

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
  <section class="Calendar">
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
      <div class="columnheader" v-for="i in columns" :data-weekday="i.value">
        {{ i.label }}
      </div>

      <template v-for="cell in cells" :data-day="cell">
        <div v-if="cell === 0" data-day="0"></div>
        <div
          v-else
          :data-today="cell.day.isSame(App.today, 'date') || undefined"
        >
          {{ cell.day.date() }}<span class="Remain">{{ cell.remain }}</span>
        </div>
      </template>
    </div>
  </section>
</template>

<style>
.Calendar {
  padding: 15px 20px;
  width: 800px;
  user-select: none;

  header {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  :where(.grid) {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  [data-weekday='6'],
  [data-weekday='0'] {
    opacity: 0.5;
  }

  [data-day='0'] {
    opacity: 0;
  }
  [data-today] {
    background: var(--air-0);
    box-shadow: inset 0 0 0 2px wheat;
  }
}

@media (min-width: 1000px) {
  .Calendar {
    .grid {
      > * {
        padding: 10px 10px 0;
        height: 50px;
      }
    }

    .columnheader {
      font-size: 75%;
      height: 35px;
    }

    .Remain {
      margin-inline: 5px;
      font-size: 12px;
    }
  }
}

@media not (min-width: 1000px), not (min-height: 700px) {
  .Calendar {
    width: 360px;

    .grid {
      grid-template-rows: 20px repeat(6, 36px);

      font-size: 12px;

      > * {
        padding: 2px;
        color: var(--text-2);
      }
      .Remain {
        display: block;
        color: var(--text-1);
      }
    }
  }
}

@media not (min-width: 700px) {
  .Calendar {
    padding: 15px 10px;
    .grid {
      font-size: 11px;
    }
  }
}
</style>
