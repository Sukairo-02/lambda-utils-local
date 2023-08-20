import sharp from 'sharp'

export default async (
	image: Buffer,
	config?: {
		width: number
		height: number
	}
) => {
	let width, height
	if (config) {
		width = Math.floor(config.width)
		height = Math.floor(config.height)
	} else {
		const defaultSize = 500

		const { width: localWidth, height: localHeight } = await sharp(image).metadata()

		const min = localWidth && localHeight ? Math.min(localWidth, localHeight) : defaultSize
		height = min
		width = min
	}

	if (!width || !height || width <= 0 || height <= 0) throw new Error('Image dimensions must be positive')

	const res = await sharp(image).resize({ width, height }).toFormat('webp').toBuffer()

	return res
}
