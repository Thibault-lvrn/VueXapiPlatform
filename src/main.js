import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

export let urlBase = import.meta.env.VITE_API_BASE_URL

app.use(router)

app.mount('#app')
