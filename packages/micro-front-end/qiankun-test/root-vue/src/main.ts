import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { registerMicroApps, start } from 'qiankun'
import 'ant-design-vue/dist/reset.css'
import './index.scss'
import App from './App.vue'


const router = createRouter({
  history: createWebHistory(),
  routes: [],
})

createApp(App).use(router).mount('#app')

registerMicroApps([
  {
    name: 'vue app',
    entry: '//localhost:3001/src/main.ts',
    container: '#child-container',
    activeRule: '/vue',
  },
  {
    name: 'react app',
    entry: '//localhost:3002',
    container: '#child-container',
    activeRule: '/react',
  },
])

start()