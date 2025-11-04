// 定义了两个工具方法
const tools = {
  /** 两数求和 */
  sumNum({ a, b }: { a: number, b: number }) {
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
  formatNumber({ num }: { num: number }) {
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

// 定义了 mcp 客户端连接服务器的方法
function initialize() {
  return {
    // 定义使用的 mcp 协议版本
    protocolVersion: '2024-11-05',
    // 该字段定义了 mcp 服务器支持的功能
    capabilities: {
      // 提示词功能
      prompts: {
        listChanged: true,
      },
      // 资源功能
      resources: {
        subscribe: true,
        listChanged: true,
      },
      // 工具功能
      tools: {
        listChanged: true,
      },
    },
    // 服务端信息（用于在 mcp 客户端中显示）
    serverInfo: {
      name: 'by-native-server',
      title: '原生 MCP 服务端',
      version: '1.0.0',
    },
    // 可选的扩展信息
    instructions: 'Optional instructions for the client',
  }
}


// 定义了获取工具列表的方法
function getTools() {
  return {
    // 返回支持的工具列表
    tools: [
      {
        name: 'sumNum', // 工具的唯一标识，后续 mcp 客户端调用工具的时候就是使用这个字段
        title: '两数求和', // 用于展示在 mcp 客户端的工具名称
        description: '提供两个数字，返回这两个数字的和', // LLM 是否使用工具的关键，就是看该字段的描述与用户的提问是否匹配
        // 定义工具方法的参数要求
        inputSchema: {
          type: 'object',
          properties: {
            a: {
              type: 'number',
              description: '第一个数',
            },
            b: {
              type: 'number',
              description: '第二个数',
            },
          },
          required: ['a', 'b'],
        },
      },
      {
        name: 'formatNumber',
        title: '格式化数字',
        description: '提供一个数字，返回这个数字的格式化结果，格式化逻辑：小数部分保留两位，整数部分每隔三位添加一个逗号',
        inputSchema: {
          type: 'object',
          properties: {
            num: {
              type: 'number',
              description: '文件名',
            },
          },
          required: ['num'],
        },
      },
    ],
  }
}

process.stdin.on('data', (data) => {
  const req = JSON.parse(data.toString())
  let result: any
  switch (req.method) {
    case 'initialize':
      // 建立连接
      result = initialize()
      break
    case 'tools/list':
      // 获取 mcp 服务器的工具
      result = getTools()
      break
    case 'tools/call':
      result = tools[req.params.name as keyof typeof tools](req.params.arguments)
      // 工具调用
      break
    default:
      throw new Error(`暂不支持的方法: ${req.method}`)
  }

  const res = {
    jsonrpc: req.jsonrpc,
    id: req.id,
    result,
  }

  process.stdout.write(JSON.stringify(res) + '\n')
})