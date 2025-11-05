import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js'
import express from 'express'
import cors from 'cors'
import { randomUUID } from 'crypto'
import { createMcpServer } from './mcpServer.ts'

if (process.env.TRANSPORT === 'stdio') {
  // 使用 stdio 通信方式
  const mcpServer = createMcpServer()
  const transport = new StdioServerTransport()
  mcpServer.connect(transport)
} else {
  // 使用 streamableHttp 通信方式
  const app = express()
  app.use(cors({
    origin: '*',
    exposedHeaders: ['mcp-Session-Id'],
    allowedHeaders: ['Content-Type', 'mcp-Session-Id'],
  }), express.json())
  const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {}

  app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined
    let transport: StreamableHTTPServerTransport
    if (sessionId && transports[sessionId]) {
      // 如果有 sessionId 说明已经连接过了，直接处理请求即可
      transport = transports[sessionId]
    } else if (!sessionId && isInitializeRequest(req.body)) {
      // 如果没有 sessionId 但是当前是连接请求，则建立连接
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: sessionId => {
          transports[sessionId] = transport
        },
      })
      transport.close = async () => {
        if (!transport.sessionId) return
        delete transports[transport.sessionId]
      }
      const mcpServer = createMcpServer()
      mcpServer.connect(transport)
    } else {
      // 没有 sessionId，且不是连接请求，则直接报错即可
      res.status(400).json({
        error: '未知请求',
        message: 'Invalid request',
      }).send('Invalid request')
      return
    }
    transport.handleRequest(req, res, req.body)
  })

  app.get('/mcp', (req, res) => {
    res.status(405).setHeader('Allow', 'POST').send('Method Not Allowed')
  })

  await app.listen({ port: 3000 })
  console.log('🚀 Mcp Service is running on http://localhost:3000')
}
