import { z } from 'zod'

export default z.object({
	credentials: z.object({
		user: z.string().email(),
		pass: z.string()
	}),
	mail: z.object({
		from: z.string(),
		replyTo: z.string().email().optional(),
		to: z.string().email(),
		subject: z.string(),
		text: z.string(),
		html: z.string().optional()
	})
})
