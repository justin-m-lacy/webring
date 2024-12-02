import App from '@/App.vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import './index.css';

const app = createApp(App);

app.use(createPinia());

app.mount('#app');