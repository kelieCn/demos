<template>
  <div class="page">
    <Form layout="vertical">
      <FormItem label="通信模式">
        <RadioGroup
          v-model:value="model.mode"
          button-style="solid"
          @change="changeMode"
        >
          <RadioButton :value="IMode.LocalStorage">
            LocalStorage
          </RadioButton>
          <RadioButton :value="IMode.BroadcastChannel">
            BroadcastChannel
          </RadioButton>
          <RadioButton :value="IMode.SharedWorker">
            SharedWorker
          </RadioButton>
          <RadioButton :value="IMode.ServiceWorker">
            ServiceWorker
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem label="数据类型">
        <RadioGroup
          v-model:value="model.dataType"
          button-style="solid"
        >
          <RadioButton :value="IDataType.String">
            字符串
          </RadioButton>
          <RadioButton :value="IDataType.Number">
            数字
          </RadioButton>
          <RadioButton :value="IDataType.Boolean">
            布尔
          </RadioButton>
          <RadioButton :value="IDataType.Object">
            无状态对象
          </RadioButton>
          <RadioButton :value="IDataType.StateObject">
            有状态对象
          </RadioButton>
          <RadioButton :value="IDataType.Function">
            函数
          </RadioButton>
        </RadioGroup>
      </FormItem>
      <Button
        type="primary"
        block
        @click="sendMessage"
      >
        发送
      </Button>
    </Form>
    <Space direction="vertical" size="middle" />
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'
  import { RadioGroup, RadioButton, Space, Button, message, Form, FormItem } from 'ant-design-vue'
  import type { MessageMode } from './api'
  import { LocalStorageMessageMode, BroadcastChannelMessageMode, SharedWorkerMessageMode, ServiceWorkerMessageMode } from './api'

  enum IMode {
    /** 本地存储 */
    LocalStorage = 'LocalStorage',
    /** 广播 */
    BroadcastChannel = 'BroadcastChannel',
    /** 共享工作线程 */
    SharedWorker = 'SharedWorker',
    /** 服务工作线程 */
    ServiceWorker = 'ServiceWorker',
  }
  enum IDataType {
    String = 'String',
    Number = 'Number',
    Boolean = 'Boolean',
    Object = 'Object',
    StateObject = 'StateObject',
    Function = 'Function',
  }

  const model = reactive<{
    mode: IMode
    dataType: IDataType
  }>({
    mode: IMode.LocalStorage,
    dataType: IDataType.String,
  })

  let messageMode: MessageMode | undefined

  watch(() => model.mode, val => {
    if (messageMode) {
      messageMode.destroy()
      messageMode = undefined
    }
    switch (val) {
      case IMode.LocalStorage:
        messageMode = new LocalStorageMessageMode()
        break
      case IMode.BroadcastChannel:
        messageMode = new BroadcastChannelMessageMode()
        break
      case IMode.SharedWorker:
        messageMode = new SharedWorkerMessageMode()
        break
      case IMode.ServiceWorker:
        messageMode = new ServiceWorkerMessageMode()
        break
    }
    if (!messageMode) return
    messageMode.receiveMessage((data) => {
      if (typeof data === 'string') {
        try {
          const res = JSON.parse(data)
          if (res.type === 'changeMode') {
            model.mode = res.mode as IMode
          }
        } catch {}
      }
      message.info('接收消息成功，注意控制台输出')
      console.log({ mode: val, data })
    })
  }, { immediate: true })

  // 修改消息模式时同步修改其他页面的消息模式
  function changeMode() {
    if (!messageMode) return
    messageMode.sendMessage(JSON.stringify({ type: 'changeMode', mode: model.mode }))
  }
  function sendMessage() {
    if (!messageMode) return
    let data: any
    switch (model.dataType) {
      case IDataType.String:
        data = 'keliecn'
        break
      case IDataType.Number:
        data = 1
        break
      case IDataType.Boolean:
        data = true
        break
      case IDataType.Object:
        data = { name: 'keliecn' }
        break
      case IDataType.StateObject:
        data = new Promise(resolve => setTimeout(() => resolve({ name: 'keliecn' }), 1000))
        break
      case IDataType.Function:
        data = () => {
          console.log('keliecn')
        }
        break
    }
    messageMode.sendMessage(data)
    message.success('消息发送成功，请注意查看其他同源页面')
  }
</script>

<style scoped lang="scss">
  .page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
