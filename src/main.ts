import { createApp } from 'vue';

import { useDark } from '@vueuse/core';
useDark();

import Main from './Main.vue';
import './style.css';
createApp(Main).mount('#app');
