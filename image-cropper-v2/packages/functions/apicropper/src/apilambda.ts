import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda'
import cropFunction from './crop'

const dimensionError = {
  statusCode: 400,
  body: {
    message: 'Height and width must be positive numbers or undefined'
  }
}

export const handler = async (evt: APIGatewayProxyStructuredResultV2) => {
  if (!evt.body) {
    return {
      statusCode: 500,
      body: 'No body'
    }
  }

  const body = JSON.parse(evt.body)

  if (!body.image) {
    return {
      statusCode: 500,
      body: 'No image'
    }
  }

  const { height, width } = body
  let cropConfig:
    | undefined
    | {
        height: number
        width: number
      }

  if (height === undefined || width === undefined) cropConfig = undefined
  else if (Number.isNaN(height) || Number.isNaN(width) || Math.floor(width) <= 0 || Math.floor(height) <= 0)
    return dimensionError
  else cropConfig = { height, width }

  const imageBuffer = Buffer.from(body.image, 'base64')

  const formattedBuffer = await cropFunction(imageBuffer, cropConfig)

  const formattedImageBase64 = formattedBuffer.toString('base64')

  return {
    statusCode: 200,
    body: formattedImageBase64,
    headers: {
      'Content-Type': 'image/webp'
    },
    isBase64Encoded: true
  }
}