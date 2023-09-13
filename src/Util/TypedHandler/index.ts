import { ZodType, TypeOf } from 'zod'
import type { Send, NextFunction, Response, Request } from 'express-serve-static-core'

interface TypedResponse<ResBody> extends Express.Response {
	json: Send<ResBody, this>
}

export type TypedHandler<RequestSchema extends ZodType, ResponseType = void> = (
	req: TypeOf<RequestSchema> & Omit<Request, keyof TypeOf<RequestSchema>>,
	res: TypedResponse<ResponseType> & Omit<Response, keyof TypedResponse<ResponseType>>,
	next: NextFunction
) => any
