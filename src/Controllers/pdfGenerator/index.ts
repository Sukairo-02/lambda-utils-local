import { Router } from 'express'

import pdfGeneratorSvc from '@Services/pdfGenerator'

import attachParsers from '@Util/attachParsers'

import s from './schema'

import type pdfGeneratorControllerHandlers from './types'

class pdfGeneratorController {
	constructor(app: Router, path: string) {
		const router = Router()

		const { generatePDF } = attachParsers(this.handlers, s)

		router.post('/generate-pdf', generatePDF)

		app.use(path, router)
	}

	private handlers: pdfGeneratorControllerHandlers = {
		async generatePDF(req, res) {
			const { source, pdfOptions, browserOptions } = req.body

			const pdf = await pdfGeneratorSvc.generatePDF(source, pdfOptions, browserOptions)

			res.writeHead(200, ['Content-Type', 'application/pdf'])
			res.end(pdf)
		}
	}
}

export default pdfGeneratorController
