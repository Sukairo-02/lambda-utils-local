import { z } from 'zod'

export default z.object({
	image: z.instanceof(Buffer).or(z.string().transform((str) => Buffer.from(str))),

	config: z.object({
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
})
