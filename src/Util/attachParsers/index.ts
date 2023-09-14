import parseRequest from '@Middleware/parseRequest'
import scaledownStartRequest from '@Middleware/scaledownStartRequest'
import { requestFinished } from '@Util/scaleToZero'

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
			[key]: [scaledownStartRequest, parseRequest(currentSchema), <RequestHandler>(async (req, res, next) => {
					try {
						await handler(req, res, next)
					} catch (e) {
						return next(e)
					} finally {
						requestFinished()
					}
				})]
		})
	}

	return result as V
}
