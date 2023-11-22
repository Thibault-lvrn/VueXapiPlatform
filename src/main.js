import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

export let urlBase = "http://localhost:8088/WRA506/index.php"

app.use(router)

app.mount('#app')
