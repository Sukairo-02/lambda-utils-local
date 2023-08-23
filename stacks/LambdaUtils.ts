import { StackContext, ApiGatewayV1Api, Function } from 'sst/constructs'

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
				binaryMediaTypes: ['multipart/form-data', 'application/json']
			}
		}
	})

	stack.addOutputs({
		ApiV1Endpoint: gatewayV1.url
	})
}
