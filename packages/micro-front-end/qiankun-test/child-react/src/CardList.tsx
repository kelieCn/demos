import { useNavigate } from 'react-router'
import { Row, Col, Card, Avatar } from 'antd'
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

export default function CardList() {
  const navigate = useNavigate()

  function onClick(index: number) {
    navigate(`/detail/${index}`)
  }

  return (
    <Row gutter={20}>
      {images.map((url, index) => (
        <Col key={url} span={6}>
          <Card
            hoverable
            style={{ width: '100%' }}
            onClick={() => onClick(index)}
            cover={<img alt="example" src={url} />}
          >
            <Card.Meta
              title="React title"
              description="This is the description"
              avatar={<Avatar src={avatar} />}
            />
          </Card>
        </Col>
      ))}
    </Row>
  )
}