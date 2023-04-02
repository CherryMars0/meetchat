import App from './App.vue'
import store from './store/index'
import { createApp } from 'vue'
import "./assets/css/public.scss"
import router from './router'
import 'animate.css/animate.min.css'

const app = createApp(App).use(router)
app.use(store)
app.mount('#app')