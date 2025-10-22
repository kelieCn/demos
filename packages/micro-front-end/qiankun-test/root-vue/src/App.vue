<template>
  <Layout class="root-container">
    <Layout>
      <LayoutHeader class="root-header">
        <TypographyTitle :level="2" style="margin-bottom: 0;">
          qiankun 微前端
        </TypographyTitle>
      </LayoutHeader>
      <Layout>
        <LayoutSider class="root-sider">
          <Menu
            v-model:selected-keys="selectedKeys"
            :items="items"
            mode="inline"
            class="root-menu"
            @select="onSelected"
          />
        </LayoutSider>
        <Layout>
          <LayoutContent id="child-container" class="root-content" />
        </Layout>
      </Layout>
    </Layout>
  </Layout>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import type { ItemType , MenuProps } from 'ant-design-vue'
  import { Layout, LayoutHeader, LayoutSider, LayoutContent, Menu, TypographyTitle } from 'ant-design-vue'

  const router = useRouter()
  const selectedKeys = ref<string[]>([])
  const items: ItemType[] = [
    {
      key: 'vue',
      label: 'Vue微应用',
      title: 'Vue微应用',
    },
    {
      key: 'react',
      label: 'React微应用',
      title: 'React微应用',
    },
  ]

  function onSelected({ key }: Parameters<NonNullable<MenuProps['onSelect']>>[0]) {
    router.push(`/${key}`)
  }
</script>

<style scoped lang="scss">
  .root-container {
    width: 100%;
    height: 100%;
    .root-header {
      background-color: #fff;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      align-items: center;
    }
    .root-sider {
      background-color: #fff;
      .root-menu {
        height: 100%;
      }
    }
    .root-content {
      background-color: #f7f7f7;
    }
  }
</style>
