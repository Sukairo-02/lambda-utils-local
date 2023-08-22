import { StackContext, ApiGatewayV1Api, Function } from 'sst/constructs'

export function LambdaUtils({ stack }: StackContext) {
	const imageCropper = new Function(stack, 'cropFunction', {
		architecture: 'arm_64',
		runtime: 'container',
		handler: './packages/functions/image-cropper'
	})

	const gatewayV1 = new ApiGatewayV1Api(stack, 'gateway-v1', {
		routes: {
			'GET /helloWorld': 'packages/functions/example/src/lambda.handler',
			'POST /crop-image': imageCropper
		}
	})

	stack.addOutputs({
		ApiV1Endpoint: gatewayV1.url
	})
}
