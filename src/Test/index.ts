import fs from 'fs'
import axios, { AxiosError } from 'axios'

const test = async () => {
	try {
		const input = fs.readFileSync('./src/Test/test.html').toString()

		const request = {
			source: input,
			pdfOptions: {
				width: 1920,
				height: 1080,
				timeout: 0,
				printBackground: true
			},
			browserOptions: {
				width: 1920,
				height: 1080,
				adBlocker: true
			}
		}

		const stream = fs.createWriteStream('./src/Test/output.pdf')
		axios
			.post('http://localhost:3000/generate-pdf', request, { responseType: 'stream' })
			.then((res) => res.data.pipe(stream))
	} catch (e) {
		console.error((<AxiosError>e).response?.data ?? e)
	}
}

test()
