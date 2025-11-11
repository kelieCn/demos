# 调试 SSE demo

1. 在当前目录下执行 `pnpm run dev` 启动 SSE 服务器和静态资源服务器；
2. 访问 `http://localhost:3001/index.html` 查看浏览器控制台效果（会触发已连接事件回调）；
3. 尝试在 `watched` 文件夹下新增、修改、删除文件，观察浏览器控制台效果（会触发资源变更事件回调）；

> 注意，之所以通过创建一个静态资源服务器的方式来访问 index.html 文件，是因为想要看一下跨域相关的配置。但是不能使用 vscode 的插件 `live-server` 来启动 index.html 文件，否则会导致在 `watched` 文件夹下变更文件时会导致 SSE 连接断开从而无法接收到消息。