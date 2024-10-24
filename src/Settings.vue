<script setup lang="ts">
import { computed, ref } from 'vue';
import Dynamic, { useDynamic } from './Dynamic.vue';
import TIcon from './TIcon.vue';
import VButton from './VButton.vue';
import { forwardRef } from './utils/forwardRef';
import { Bag, bagEffect, on } from './utils';
import { AppState } from './App';

const dynamic = useDynamic();

const idle = ref();
const activated = ref();

const island = ref();
const islandEl = forwardRef(island);

const open = ref(false);
const { visible: visibleA } = dynamic.register(
  computed(() => !open.value),
  idle,
  true,
);
const { visible: visibleB } = dynamic.register(open, activated);

bagEffect(bag => {
  const $island: HTMLElement = islandEl.value;
  if (!$island) return;

  if (!open.value) {
    bag(
      on($island).click(e => {
        if (e.target instanceof Element && e.target.closest('[data-close]'))
          return;
        open.value = true;
      }),
    );
  } else {
    bag(
      on(document).click(e => {
        if (e.target instanceof Element && !$island.contains(e.target))
          open.value = false;
      }),
    );
  }
});
</script>

<template>
  <Dynamic :dynamic ref="island">
    <div v-if="visibleA" ref="idle">
      <VButton @click="open = true" class="opaque">
        <TIcon i="setting-1" />
      </VButton>
    </div>

    <div
      v-if="visibleB"
      style="
        background: var(--air-0);
        display: flex;
        padding: 15px 20px;
        flex-direction: column;
      "
      ref="activated"
    >
      <VButton style="margin-bottom: 10px" data-close @click="open = false">
        <TIcon i="chevron-left" />
      </VButton>
      <form @submit.prevent="">
        <label for="SalaryDay">Salary Day</label>
        <input
          name="SalaryDay"
          type="number"
          v-model.number="AppState.salaryDay"
        />
        <label for="MonthlyFunding">Monthly Funding</label>
        <input
          name="MonthlyFunding"
          type="number"
          v-model.number="AppState.budgets[0]"
        />
        <label for="Sign">Sign</label>
        <div>
          <label><input type="radio" name="Sign" value="¥" />¥</label>
          <label><input type="radio" name="Sign" value="$" />$</label>
        </div>
      </form>
    </div>
  </Dynamic>
</template>

<style scoped>
form {
  max-width: 300px;
  display: grid;
  grid: auto auto / 110px 1fr;
  gap: 2px 5px;
  font-size: 12px;
}

.opaque {
  background: transparent;
  &:hover {
    background: var(--air-1);
    filter: brightness(0.98);
  }
  &:active {
    filter: brightness(0.95);
  }
}
</style>
