interface Window {
  // micro-app 特有的变量声明
  __MICRO_APP_ENVIRONMENT__: boolean | undefined
  __MICRO_APP_PUBLIC_PATH__: string
  __MICRO_APP_BASE_ROUTE__?: string
}

// Webpack 全局变量声明
declare let __webpack_public_path__: string

declare module '*.module.scss' {
  const classes: { [key: string]: string }
  export default classes
}