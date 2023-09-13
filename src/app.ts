import express from 'express'
import cors from 'cors'

import errorHandler from '@Util/errorHandler'
import pdfGeneratorController from '@Controllers/pdfGenerator'

const app = express()
app.use(cors())
app.use(express.json())
new pdfGeneratorController(app, '/')
app.use(errorHandler)

const port = process.env.PORT || 3000

async function start() {
	try {
		app.listen(port, () => console.log(`Server started on port ${port}`))
	} catch (e) {
		console.error(e)
	}
}

start()
