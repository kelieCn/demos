import './public-path'
import type { Root } from 'react-dom/client'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import App from './App.tsx'
import CardList from './CardList.tsx'
import CardDetail from './CardDetail.tsx'

let app: Root | null = null

function render(props: { container?: Element } = {}) {
  const { container } = props
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
      basename: window.__POWERED_BY_QIANKUN__ ? '/react' : '/',
    },
  )
  app = createRoot(
    container ? container.querySelector('#react-app')! : document.querySelector('#react-app')!,
  )
  app.render(<RouterProvider router={router} />)
}

// 独立运行时
if (!window.__POWERED_BY_QIANKUN__) {
  render()
}

export async function bootstrap() {
  console.log('[react] react app bootstraped')
}

export async function mount(props: any) {
  console.log('[react] props from main framework', props)
  render(props)
}

export async function unmount() {
  if (app) {
    app.unmount()
    app = null
  }
}