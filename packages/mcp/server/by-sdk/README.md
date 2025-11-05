# 测试方法

## 基于 stdio 通信方式
1. cd 到当前目录下；
2. 使用 `nlx @modelcontextprotocol/inspector` 开启调试工具；
3. 在调试工具左侧的 Transport Type 中选择 `STDIO`，Command 中输入 `ts-node`，在 Arguments 中输入 `server.ts`，在 Environment Variables 中添加一个环境变量 `TRANSPORT=stdio`；
4. 点击调试页面左下方的 Connect 按钮进行连接，至此基于 stdio 通信方式的 mcp 服务器就启动成功了；

## 基于 streamableHttp 通信方式
1. cd 到当前目录下；
2. 开启一个终端执行 `pnpm run dev:streamableHttp` 启动 http 服务器；
3. 在另一个终端执行 `nlx @modelcontextprotocol/inspector` 开启调试工具；
4. 在调试工具左侧的 Transport Type 中选择 `Streamable HTTP`，URL 中输入 `http://localhost:3000/mcp`；
5. 点击调试页面左下方的 Connect 按钮进行连接，至此基于 streamableHttp 通信方式的 mcp 服务器就启动成功了；


# 在 cursor 中加载该 mcp 服务器

## 基于 stdio 通信方式
1. 修改 `.cursor/mcp.json` 文件，改成如下内容：
```json
{
  "mcpServers": {
    "by-sdk": {
      "command": "ts-node",
      "args": ["/Users/kelie/Documents/study/demos/packages/mcp/server/by-sdk/server.ts"],
      "env": {
        "TRANSPORT": "stdio"
      }
    }
  }
}
```
2. 然后在 cursor setting 中开启该 mcp 服务器即可。

## 基于 streamableHttp 通信方式
1. 修改 `.cursor/mcp.json` 文件，改成如下内容：
```json
{
  "mcpServers": {
    "by-sdk": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```
2. cd 到当前目录下，执行 `pnpm run dev:streamableHttp` 启动 http 服务器；
3. 然后在 cursor setting 中开启该 mcp 服务器即可。

# 测试该 mcp 服务器

1. 在 chat 中选择 `agent` 模式（不能选择 `ask` 模式，否则不会使用 mcp 服务器中的工具）进行对话。