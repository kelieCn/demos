import type { FastifyReply } from 'fastify'
import Fastify from 'fastify'
import FastifyStatic from '@fastify/static'
import chokidar from 'chokidar'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 创建 SSE 服务器
const fastify = Fastify()
const clients = new Set<FastifyReply>()
fastify.get('/sse', (req, res) => {
  res.raw.setHeader('Cache-Control', 'no-cache')
  res.raw.setHeader('Connection', 'keep-alive')
  res.raw.setHeader('Content-Type', 'text/event-stream')
  res.raw.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001')
  res.raw.setHeader('Access-Control-Allow-Credentials', 'true')

  // 发送已连接的事件
  res.raw.write('event: connected\n')
  res.raw.write('data: 你已经连接上SSE服务器\n\n')
  clients.add(res)

  // 监听客户端断开连接
  req.raw.on('close', () => {
    clients.delete(res)
    console.log('客户端断开连接，当前总数:', clients.size)
  })

  // 保持连接打开，不要让 Fastify 自动关闭响应，通过返回 res，告诉 Fastify 我们手动管理响应
  return res
})
fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('SSE服务器已启动: http://localhost:3000')
})

// 监听文件夹内的文件的变更，通过 SSE 的方式通知客户端
chokidar.watch(join(__dirname, './watched'), {
  ignoreInitial: true,
}).on('all', (event, path) => {
  const payload = JSON.stringify({
    event,
    path,
    time: Date.now(),
  })
  clients.forEach(client => {
    client.raw.write('event: resource_changed\n')
    client.raw.write(`data: ${payload}\n\n`)
  })
})

// 创建静态资源服务器
const staticFastify = Fastify()
staticFastify.register(FastifyStatic, {
  root: join(__dirname, 'public'),
})
staticFastify.listen({ port: 3001 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log('静态资源服务器已启动，请访问: http://localhost:3001/index.html')
})