import './public-path'
import type { App as VueApp } from 'vue'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import 'ant-design-vue/dist/reset.css'
import App from './App.vue'

let app: VueApp<Element> | null = null

function render(props: { container?: Element } = {}) {
  const { container } = props
  const router = createRouter({
    history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? '/vue' : '/'),
    routes: [
      {
        path: '/',
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
  app.mount(container ? container.querySelector('#vue-app')! : '#vue-app')
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
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