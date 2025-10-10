abstract class MessageMode {
  /** 发送消息 */
  abstract sendMessage(message: any): void

  /** 接收消息 */
  abstract receiveMessage(cb: (event: any) => void): void

  /** 销毁 */
  abstract destroy(): void
}

/** 本地存储模式 */
class LocalStorageMessageMode extends MessageMode {

  private key = 'localStorage-test'

  private listener: ((e: StorageEvent) => void) | undefined

  sendMessage(message: any) {
    localStorage.setItem(this.key, typeof message === 'string' ? message : JSON.stringify(message))
  }

  receiveMessage(cb: (data: string) => void) {
    this.listener = (e: StorageEvent) => {
      // e.newValue === null 表示的含义就是被删除（包括控制台手动删除和调用 localStorage.removeItem 的情况）
      if (e.key !== this.key || e.newValue === null) return
      cb(e.newValue)
      // 由于 storage 事件只会在对应的 key 数据变化的时候才会触发，如果重复发送同样的消息，后发的消息并不会被监听到，所以每次监听到消息后都需要清除 key 对应的值
      localStorage.removeItem(this.key)
    }
    window.addEventListener('storage', this.listener)
  }

  destroy() {
    if (this.listener) {
      window.removeEventListener('storage', this.listener)
    }
    this.listener = undefined
    localStorage.removeItem(this.key)
  }
}

/** 广播模式 */
class BroadcastChannelMessageMode extends MessageMode {

  private broadcastChannel: BroadcastChannel

  constructor() {
    super()
    this.broadcastChannel = new BroadcastChannel('broadcastChannel-test')
  }

  sendMessage(message: any) {
    this.broadcastChannel.postMessage(message)
  }

  receiveMessage(cb: (event: any) => void) {
    this.broadcastChannel.addEventListener('message', e => cb(e.data))
  }

  destroy() {
    this.broadcastChannel.close()
  }
}

/** 共享工作线程模式 */
class SharedWorkerMessageMode extends MessageMode {

  private sharedWorker: SharedWorker

  constructor() {
    super()
    this.sharedWorker = new SharedWorker(new URL('./shared-worker.ts', import.meta.url))
  }

  sendMessage(message: any) {
    this.sharedWorker.port.postMessage(message)
  }

  receiveMessage(cb: (data: any) => void) {
    this.sharedWorker.port.addEventListener('message', e => cb(e.data))
    this.sharedWorker.port.start()
  }

  destroy() {
    this.sharedWorker.port.close()
  }
}

/** 服务工作线程模式 */
class ServiceWorkerMessageMode extends MessageMode {

  constructor() {
    super()
    navigator.serviceWorker.register(new URL('../service-worker.ts', import.meta.url), { scope: '/' })
  }

  sendMessage(message: any) {
    navigator.serviceWorker.controller?.postMessage(message)
  }

  receiveMessage(cb: (data: any) => void) {
    navigator.serviceWorker.addEventListener('message', e => cb(e.data))
  }

  destroy() {
    navigator.serviceWorker.getRegistration().then(registration => {
      registration?.unregister()
    })
  }
}

export {
  LocalStorageMessageMode,
  BroadcastChannelMessageMode,
  SharedWorkerMessageMode,
  ServiceWorkerMessageMode,
}

export type {
  MessageMode,
}
