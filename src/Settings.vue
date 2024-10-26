<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dynamic, { useDynamic } from './Dynamic.vue';
import TIcon from './TIcon.vue';
import VButton from './VButton.vue';
import { forwardRef } from './utils/forwardRef';
import { bagEffect, on } from './utils';
import { App } from './App';
import { localeUtils } from './localeUtils';

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

const salaryDay = computed({
  get: () => App.salaryDay,
  set: v => (App.salaryDay = Math.max(1, Math.min(31, v ?? 0))),
});
const budget = computed({
  get: () => App.budgets[0],
  set: v => (App.budgets = [Math.max(1, Math.min(10 ** 10, v ?? 0))]),
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
        <input
          name="SalaryDay"
          id="SalaryDay"
          type="number"
          min="1"
          max="31"
          v-model="salaryDay"
        />
        <label for="MonthlyAllowance">Monthly Allowance</label>
        <input
          name="MonthlyAllowance"
          id="MonthlyAllowance"
          type="number"
          v-model="budget"
        />
        <label for="Sign">Sign</label>
        <div>
          <!-- prettier-ignore -->
          <label><input v-model="App.sign" type="radio" id="Sign" name="Sign" value="¥" />¥</label>
          <!-- prettier-ignore -->
          <label><input v-model="App.sign" type="radio" name="Sign" value="$" />$</label>
        </div>
        <label for="Locale">Date Locale</label>
        <div>
          <!-- prettier-ignore -->
          <label><input v-model="localeValue" type="radio" id="Locale" name="Locale" value="ja" />ja</label>
          <!-- prettier-ignore -->
          <label><input v-model="localeValue" type="radio" name="Locale" value="en" />en</label>
          <!-- prettier-ignore -->
          <label><input v-model="localeValue" type="radio" name="Locale" value="zh" />zh</label>
        </div>
        <button type="submit" tabindex="-1"></button>
      </form>
    </div>
  </Dynamic>
</template>

<style scoped>
.SettingsDynamicItem {
  background: var(--air-0);
  border-radius: 20px;
}

.SettingsFormWrap {
  display: flex;
  flex-direction: column;
  padding: 15px 20px;
}

form {
  max-width: 300px;
  display: grid;
  grid: auto auto / 110px 1fr;
  gap: 2px 5px;
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
