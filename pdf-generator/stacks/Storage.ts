import { Bucket, StackContext } from 'sst/constructs';

export function Storage({ stack }: StackContext) {
    const bucket = new Bucket(stack, 'uploads', {
        cors: [
            {
                maxAge: '1 day',
                allowedOrigins: ['*'],
                allowedHeaders: ['*'],
                allowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            },
        ],
    });

    stack.addOutputs({
        BucketName: bucket.bucketName,
    });

    return {
        bucket: bucket,
    };
}
