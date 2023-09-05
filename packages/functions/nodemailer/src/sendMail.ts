import { createTransport } from 'nodemailer'
import { badRequest } from '@hapi/boom'

import type { MailCredentials, MailOptions } from './types'

export default (credentials: MailCredentials, mail: MailOptions) => {
	const transporterConfig = {
		service: 'gmail',
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: credentials
	}

	const transporter = createTransport(transporterConfig)

	return new Promise((resolve, reject) => {
		transporter.sendMail(mail, (err, info) => {
			if (err) return reject(badRequest(err.message))
			if (info) return resolve(info.response)
		})
	})
}
