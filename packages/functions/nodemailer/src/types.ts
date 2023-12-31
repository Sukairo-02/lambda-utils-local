export type MailCredentials = {
	user: string
	pass: string
}

export type MailOptions = {
	to: string
	subject?: string
	text?: string
	html?: string
}
