import parseRequest from '@Middleware/parseRequest'

import type { ZodType } from 'zod'
import type { RequestHandler } from 'express'
import type { TypedHandlerContainer } from './types'

export default <
	T extends TypedHandlerContainer,
	U extends { [key in keyof T]: ZodType },
	V extends { [key in keyof T]: [RequestHandler, RequestHandler] }
>(
	controller: T,
	schema: U
): V => {
	const result: Partial<V> = {}
	for (const [key, handler] of Object.entries(controller)) {
		const currentSchema = schema[key]
		if (!currentSchema) throw new Error(`Request parser attaching error: schema has no property ${key}!`)

		Object.assign(result, {
			[key]: [parseRequest(currentSchema), <RequestHandler>(async (req, res, next) => {
					try {
						await handler(req, res, next)
					} catch (e) {
						next(e)
					}
				})]
		})
	}

	return result as V
}
