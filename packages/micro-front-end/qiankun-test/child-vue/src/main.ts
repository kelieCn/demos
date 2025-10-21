import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'ant-design-vue/dist/reset.css'
import './index.scss'
import App from './App.vue'

let app: any = null

function render(props: any = {}) {
  const { container } = props
  const router = createRouter({
    history: createWebHistory(),
    routes: [],
  })
  app = createApp(App)
  app.use(router)
  app.mount(container ? container.querySelector('#app') : '#app')
}

// 独立运行时
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('[vue] vue app bootstraped')
}

export async function mount(props: any) {
  console.log('[vue] props from main framework', props)
  render(props)
}

export async function unmount() {
  if (app) {
    app.unmount()
    app = null
  }
}