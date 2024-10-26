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
  fresh: boolean;
}>('app', {
  salaryDay: 15,
  budgets: [1500],
  sign: '¥',
  fresh: true,
});

export const App = reactive({
  today: dayjs(),
  salaryDay: toRef(app.value, 'salaryDay'),
  budgets: toRef(app.value, 'budgets'),
  sign: toRef(app.value, 'sign'),
  fresh: toRef(app.value, 'fresh'),
});
