/// <reference lib="webworker" />

// 声明 SharedWorker 的全局作用域类型
declare const self: SharedWorkerGlobalScope

// 存储连接的端口
const ports: MessagePort[] = []

// 监听新的连接
self.addEventListener('connect', (event) => {
  const port = event.ports[0]
  if (!port) return
  ports.push(port)

  // 监听来自主线程的消息
  port.addEventListener('message', e => {
    ports.forEach(p => {
      if (p === port) return
      p.postMessage(e.data)
    })
  })

  // 启动端口
  port.start()
})

// 错误处理
self.addEventListener('error', (error: ErrorEvent) => {
  console.error('Shared Worker 错误:', error)
})