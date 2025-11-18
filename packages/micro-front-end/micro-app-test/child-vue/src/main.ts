import './public-path'
import type { App as VueApp } from 'vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'

let app: VueApp<Element> | null = null

function render() {
  const router = createRouter({
    history: createWebHistory(
      window.__MICRO_APP_ENVIRONMENT__ ? window.__MICRO_APP_BASE_ROUTE__ : '/',
    ),
    routes: [
      {
        path: '',
        name: 'CardList',
        component: () => import('./CardList.vue'),
      },
      {
        path: '/detail/:index',
        name: 'CardDetail',
        component: () => import('./CardDetail.vue'),
      },
    ],
  })
  app = createApp(App)
  app.use(router)
  app.mount('#vue-app')
}

// 独立运行时
if (!window.__MICRO_APP_ENVIRONMENT__) {
  render()
}

export function mount() {
  console.log('vue 子应用 mount 生命周期被调用')
  render()
}
export function unmount() {
  console.log('vue 子应用 unmount 生命周期被调用')
  if (app) {
    app.unmount()
    app = null
  }
}
