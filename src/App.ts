import { reactive, toRef } from 'vue';
import { useStorage } from '@vueuse/core';
import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';
import zh from 'dayjs/locale/zh';
import en from 'dayjs/locale/en';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

const app = useStorage<{
  salaryDay: number;
  budgets: number[];
  sign: string;
  fresh: boolean;
  locale: string;
}>('app', {
  salaryDay: 15,
  budgets: [1500],
  sign: '¥',
  fresh: true,
  locale: 'ja',
});

if (app.value.locale == 'en') dayjs.locale(en);
else if (app.value.locale == 'zh') dayjs.locale(zh);
else dayjs.locale(ja);  

export const App = reactive({
  today: dayjs(),
  salaryDay: toRef(app.value, 'salaryDay'),
  budgets: toRef(app.value, 'budgets'),
  sign: toRef(app.value, 'sign'),
  fresh: toRef(app.value, 'fresh'),
  locale: toRef(app.value, 'locale'),
});
