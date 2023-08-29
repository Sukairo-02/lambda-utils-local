import { StackContext, ApiGatewayV1Api, Api, Function } from 'sst/constructs'
import * as lambda from "aws-cdk-lib/aws-lambda";

export function LambdaUtils({ stack }: StackContext) {
	const imageCropper = new Function(stack, 'cropFunction', {
		runtime: 'container',
		handler: './packages/functions/image-cropper',
		memorySize:3008,
		timeout:180
	})
	// const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
	// 	code: lambda.Code.fromAsset("arn:aws:lambda:eu-west-3:764866452798:layer:chrome-aws-lambda:33"),
	// });
	// const layerChromium = new lambda.LayerVersion(stack, "chromiumLayers", {
	// 	code: lambda.Code.fromAsset("layers/chromium"),
	// });

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
		memorySize:3008,
		timeout:180
	})

	// const pdfGeneratorLayers = new Function(stack, 'pdfGeneratorLayers', {
	// 	runtime: 'nodejs16.x',
	// 	handler: './packages/functions/pdf-generator/src/lambda.handler',
	// 	layers: [layerChromium],
	// })

	const gatewayV2 = new Api(stack, 'gateway-v2', {
		routes: {
			'POST /generate-pdf': pdfGenerator
		}
	})

	gatewayV1.attachPermissions([gatewayV1])
	gatewayV2.attachPermissions([gatewayV2])

	stack.addOutputs({
		ApiV1Endpoint: gatewayV1.url,
		ApiV2Endpoint: gatewayV2.url
	})
}
