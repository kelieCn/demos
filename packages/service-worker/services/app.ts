import process from 'node:process'
import Fastify from 'fastify'

const fastify = Fastify({ logger: true })

fastify.get('/', async () => {
  return { hello: 'world' }
})

async function start() {
  try {
    const port = 3000
    await fastify.listen({ port })
    fastify.log.info(`server is running on port http://localhost:${port}`)
  }
  catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
