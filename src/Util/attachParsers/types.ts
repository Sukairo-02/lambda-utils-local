import type { ZodAny } from 'zod'
import type { TypedHandler } from '@Util/TypedHandler'

export type TypedHandlerContainer = {
	[key: string]: TypedHandler<ZodAny, any>
}
