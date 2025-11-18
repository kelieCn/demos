import './public-path'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App.tsx'
import CardList from './CardList.tsx'
import CardDetail from './CardDetail.tsx'

let app: Root | null = null

function render() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        Component: App,
        children: [
          { index: true, Component: CardList },
          { path: '/detail/:index', Component: CardDetail },
        ],
      },
    ],
    {
      basename: window.__MICRO_APP_ENVIRONMENT__ ? window.__MICRO_APP_BASE_ROUTE__ : '/',
    },
  )
  app = createRoot(document.querySelector('#react-app')!)
  app.render(<RouterProvider router={router} />)
}

// 独立运行时
if (!window.__MICRO_APP_ENVIRONMENT__) {
  render()
}

export function mount() {
  console.log('react 子应用 mount 生命周期被调用')
  render()
}

export function unmount() {
  console.log('react 子应用 unmount 生命周期被调用')
  if (app) {
    app.unmount()
    app = null
  }
}