import { StackContext, ApiGatewayV1Api, Api, Function } from 'sst/constructs'

export function LambdaUtils({ stack }: StackContext) {
	const imageCropper = new Function(stack, 'cropFunction', {
		runtime: 'container',
		handler: './packages/functions/image-cropper'
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
		handler: './packages/functions/pdf-generator'
	})

	const gatewayV2 = new Api(stack, 'gateway-v2', {
		routes: {
			'POST /generate-pdf': pdfGenerator
		}
	})

	gatewayV1.attachPermissions([gatewayV1])

	stack.addOutputs({
		ApiV1Endpoint: gatewayV1.url,
		ApiV2Endpoint: gatewayV2.url
	})
}
