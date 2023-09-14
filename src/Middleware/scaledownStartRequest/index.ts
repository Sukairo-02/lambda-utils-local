import { requestStarted } from '@Util/scaleToZero'
import type { RequestHandler } from 'express'

export default <RequestHandler>((req, res, next) => {
	requestStarted()
	next()
})
