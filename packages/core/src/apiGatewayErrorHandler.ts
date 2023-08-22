import { Boom, isBoom } from '@hapi/boom'
import type { APIGatewayProxyHandler, APIGatewayProxyHandlerV2 } from 'aws-lambda'

export const handlerV1 = (handler: APIGatewayProxyHandler) => {
	const wrapped: APIGatewayProxyHandler = async (event, context, callback) => {
		try {
			return (
				(await handler(event, context, callback)) || {
					statusCode: 500,
					body: JSON.stringify({
						message: 'Server failed to respond'
					})
				}
			)
		} catch (err) {
			if (typeof err !== 'object' || !isBoom(err)) throw err

			const {
				data,
				message,
				output: { statusCode }
			} = <Boom>err

			const response = {
				message: message ?? undefined,
				data: data ?? undefined
			}

			return {
				statusCode,
				body: JSON.stringify(response)
			}
		}
	}

	return wrapped
}

export const handlerV2 = (handler: APIGatewayProxyHandlerV2) => {
	const wrapped: APIGatewayProxyHandlerV2 = async (event, context, callback) => {
		try {
			return (
				(await handler(event, context, callback)) || {
					statusCode: 500,
					body: JSON.stringify({
						message: 'Server failed to respond'
					})
				}
			)
		} catch (err) {
			if (typeof err !== 'object' || !isBoom(err)) throw err

			const {
				data,
				message,
				output: { statusCode }
			} = <Boom>err

			const response = {
				message: message ?? undefined,
				data: data ?? undefined
			}

			return {
				statusCode,
				body: JSON.stringify(response)
			}
		}
	}

	return wrapped
}
