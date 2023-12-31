import { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import { badRequest } from '@hapi/boom'

import { handlerV2 } from '@lambda-utils/core/apiGatewayErrorHandler'
import schema from './schema'
import generatePDF from './generatePDF'

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

	const { source, pdfOptions, browserOptions } = parseResult.data

	const pdf = await generatePDF(source, pdfOptions, browserOptions)

	return {
		statusCode: 200,
		body: pdf.toString('base64'),
		headers: {
			'Content-Type': 'application/pdf'
		},
		isBase64Encoded: true
	}
}

export const handler = handlerV2(lambda)
