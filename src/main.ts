import { createApp } from 'vue';
import { useDark } from '@vueuse/core';
import './style.css';
import Main from './Main.vue';

import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import ja from 'dayjs/locale/ja';
dayjs.extend(localeData);
dayjs.locale(ja);

useDark();
createApp(Main).mount('#app');
