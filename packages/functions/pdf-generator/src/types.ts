import type { PDFOptions as PuppeteerOptions, Browser } from 'puppeteer'

export type BrowserContainer = {
	browser?: Browser
}

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
