import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda'
import { badRequest } from '@hapi/boom'
import { handlerV1 } from '@lambda-utils/core/apiGatewayErrorHandler'
import schema from './schema'
import crop from './crop'

const lambda: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
	if(!event.body) throw badRequest('Invalid input')
	const parseResult = schema.safeParse(JSON.parse(event.body))
	if (!parseResult.success) throw badRequest('Invalid input', parseResult.error.errors)

	const { image, config } = parseResult.data

	const processed = await crop(image, config)

	return {
		statusCode: 200,
		body: JSON.stringify({
			image: processed.toString('base64')
		}),
		headers: {
			'Content-Type': 'image'
		}
	}
}

export const handler = handlerV1(lambda)
