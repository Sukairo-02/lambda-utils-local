import type { PDFOptions as PuppeteerOptions } from 'puppeteer'

type OmittedOptions = {
	path: any
	headerTemplate: any
	footerTemplate: any
}

export type PDFOptions = Omit<PuppeteerOptions, keyof OmittedOptions>

export type BrowserOptions = {
	secondaryRenderAwait?: boolean
	adBlocker?: boolean
}
