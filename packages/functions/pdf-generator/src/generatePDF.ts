import puppeteer from 'puppeteer'
import { badRequest } from '@hapi/boom'

import type { GeneratorOptions } from './types'

const YOUR_LOCAL_CHROMIUM_PATH =
  "/tmp/localChromium/chromium/mac-1165945/chrome-mac/Chromium.app/Contents/MacOS/Chromium";

export default async (html: URL | Buffer | string, options?: GeneratorOptions) => {
	const browser = await puppeteer.launch({
		headless: 'new',
		executablePath: YOUR_LOCAL_CHROMIUM_PATH ? YOUR_LOCAL_CHROMIUM_PATH : '/usr/bin/google-chrome',
		args: [
			'--disable-extensions',
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--disable-gpu'
		]
	})	
	const page = await browser.newPage()

	try {
		if (html instanceof URL) {
			await page.goto(html.toString(), { waitUntil: 'networkidle0' })
		} else {
			await page.setContent(html.toString(), { waitUntil: 'domcontentloaded' })
		}

		await page.emulateMediaType('screen')

		let pdf: Buffer

		try {
			pdf = await page.pdf(options)
		} catch (err) {
			if (err && typeof err === 'object') throw badRequest((<any>err).message)

			throw err
		}

		return pdf
	} catch (e) {
		throw e
	} finally {
		await browser.close()
	}
}

export type * from './types'
