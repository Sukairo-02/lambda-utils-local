let activeRequestCount = 0
let lastRequestTimestamp = new Date().getMilliseconds()

const shutdownMillis = 300_000

export const initScaleToZeroShutdown = () => {
	setInterval(() => {
		if (activeRequestCount <= 0 && new Date().getMilliseconds() - lastRequestTimestamp >= shutdownMillis)
			process.exit(0)
	}, 60_000)
}

export const requestStarted = () => {
	++activeRequestCount
	lastRequestTimestamp = new Date().getMilliseconds()
}

export const requestFinished = () => {
	--activeRequestCount
}
