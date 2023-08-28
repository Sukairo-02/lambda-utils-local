import type { PDFOptions } from 'puppeteer'

type OmittedOptions = {
	path: any
}

export type GeneratorOptions = Omit<PDFOptions, keyof OmittedOptions>
