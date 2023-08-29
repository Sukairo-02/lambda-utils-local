import { z } from 'zod'

const pageFormatSchema = z.union([
	z.literal('letter'),
	z.literal('legal'),
	z.literal('tabloid'),
	z.literal('ledger'),
	z.literal('a0'),
	z.literal('a1'),
	z.literal('a2'),
	z.literal('a3'),
	z.literal('a4'),
	z.literal('a5'),
	z.literal('a6')
])

const pdfMarginSchema = z.object({
	top: z.number().min(0).or(z.string()).optional(),
	bottom: z.number().min(0).or(z.string()).optional(),
	left: z.number().min(0).or(z.string()).optional(),
	right: z.number().min(0).or(z.string()).optional()
})

const configSchema = z.object({
	scale: z.number().min(0.1).max(2).optional(),
	displayHeaderFooter: z.boolean().optional(),
	headerTemplate: z.string().optional(),
	footerTemplate: z.string().optional(),
	printBackground: z.boolean().optional(),
	landscape: z.boolean().optional(),
	pageRanges: z
		.string()
		.regex(/^[0-9]+(-([0-9]+))?$/, 'Invalid page ranges')
		.refine((arg) => {
			const numbers = arg.split('-').map((e) => Number(e))

			if (numbers.length <= 1) return true

			return numbers[2] > numbers[1]
		}, 'Invalid page ranges')
		.optional(),
	format: z.string().toLowerCase().pipe(pageFormatSchema).optional(),
	width: z.number().min(1).or(z.string()).optional(), // Dimension units were never specified
	height: z.number().min(1).or(z.string()).optional(), // therefore shall be parsed by lib itself
	preferCSSPageSize: z.boolean().optional(),
	margin: pdfMarginSchema.optional(),
	omitBackgdound: z.boolean().optional(),
	timeout: z.number().min(0).optional()
})

export default z.object({
	source: z.union([
		z
			.string()
			.url()
			.transform((str) => new URL(str)),
		z.string(),
		z.instanceof(Buffer)
	]),
	config: configSchema
})
