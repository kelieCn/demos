import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import microApp from '@micro-zoe/micro-app'
import 'ant-design-vue/dist/reset.css'
import './index.scss'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./Home.vue'),
    },
    {
      path: '/:child(vue|react|vite):other(.*)',
      name: 'Nav',
      component: () => import('./Nav.vue'),
    },
  ],
})

createApp(App).use(router).mount('#app')

microApp.start({
  'router-mode': 'native',
})
