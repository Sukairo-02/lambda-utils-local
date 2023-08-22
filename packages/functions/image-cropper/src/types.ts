export type CropOptions = {
	top: number
	left: number
	height: number
	width: number
}

export type ResizeOptions = {
	height?: number
	width?: number
}

export type CompressOptions = {
	quality?: number
	lossless?: boolean
}

export type ConvertOptions = {
	format: 'jpeg' | 'png' | 'webp'
}

export type CropperConfig = {
	crop?: CropOptions
	resize?: ResizeOptions
	compress?: CompressOptions
	convert?: ConvertOptions
}

export type NumberContainer = Object & {
	[key: string | number | symbol]: number
}
