import { badRequest } from '@hapi/boom'
import { handlerV1 } from '@lambda-utils/core/apiGatewayErrorHandler'
import formParser from 'lambda-multipart-parser'

import schema from './schema'
import crop from './crop'

import type { APIGatewayProxyHandler } from 'aws-lambda'

const lambda: APIGatewayProxyHandler = async (event) => {
	if (!event.body) throw badRequest('Invalid input')
	let bodyObj: formParser.MultipartRequest

	try {
		bodyObj = await formParser.parse(event)
	} catch (e) {
		throw badRequest('Unable to parse request data. Make sure request is in multipart/form-data format.')
	}

	const parseResult = schema.safeParse(bodyObj)
	if (!parseResult.success) throw badRequest('Invalid input', parseResult.error.errors)

	const {
		files: [{ content: image }],
		config
	} = parseResult.data

	const processed = await crop(image, config)

	const [{ contentType }] = bodyObj.files

	const outMime = config.convert?.format ? `image/${config.convert.format}` : contentType

	return {
		statusCode: 200,
		body: processed.toString('base64'),
		headers: {
			'Content-Type': outMime
		},
		isBase64Encoded: true
	}
}

export const handler = handlerV1(lambda)
