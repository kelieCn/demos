import type { CallToolResult } from '@modelcontextprotocol/sdk/types'
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'
import path from 'path'
import fs from 'fs'

// 定义了两个工具方法
const tools = {
  /** 两数求和 */
  sumNum({ a, b }: { a: number, b: number }): CallToolResult {
    return {
      content: [
        {
          type: 'text',
          text: `两数之和为: ${a + b}`,
        },
      ],
    }
  },
  /** 格式化数字，小数部分保留两位，整数部分每隔三位添加一个逗号 */
  formatNumber({ num }: { num: number }): CallToolResult {
    return {
      content: [
        {
          type: 'text',
          text: num.toLocaleString(undefined, { maximumFractionDigits: 2 }),
        },
      ],
    }
  },
}

export function createMcpServer() {
  const mcpServer = new McpServer(
    {
      name: 'by-sdk-server',
      title: 'SDK MCP 服务端',
      version: '1.0.0',
    },
    {
      capabilities: { tools: {}, resources: {}, prompts: {} },
    },
  )
  
  // 注册工具
  mcpServer.registerTool(
    'sumNum', 
    {
      title: '两数求和',
      description: '提供两个数字，返回这两个数字的和',
      inputSchema: {
        a: z.number().describe('第一个数'),
        b: z.number().describe('第二个数'),
      },
    },
    (data) => tools.sumNum(data),
  )
  mcpServer.registerTool(
    'formatNumber',
    {
      title: '格式化数字',
      description: '提供一个数字，返回这个数字的格式化结果，格式化逻辑：小数部分保留两位，整数部分每隔三位添加一个逗号',
      inputSchema: {
        num: z.number().describe('需要格式化的数字'),
      },
    },
    (data) => tools.formatNumber(data),
  )
  
  // 注册资源
  // 静态文本资源（这里可以去读取文件等其他操作，这里简化过程直接返回一个文本）
  mcpServer.registerResource(
    'readAncientPoetry',
    'ancientpoetry://read',
    {
      title: '读取古诗内容',
      description: '读取古诗内容',
      mimeType: 'text/plain',
    },
    (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
        },
      ],
    }),
  )
  // 静态二进制资源
  mcpServer.registerResource(
    'getPicture',
    'picture://avatar1',
    {
      title: '获取头像图片',
      description: '获取头像图片',
      mimeType: 'image/png',
    },
    (uri) => {
      const filePath = path.join(process.cwd(), 'avatar1.png')
      return {
        contents: [
          {
            uri: uri.href,
            blob: fs.readFileSync(filePath).toString('base64'),
          },
        ],
      }
    },
  )
  // 动态资源
  mcpServer.registerResource(
    'readScript',
    new ResourceTemplate('script://read/{scriptName}', { list: undefined }),
    {
      title: '读取脚本内容',
      description: '读取脚本内容',
      mimeType: 'text/plain',
    },
    (uri, { scriptName }) => ({
      contents: [
        {
          uri: uri.href,
          text: `scriptName: ${scriptName}`,
        },
      ],
    }),
  )
  
  // 注册提示词
  mcpServer.registerPrompt(
    'initPrompt',
    {
      title: '初始化提示词',
      description: '初始化提示词',
      argsSchema: {
        code: z.string().describe('代码片段'),
      },
    },
    (data) => ({
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `你是一个代码解释器，请根据以下代码片段进行解释：${data.code}`,
          },
        },
      ],
    }),
  )

  return mcpServer
}
