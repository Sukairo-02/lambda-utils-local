import sharp from 'sharp'
import { badRequest, badData } from '@hapi/boom'

import type { CropperConfig, NumberContainer } from './types'

const extractIntegers = <T extends NumberContainer>(container: T) => {
	const result: Partial<T> = {}

	for (const [key, value] of Object.entries(container)) {
		if (value === undefined) continue

		Object.assign(result, { [key]: Math.floor(value) })
	}

	return result as T
}

const extractPositives = <T extends NumberContainer>(container: T, errPrefix?: string) => {
	const result: Partial<T> = {}

	for (const [key, value] of Object.entries(container)) {
		if (value === undefined) continue

		if (value <= 0) throw badRequest(`${errPrefix} ${key} must be positive number!`)

		Object.assign(result, { [key]: value })
	}

	return result as T
}

const extractNonNegatives = <T extends NumberContainer>(container: T, errPrefix?: string) => {
	const result: Partial<T> = {}

	for (const [key, value] of Object.entries(container)) {
		if (value === undefined) continue

		if (value <= 0) throw badRequest(`${errPrefix} ${key} must be non-negative number!`)

		Object.assign(result, { [key]: value })
	}

	return result as T
}

export default async (image: Buffer, config: CropperConfig) => {
	let meta: sharp.Metadata

	try {
		meta = await sharp(image).metadata()
	} catch (e) {
		throw badData('Unable to process image. Make sure attached file is an image of any format supported by sharp.')
	}

	let imgProcessor = sharp(image)

	if (config.crop) {
		const flooredConfig = extractIntegers(config.crop)

		const errPrefix = 'Crop config error:'

		const { top, left } = extractNonNegatives({ top: flooredConfig.top, left: flooredConfig.left }, errPrefix)
		const { height, width } = extractPositives(
			{ height: flooredConfig.height, width: flooredConfig.width },
			errPrefix
		)

		const { height: srcHeight, width: srcWidth } = meta

		if ((srcHeight && top + height > srcHeight) || (srcWidth && left + width > srcWidth))
			throw badRequest('Crop config error: sum of offset & size cannot be greater than size of original image!')

		imgProcessor = imgProcessor.extract({ top, left, height, width })
	}

	if (config.resize) {
		const flooredConfig = extractIntegers(config.resize)

		const errPrefix = 'Resize config error:'

		const sizeData = extractPositives(flooredConfig, errPrefix)

		imgProcessor = imgProcessor.resize(sizeData)
	}

	if (config.convert && !config.compress) {
		const { format } = config.convert

		imgProcessor = imgProcessor.toFormat(format)
	}

	if (!config.convert && config.compress) {
		const { quality, lossless } = config.compress

		if (quality && (quality < 1 || quality > 100))
			throw badRequest('Compress config error: quality must be an integer in a range [1-100].')

		const flooredQuality = quality ? Math.floor(quality) : quality

		// Compression applies only if the output format matches
		// one of the available options
		// otherwise this step is ignored
		imgProcessor = imgProcessor
			.jpeg({ force: false, quality: flooredQuality })
			.png({ force: false, quality: flooredQuality })
			.tiff({ force: false, quality: flooredQuality })
			.webp({ force: false, quality: flooredQuality, lossless })
			.avif({ force: false, quality: flooredQuality, lossless })
			.heif({ force: false, quality: flooredQuality, lossless })
			.jxl({ force: false, quality: flooredQuality, lossless })
	}

	if (config.convert && config.compress) {
		const { format } = config.convert
		const { quality, lossless } = config.compress

		if (quality && (quality < 1 || quality > 100))
			throw badRequest('Compress config error: quality must be an integer in a range [1-100].')

		const flooredQuality = quality ? Math.floor(quality) : quality

		imgProcessor.toFormat(format, { quality: flooredQuality, lossless })
	}

	const result = await imgProcessor.toBuffer()

	return result
}
