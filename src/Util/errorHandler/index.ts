import { Boom, isBoom } from '@hapi/boom'
import util from 'util'

import type { ErrorRequestHandler } from 'express'

const defaultHttpErrorMessage = 'Unknown error occured... Try again later'

export = <ErrorRequestHandler>((err, req, res, next) => {
	try {
		if (typeof err !== 'object') {
			console.error('Error:\n')
			console.error(err)
			console.error(
				`Path:\n${req.path}\nBody:\n${util.inspect(req.body)}\nParams:\n${util.inspect(
					req.params
				)}\nQuery:\n${util.inspect(req.query)}\n`
			)

			return res.status(500).json({ message: defaultHttpErrorMessage })
		}

		if (isBoom(err)) {
			const {
				data,
				message,
				output: { statusCode }
			} = <Boom>err

			const response = {
				message: message ?? undefined,
				data: data ?? undefined
			}

			return res.status(statusCode).json(response)
		}

		let statusCode: number | undefined = err.statusCode
		let message: string = typeof err.message === 'string' ? err.message : defaultHttpErrorMessage

		if (typeof statusCode !== 'number') {
			statusCode = 500
			message = defaultHttpErrorMessage

			console.error('Error:\n')
			console.error(err)
			console.error(
				`Path:\n${req.path}\nBody:\n${util.inspect(req.body)}\nParams:\n${util.inspect(
					req.params
				)}\nQuery:\n${util.inspect(req.query)}\n`
			)
		}

		return res.status(statusCode).json({ message })
	} catch (e) {
		// Just in case...
		console.error('ErrorHandler error:\n')
		console.error(e)
		console.error('Original error:\n')
		console.error(err)
		console.error(
			`Path:\n${req.path}\nBody:\n${util.inspect(req.body)}\nParams:\n${util.inspect(
				req.params
			)}\nQuery:\n${util.inspect(req.query)}\n`
		)

		return res.status(500).json({ message: defaultHttpErrorMessage })
	}
})
