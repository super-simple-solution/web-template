import App from './App.vue'
import { router } from '@/router/index'
import '@/styles/index.scss'
import performLoader from './utils/global_main_loader.js'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
performLoader(app)

const beforeEnterApp = () => {
  return Promise.all([])
}

beforeEnterApp().finally(() => {
  app.use(router)
  app.mount('#app')
})
