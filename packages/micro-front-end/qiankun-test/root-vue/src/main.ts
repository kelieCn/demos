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
    entry: '//localhost:3001',
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

start({
  prefetch: false,
  sandbox: {
    // 使用这种方案会给子应用包裹在一个 shadow dom 中，使用时需要明确清楚会不会某些框架对这个功能有影响
    strictStyleIsolation: true,
    // 使用这种方式时，会给子应用所有的样式都加上一个 div[data-qiankun="react app"] xxx 这样的前缀，但是这种方式对于主应用设置的样式仍然有可能会影响到子应用
    // experimentalStyleIsolation: true,
  },
})