import { z } from 'zod'

export default z.object({
	credentials: z.object({
		user: z.string().email(),
		pass: z.string()
	}),
	mail: z.object({
		to: z.string().email(),
		subject: z.string().optional(),
		text: z.string().optional(),
		html: z.string().optional()
	})
})
