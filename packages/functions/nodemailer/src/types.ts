export type MailCredentials = {
	user: string
	pass: string
}

export type MailOptions = {
	from: string
	replyTo?: string
	to: string
	subject?: string
	text: string
	html?: string
}
