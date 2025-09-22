import process from 'node:process'
import cors from '@fastify/cors'
import Fastify from 'fastify'

// 创建 Fastify 实例
const fastify = Fastify({ logger: true })
// 注册 CORS 插件
fastify.register(cors, {
  origin: '*',
})

// CSS 动态生成路由
fastify.get('/css', async (request, reply) => {
  const { time = 0, color = '#ccc' } = request.query as { time?: string, color?: string }
  // 如果指定了延迟时间，则等待相应的毫秒数
  if (time && Number.parseInt(time) > 0) {
    await new Promise(resolve => setTimeout(resolve, Number.parseInt(time)))
  }
  // 设置响应头为 CSS 类型
  reply.type('text/css')

  // 生成动态 CSS 内容
  const css = `
.box1 {
  width: 100px;
  height: 100px;
  background-color: ${color};
}
`
  return css
})

fastify.get('/js', async (request, reply) => {
  const { time = 0 } = request.query as { time?: string }
  if (time && Number.parseInt(time) > 0) {
    await new Promise(resolve => setTimeout(resolve, Number.parseInt(time)))
  }
  reply.type('application/javascript')
  return `
  console.log(111)
`
})

// 启动服务器
async function start() {
  try {
    const port = 3000
    await fastify.listen({ port })
    console.log(`🚀 HTML Render Service is running on http://localhost:${port}`)
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()

// 优雅关闭
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...')
  await fastify.close()
  process.exit(0)
})
process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...')
  await fastify.close()
  process.exit(0)
})
