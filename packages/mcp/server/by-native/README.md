# 测试方法

1. cd 到当前目录下；
2. 使用 `nlx @modelcontextprotocol/inspector` 开启调试工具；
3. 在调试工具左侧的 Command 中输入 `ts-node`，在 Arguments 中输入 `--esm server.ts`；
4. 点击调试工作左下方的 connect 按钮进行连接，至此原生的基于 stdio 通信方式的 mcp 服务器就启动成功了；


# 注意事项

1. 由于 server.ts 文件中只实现了 initialize、tools/list、tools/call 三个方法，所以目前调试页面只有 tools 部分是可以正常使用的；
2. 当前只是一个简单的 demo 演示，无法在 cursor 或其他 mcp 客户端中加载该 mcp 服务器；