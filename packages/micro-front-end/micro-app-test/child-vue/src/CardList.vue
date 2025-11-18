<template>
  <div class="card-list">
    <Row :gutter="20">
      <Col
        v-for="(url, index) in images"
        :key="url"
        :span="6"
      >
        <Card
          hoverable
          style="width: 100%;"
          @click="onClick(index)"
        >
          <template #cover>
            <img alt="example" :src="url">
          </template>
          <CardMeta title="Vue title" description="This is the description">
            <template #avatar>
              <Avatar :src="avatar" />
            </template>
          </CardMeta>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Card, Row, Col, CardMeta, Avatar } from 'ant-design-vue'
  import image1 from './assets/image1.png'
  import image2 from './assets/image2.png'
  import image3 from './assets/image3.png'
  import image4 from './assets/image4.png'
  import avatar from './assets/avatar1.png'

  const images = [
    image1,
    image2,
    image3,
    image4,
  ]

  const router = useRouter()
  function onClick(index: number) {
    router.push({
      name: 'CardDetail',
      params: { index },
    })
  }
</script>