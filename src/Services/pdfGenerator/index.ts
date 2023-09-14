import puppeteer from 'puppeteer-core'
import { badRequest } from '@hapi/boom'
import { PuppeteerBlocker } from '@cliqz/adblocker-puppeteer'
import fetch from 'cross-fetch'

import type { Page } from 'puppeteer-core'
import type { BrowserOptions, PDFOptions } from './types'

class pdfGenerator {
	private args = [
		'--allow-pre-commit-input',
		'--disable-background-networking',
		'--disable-background-timer-throttling',
		'--disable-backgrounding-occluded-windows',
		'--disable-breakpad',
		'--disable-client-side-phishing-detection',
		'--disable-component-extensions-with-background-pages',
		'--disable-component-update',
		'--disable-default-apps',
		'--disable-dev-shm-usage',
		'--disable-extensions',
		'--disable-hang-monitor',
		'--disable-ipc-flooding-protection',
		'--disable-popup-blocking',
		'--disable-prompt-on-repost',
		'--disable-renderer-backgrounding',
		'--disable-sync',
		'--enable-automation',
		'--enable-blink-features=IdleDetection',
		'--export-tagged-pdf',
		'--force-color-profile=srgb',
		'--metrics-recording-only',
		'--no-first-run',
		'--password-store=basic',
		'--use-mock-keychain',
		'--disable-domain-reliability',
		'--disable-print-preview',
		'--disable-speech-api',
		'--disk-cache-size=33554432',
		'--mute-audio',
		'--no-default-browser-check',
		'--no-pings',
		'--disable-features=Translate,BackForwardCache,AcceptCHFrame,MediaRouter,OptimizationHints,AudioServiceOutOfProcess,IsolateOrigins,site-per-process',
		'--enable-features=NetworkServiceInProcess2,SharedArrayBuffer',
		'--hide-scrollbars',
		'--ignore-gpu-blocklist',
		'--in-process-gpu',
		'--window-size=1920,1080',
		'--allow-running-insecure-content',
		'--disable-setuid-sandbox',
		'--disable-site-isolation-trials',
		'--disable-web-security',
		'--no-sandbox',
		'--no-zygote',
		"--headless='new'",
		'--lang=en-GB,en',
		'--disable-3d-apis',
		'--single-process'
	]

	private async waitTillHTMLRendered(page: Page, timeout: number) {
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

	async generatePDF(html: URL | Buffer | string, pdfOptions?: PDFOptions, browserOptions?: BrowserOptions) {
		const scrWidth =
			browserOptions?.width && browserOptions?.width >= 240 && browserOptions?.width <= 1920
				? browserOptions.width
				: 1920
		const scrheight =
			browserOptions?.height && browserOptions?.height >= 240 && browserOptions?.height <= 1920
				? browserOptions.height
				: 1080

		const browser = await puppeteer.launch({
			args: this.args,
			defaultViewport: {
				height: scrheight,
				width: scrWidth
			},
			ignoreHTTPSErrors: true,
			headless: 'new',
			executablePath: process.env.CHROME_BIN
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

					//@ts-ignore - 'error' doesn't affect runtime
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
			if (browserOptions?.secondaryRenderAwait) await this.waitTillHTMLRendered(page, 15_000)

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
			await browser.close()
		}
	}
}

export default new pdfGenerator()
