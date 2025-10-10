/// <reference lib="webworker" />

// 声明 ServiceWorker 的全局作用域类型
declare const self: ServiceWorkerGlobalScope

self.addEventListener('message', event => {
  event.waitUntil(self.clients.matchAll().then(clients => {
    if (!clients.length) return
    clients.forEach(client => {
      client.postMessage(event.data)
    })
  }))
})