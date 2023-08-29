import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'
import { badRequest } from '@hapi/boom'

import type { GeneratorOptions } from './types'

const chromiumPath = '/tmp/localChromium/chromium/mac-1165945/chrome-mac/Chromium.app/Contents/MacOS/Chromium'

export default async (html: URL | Buffer | string, options?: GeneratorOptions) => {
	const browser = await puppeteer.launch({
		args: chromium.args,
		defaultViewport: chromium.defaultViewport,
		executablePath: process.env.IS_LOCAL ? chromiumPath : await chromium.executablePath(),
		headless: chromium.headless
	})

	const page = await browser.newPage()

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
}

export type * from './types'
