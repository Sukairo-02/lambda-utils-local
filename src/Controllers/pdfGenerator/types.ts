import s from './schema'

import type { TypedHandler } from '@Util/TypedHandler'

export type pdfGeneratorControllerHandlers = {
	generatePDF: TypedHandler<typeof s.generatePDF>
}

export default pdfGeneratorControllerHandlers
