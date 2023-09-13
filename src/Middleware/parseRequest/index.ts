import * as Boom from '@hapi/boom'

import type { ZodType } from 'zod'
import type { RequestHandler } from 'express'

export default <T extends ZodType>(schema: T) => {
	return <RequestHandler>((req, res, next) => {
		const parsedRequest = schema.safeParse(req)
		if (!parsedRequest.success) throw Boom.badRequest('Invalid input', parsedRequest.error.errors)

		if (typeof parsedRequest.data === 'object') Object.assign(req, parsedRequest.data)
		else req = parsedRequest.data

		next()
	})
}
