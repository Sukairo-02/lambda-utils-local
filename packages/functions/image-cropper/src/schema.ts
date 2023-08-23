import { z } from 'zod'
import { badRequest } from '@hapi/boom'

const configSchema = z.object({
	crop: z
		.object({
			top: z.number().nonnegative(),
			left: z.number().nonnegative(),
			height: z.number().positive(),
			width: z.number().positive()
		})
		.optional(),

	resize: z
		.object({
			height: z.number().positive().optional(),
			width: z.number().positive().optional()
		})
		.optional(),

	compress: z
		.object({
			quality: z.number().min(1).max(100).optional(),
			lossless: z.boolean().optional()
		})
		.optional(),

	convert: z
		.object({
			format: z.union([z.literal('jpeg'), z.literal('png'), z.literal('webp')])
		})
		.optional()
})

export default z.object({
	config: z
		.string()
		.transform((content) => {
			try {
				return JSON.parse(content)
			} catch (e) {
				throw badRequest('Unable to parse config: invalid JSON')
			}
		})
		.pipe(configSchema),

	image: z.array(z.instanceof(Buffer)).length(1, 'Only one file is allowed per request')
})
