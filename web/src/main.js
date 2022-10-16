import Vue from '@vue/compat';
import { createApp, configureCompat } from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import Airtable from './plugins/airtable';
import '@mdi/font/css/materialdesignicons.css';
import i18n from './i18n/i18n';

import '@/styles/main.scss';

// Creation of the bus for emitting events from children to non-parent components
window.bus = new Vue();

// disable async component compat - vuetify breaks if enabled
configureCompat({
   COMPONENT_ASYNC: false,
   //ATTR_FALSE_VALUE: false,
})


const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(Airtable)
app.use(i18n)
app.mount('#app')
