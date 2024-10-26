import { computed, reactive, ref } from 'vue';
import ja from 'dayjs/locale/ja';
import { App } from './App';

const p = ref<Promise<any> | null>(null);
const setLocale = (lo: string) => {
  switch (lo) {
    case 'zh':
      p.value = import('dayjs/locale/zh')
        .then(zh => (App.today = App.today.locale(zh.default)))
        .finally(() => (p.value = null));
      break;
    case 'en':
      p.value = import('dayjs/locale/en')
        .then(en => (App.today = App.today.locale(en.default)))
        .finally(() => (p.value = null));
      break;
    case 'ja':
      App.today = App.today.locale(ja);
      break;
  }
};

export const localeUtils = reactive({
  setLocale,
  loading: computed(() => !!p.value),
});
