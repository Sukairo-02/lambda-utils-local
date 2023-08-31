import { Boom, isBoom } from '@hapi/boom'
import type { APIGatewayProxyHandler, APIGatewayProxyHandlerV2 } from 'aws-lambda'

const defaultError = {
	statusCode: 500,
	body: JSON.stringify({
		message: 'Something went wrong. Try again later...'
	}),
	headers: {
		'Content-Type': 'application/json'
	}
}

export const handlerV1 = (handler: APIGatewayProxyHandler) => {
	const wrapped: APIGatewayProxyHandler = async (event, context, callback) => {
		try {
			return (
				(await handler(event, context, callback)) || {
					statusCode: 500,
					body: JSON.stringify({
						message: 'Server failed to respond'
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
		} catch (err) {
			if (typeof err !== 'object' || !isBoom(err)) {
				console.error(err)
				return defaultError
			}

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
				body: JSON.stringify(response),
				headers: {
					'Content-Type': 'application/json'
				}
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
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
		} catch (err) {
			if (typeof err !== 'object' || !isBoom(err)) {
				console.error(err)
				return defaultError
			}

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
				body: JSON.stringify(response),
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	}

	return wrapped
}
