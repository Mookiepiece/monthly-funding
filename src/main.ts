import { createApp } from 'vue';
import { useDark } from '@vueuse/core';
import './style.css';
import App from './App.vue';

useDark();
createApp(App).mount('#app');
