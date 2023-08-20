import type { PDFOptions } from 'puppeteer'

export type GeneratorOptions = Omit<PDFOptions, 'path'>
