import puppeteer from 'puppeteer'
import chromium from '@sparticuz/chromium'
import { badRequest } from '@hapi/boom'
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer'
import fetch from 'cross-fetch'
import { exec } from 'child_process'

import type { Page } from 'puppeteer'
import type { BrowserOptions, PDFOptions } from './types'

const waitTillHTMLRendered = async (page: Page, timeout: number) => {
	const checkDurationMsecs = 1_000
	const maxChecks = timeout / checkDurationMsecs

	let lastHTMLSize = 0
	let checkCounts = 1
	let countStableSizeIterations = 0

	const minStableSizeIterations = 3

	while (checkCounts++ <= maxChecks) {
		const html = await page.content()
		const currentHTMLSize = html.length

		await page.evaluate(() => document.body.innerHTML.length)

		if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) countStableSizeIterations++
		else countStableSizeIterations = 0

		if (countStableSizeIterations >= minStableSizeIterations) break

		lastHTMLSize = currentHTMLSize
		await new Promise((r) => setTimeout(r, checkDurationMsecs))
	}
}

const chromiumPath = '/tmp/localChromium/chromium/mac-1165945/chrome-mac/Chromium.app/Contents/MacOS/Chromium'
const forbiddenArgs: string[] = []
const additionalArgs = ['--lang=en-GB,en', '--disable-3d-apis']

const chromiumArgs = [...chromium.args.filter((e) => !forbiddenArgs.find((el) => e === el)), ...additionalArgs]

export default async (html: URL | Buffer | string, pdfOptions?: PDFOptions, browserOptions?: BrowserOptions) => {
	const browser = await puppeteer.launch({
		args: chromiumArgs,
		defaultViewport: chromium.defaultViewport,
		executablePath: process.env.IS_LOCAL ? chromiumPath : await chromium.executablePath(),
		headless: chromium.headless,
		ignoreHTTPSErrors: true,
		dumpio: true
	})

	const page = await browser.newPage()
	await page.setExtraHTTPHeaders({
		'Accept-Language': 'en'
	})

	try {
		if (browserOptions?.adBlocker) {
			try {
				const blocker = await PuppeteerBlocker.fromLists(fetch, [
					'https://secure.fanboy.co.nz/fanboy-cookiemonster.txt',
					'https://easylist.to/easylist/easylist.txt'
				])

				await blocker.enableBlockingInPage(page)
			} catch (e) {}
		}

		try {
			if (html instanceof URL) {
				await page.goto(html.toString(), {
					waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
				})
			} else {
				await page.setContent(html.toString(), {
					waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2']
				})
			}
		} catch (e) {
			throw badRequest('Unable to load requested page')
		}

		await page.emulateMediaType('screen')
		if (browserOptions?.secondaryRenderAwait) await waitTillHTMLRendered(page, 15_000)

		let pdf: Buffer

		try {
			pdf = await page.pdf(pdfOptions)
		} catch (err) {
			if (err && typeof err === 'object')
				throw badRequest((<any>err).message ?? 'Unable to generate PDF from given source')

			throw err
		}

		return pdf
	} finally {
		try {
			await page.close()
		} catch (e) {
			console.error(`Page closing error:\n${e}`)
		}

		try {
			browser.process()?.kill('SIGTERM')
		} catch (e) {
			console.error(`Process SIGTERM error:\n${e}`)
		}

		try {
			browser
				.close()
				.then(() => {})
				.catch((e) => {
					console.error(`Browser closing error:\n${e}`)
				})

			exec('pkill chromium', (e) => {
				console.error(`pkill chromium error:\n${e}`)
			})
			exec('pkill chrome', (e) => {
				console.error(`pkill chromium error:\n${e}`)
			})
		} catch (e) {
			console.error(`Process termination error:\n${e}`)
		}
	}
}

export type * from './types'
