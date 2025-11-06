import 'dotenv/config'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import path from 'path'
import OpenAI from 'openai'
import type { ChatCompletionFunctionTool, ChatCompletionMessageParam } from 'openai/resources/chat/completions.js'
import type { Interface } from 'readline/promises'
import readline from 'readline/promises'

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error('环境变量 DEEPSEEK_API_KEY 没有设置')
}

class McpClient {
  private openai: OpenAI
  private mcp: Client
  private transport: StdioClientTransport | null = null
  private tools: ChatCompletionFunctionTool[] = []
  private messages: ChatCompletionMessageParam[] = []
  private rl: Interface | null = null

  constructor() {
    this.mcp = new Client({
      name: 'mcp-client',
      version: '1.0.0',
    })
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: process.env.DEEPSEEK_API_KEY,
    })
  }

  /** 连接 mcp 服务器 */
  async connectToServer() {
    try {
      this.transport = new StdioClientTransport({
        command: 'ts-node',
        args: [path.join(path.dirname(''), '../server/by-sdk/server.ts')],
        env: {
          TRANSPORT: 'stdio',
        },
      })
      await this.mcp.connect(this.transport)
  
      const toolsResult = await this.mcp.listTools()
      this.tools = toolsResult.tools.map(tool => ({
        type: 'function',
        function: {
          name: tool.name,
          description: tool.description,
          parameters: tool.inputSchema,
        },
      }))
      console.log(
        '已连接的工具:',
        this.tools.map(({ function: fn }) => fn.name),
      )
    } catch (error: any) {
      console.error('连接 mcp 服务器失败:', error.message)
      throw error
    }
  }

  /** 与大模型对话 */
  async processQuery(input: string) {
    this.messages.push({
      role: 'user',
      content: input,
    })
    const response = await this.openai.chat.completions.create({
      model: 'deepseek-chat',
      messages: this.messages,
      tools: this.tools,
    })
    const message = response.choices[0]?.message
    this.messages.push(message)
    if (message.tool_calls) {
      // 说明是是需要选择工具进行调用
      for (const tool of message.tool_calls) {
        if (tool.type !== 'function') return
        console.log(`\n正在调用工具: ${tool.function.name}，请稍等...`)
        const toolCallRes = await this.mcp.callTool({
          name: tool.function.name,
          arguments: JSON.parse(tool.function.arguments),
        })
        this.messages.push({
          role: 'tool',
          tool_call_id: tool.id,
          content: typeof toolCallRes.content === 'string' ? toolCallRes.content : JSON.stringify(toolCallRes.content),
        })
      }
      const finalResponse = await this.openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: this.messages,
        tools: this.tools,
      })
      const finalMessage = finalResponse.choices[0].message
      this.messages.push(finalMessage)
      return finalMessage.content
    }
    // 说明是正常对话，直接显示回答即可
    return message.content
  }

  /** 创建终端聊天窗口 */
  async chatLoop() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    try {
      console.log('MCP Client已经成功启动，输入 quit 退出聊天，输入 clear 清除聊天历史')
      while (true) {
        const input = await this.rl.question('\n请输入您的问题: ')
        if (input.toLowerCase() === 'quit') {
          break
        }
        if (input.toLowerCase() === 'clear') {
          this.clearMessages()
          console.log('\n历史会话记录已清除。')
        } else {
          const response = await this.processQuery(input)
          console.log(`\n回复: --------------------\n${response}`)
        }
      }
    } finally {
      this.rl.close()
    }
  }

  /** 清空消息记录 */
  clearMessages() {
    this.messages = []
  }

  /** 关闭连接 */
  async closeConnection() {
    await this.mcp.close()
  }
}

const mcpClient = new McpClient()

try {
  await mcpClient.connectToServer()
  await mcpClient.chatLoop()
} finally {
  await mcpClient.closeConnection()
  process.exit(0)
}
