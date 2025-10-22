declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const component: ComponentOptions
  export default component
}

interface Window {
  __POWERED_BY_QIANKUN__: boolean | undefined
}