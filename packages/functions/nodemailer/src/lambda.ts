import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { badRequest } from '@hapi/boom'

import { handlerV2 } from '@lambda-utils/core/apiGatewayErrorHandler'
import schema from './schema'
import sendMail from './sendMail'

const lambda: APIGatewayProxyHandlerV2 = async (event) => {
	if (!event.body) throw badRequest('Invalid input')
	let bodyObj: any

	try {
		bodyObj = JSON.parse(event.body)
	} catch (e) {
		throw badRequest('Unable to parse body: Invalid JSON.')
	}

	const parseResult = schema.safeParse(bodyObj)
	if (!parseResult.success) throw badRequest('Invalid input', parseResult.error.errors)

	const { credentials, mail } = parseResult.data

	await sendMail(credentials, mail)

	return {
		statusCode: 200,
		body: JSON.stringify({ message: 'Message delivered succesfully!' }),
		headers: {
			'Content-Type': 'application/json'
		}
	}
}

export const handler = handlerV2(lambda)
