import * as lambda from 'aws-cdk-lib/aws-lambda'
import { StackContext, ApiGatewayV1Api, Api, Function } from 'sst/constructs'

export function LambdaUtils({ stack }: StackContext) {
	const imageCropper = new Function(stack, 'cropFunction', {
		runtime: 'container',
		handler: './packages/functions/image-cropper',
		memorySize: 3008,
		timeout: 180
	})

	const gatewayV1 = new ApiGatewayV1Api(stack, 'gateway-v1', {
		routes: {
			'POST /crop-image': imageCropper
		},
		cdk: {
			restApi: {
				binaryMediaTypes: ['*/*']
			}
		}
	})

	const pdfGenerator = new Function(stack, 'pdfGeneratorFunction', {
		runtime: 'container',
		handler: './packages/functions/pdf-generator',
		memorySize: 3008,
		timeout: 30
	})

	const nodeMailer = new Function(stack, 'nodeMailerFunction', {
		runtime: 'container',
		handler: './packages/functions/nodemailer'
	})

	const layerChromium = new lambda.LayerVersion(stack, 'chromiumLayers', {
		code: lambda.Code.fromAsset('layers/chromium')
	})

	const pdfGeneratorLayers = new Function(stack, 'pdfGeneratorLayersFunction', {
		runtime: 'nodejs18.x',
		handler: './packages/functions/pdf-generator-layers/build/index.handler',
		memorySize: 3008,
		layers: [layerChromium],
		nodejs: {
			esbuild: {
				external: ['@sparticuz/chromium']
			}
		}
	})

	const gatewayV2 = new Api(stack, 'gateway-v2', {
		routes: {
			'POST /generate-pdf': pdfGenerator,
			'POST /send-mail': nodeMailer,
			'POST /generate-pdf-layers': pdfGeneratorLayers
		}
	})

	gatewayV1.attachPermissions([gatewayV1])
	gatewayV2.attachPermissions([gatewayV2])

	stack.addOutputs({
		ApiV1Endpoint: gatewayV1.url,
		ApiV2Endpoint: gatewayV2.url
	})
}
