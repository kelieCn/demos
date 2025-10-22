declare module '*.vue' {
  import type { ComponentOptions } from 'vue'

  const component: ComponentOptions
  export default component
}

interface Window {
  // qiankun 特有的变量声明
  __POWERED_BY_QIANKUN__: boolean | undefined
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string
}

// Webpack 全局变量声明
declare let __webpack_public_path__: string