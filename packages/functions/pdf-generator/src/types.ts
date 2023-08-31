import type { PDFOptions as PuppeteerOptions } from 'puppeteer'

type OmittedOptions = {
	path: any
}

export type PDFOptions = Omit<PuppeteerOptions, keyof OmittedOptions>

export type BrowserOptions = {
	secondaryRenderAwait?: boolean
	adBlocker?: boolean
}
