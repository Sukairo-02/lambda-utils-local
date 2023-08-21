import { createTransport } from 'nodemailer'

import type { Transporter } from 'nodemailer'
import type SESTransport from 'nodemailer/lib/ses-transport'

class Mailer {
	private transporter: Transporter<SESTransport.SentMessageInfo> | undefined

	constructor(transportOptions: SESTransport.Options) {
		this.transporter = createTransport(transportOptions)
	}

	public async sendMail(options: SESTransport.MailOptions) {
		if (!this.transporter) throw new Error('Transporter instantiation failed - transporter is undefined')

		return new Promise<SESTransport.SentMessageInfo>((resolve, reject) => {
			this.transporter?.sendMail(options, (err, info) => {
				if (err) return reject(err)

				resolve(info)
			})
		})
	}
}

export default Mailer
