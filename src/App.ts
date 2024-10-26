import { reactive, toRef } from 'vue';
import { useStorage } from '@vueuse/core';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);
import ja from 'dayjs/locale/ja';
dayjs.locale(ja);

const app = useStorage<{
  salaryDay: number;
  budgets: number[];
  sign: string;
}>('app', {
  salaryDay: 15,
  budgets: [1500],
  sign: '¥',
});

export const App = reactive({
  today: dayjs(),
  salaryDay: toRef(app.value, 'salaryDay'),
  budgets: toRef(app.value, 'budgets'),
  sign: toRef(app.value, 'sign'),
});
