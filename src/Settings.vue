<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dynamic, { useDynamic } from './Dynamic.vue';
import TIcon from './TIcon.vue';
import VButton from './VButton.vue';
import { forwardRef } from './utils/forwardRef';
import { bagEffect, on } from './utils';
import { App } from './App';
import { localeUtils } from './localeUtils';
import VNumber from './VNumber.vue';
import VSegmented from './VSegmented.vue';

const dynamic = useDynamic();

const idle = ref();
const activated = ref();

const island = ref();
const islandEl = forwardRef(island);

const open = ref(App.fresh);

if (App.fresh) watch(open, () => (App.fresh = false));

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

const salaryDay = computed<number | null>({
  get: () => App.salaryDay,
  set: v => (App.salaryDay = v ?? 1),
});
const budget = computed<number | null>({
  get: () => App.budgets[0],
  set: v => (App.budgets = [v ?? 1]),
});
const localeValue = computed({
  get: () => App.today.locale(),
  set: v => {
    localeUtils.setLocale(v);
    App.today = App.today.locale(v);
  },
});
</script>

<template>
  <Dynamic :dynamic ref="island">
    <div v-if="visibleA" ref="idle" class="SettingsDynamicItem">
      <VButton @click="open = true" class="opaque">
        <TIcon i="setting-1" />
      </VButton>
    </div>

    <div
      v-if="visibleB"
      class="SettingsDynamicItem SettingsFormWrap"
      @keydown.esc.exact.prevent="open = false"
      ref="activated"
    >
      <div>
        <VButton
          tabindex="-1"
          style="margin-bottom: 10px"
          data-close
          @click="open = false"
        >
          <TIcon i="chevron-left" />
        </VButton>
      </div>
      <form @submit.prevent="open = false">
        <label for="SalaryDay">Salary Day</label>
        <VNumber
          name="SalaryDay"
          id="SalaryDay"
          min="1"
          max="31"
          v-model="salaryDay"
        />
        <label for="MonthlyAllowance">Monthly Allowance</label>
        <VNumber
          name="MonthlyAllowance"
          id="MonthlyAllowance"
          min="1"
          max="1000000"
          v-model="budget"
        />
        <span>Sign</span>
        <div>
          <VSegmented v-model="App.sign" :options="['¥', '$']" />
        </div>
        <span>Date Locale</span>
        <div>
          <VSegmented v-model="localeValue" :options="['ja', 'en', 'zh']" />
        </div>
        <button type="submit" tabindex="-1"></button>
      </form>
    </div>
  </Dynamic>
</template>

<style scoped>
.SettingsFormWrap {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
}

form {
  width: 300px;
  display: grid;
  grid: auto auto / 110px 1fr;
  align-items: center;
  gap: 5px 5px;
  font-size: 12px;

  [type='submit'] {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    clip-path: circle(0);
  }
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
