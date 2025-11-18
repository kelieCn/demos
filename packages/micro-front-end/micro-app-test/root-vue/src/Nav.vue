<template>
  <micro-app
    :name="config.name"
    :url="config.url"
    :baseroute="config.baseroute"
    :iframe="config.iframe"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'

  interface IMicroAppProps {
    name: string
    url: string
    baseroute?: string
    iframe?: boolean
  }

  const route = useRoute()
  const configMap: Record<string, IMicroAppProps> = {
    vue: {
      name: 'vue-app',
      url: 'http://localhost:3001',
      baseroute: '/vue',
    },
    react: {
      name: 'react-app',
      url: 'http://localhost:3002',
      baseroute: '/react',
    },
    vite: {
      name: 'vite-app',
      url: 'http://localhost:3003',
      baseroute: '/vite',
      iframe: true,
    },
  }
  const config = computed(() => {
    const child = route.params.child as string
    return configMap[child]!
  })
</script>