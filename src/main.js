import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useTravelStore } from './stores/travel'
import './styles/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// 初始化：先从 localStorage 恢复数据，再订阅变更自动持久化
const store = useTravelStore(pinia)
store.load()
store.$subscribe(() => store.persist(), { detached: true })

app.mount('#app')
