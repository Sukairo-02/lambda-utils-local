import { StackContext, ApiGatewayV1Api } from 'sst/constructs'

export function LambdaUtils({ stack }: StackContext) {
	const gatewayV1 = new ApiGatewayV1Api(stack, 'gateway-v1', {
		routes: {
			'GET /helloWorld': 'packages/functions/example/src/lambda.handler'
		}
	})

	stack.addOutputs({
		ApiV1Endpoint: gatewayV1.url
	})
}
