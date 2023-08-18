import { StackContext, Bucket, Api, ApiGatewayV1Api } from 'sst/constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export function ApiStack({ stack }: StackContext) {
    const bucket = new Bucket(stack, 'ImageUpload', {
        notifications: {
            resize: {
                function: {
                    handler: 'packages/functions/src/resize.main',
                    nodejs: {
                        esbuild: {
                            external: ['sharp'],
                        },
                    },
                    layers: [
                        new lambda.LayerVersion(stack, 'SharpLayer', {
                            code: lambda.Code.fromAsset('layers/sharp'),
                        }),
                    ],
                },
                events: ['object_created'],
            },
        },
    });

    // Allow the notification functions to access the bucket
    bucket.attachPermissions([bucket]);

    const api = new ApiGatewayV1Api(stack, 'Api', {
        cdk: {
            restApi: {
                defaultCorsPreflightOptions: {
                    allowOrigins: ['"*"'],
                },
                binaryMediaTypes: ['*/*'],
            },
        },
        routes: {
            'POST /resize': {
                function: {
                    handler: 'packages/functions/src/endpoint.handler',
                    timeout: 900,
                },
            },
        },
    });

    api.bind([bucket]);

    // Show the endpoint in the output
    stack.addOutputs({
        BucketName: bucket.bucketName,
        ApiEndpoint: api.url,
    });
}
