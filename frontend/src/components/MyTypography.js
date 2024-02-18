import { Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

export const MyTitle = ({children, ...props}) => {
  return (
    <Title style={{color: 'white'}} {...props}>
      {children}
    </Title>
  )
}

export const MyText = ({children, ...props}) => {
  return (
    <Text style={{color: 'white'}} {...props}>
      {children}
    </Text>
  )
}

export const MyParagraph = ({children, ...props}) => {
  return (
    <Paragraph style={{color: 'white'}} {...props}>
      {children}
    </Paragraph>
  )
}