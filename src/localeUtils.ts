import { computed, reactive, ref } from 'vue';
import ja from 'dayjs/locale/ja';
import zh from 'dayjs/locale/zh';
import en from 'dayjs/locale/en';
import { App } from './App';

const p = ref<Promise<any> | null>(null);
const setLocale = (lo: string) => {
  switch (lo) {
    case 'zh':
      App.locale = lo;
      App.today = App.today.locale(zh);
      break;
    case 'en':
      App.locale = lo;
      App.today = App.today.locale(en);
      break;
    case 'ja':
      App.locale = lo;
      App.today = App.today.locale(ja);
      break;
  }
};

export const localeUtils = reactive({
  setLocale,
  loading: computed(() => !!p.value),
});
