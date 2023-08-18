import {  APIGatewayProxyEvent } from 'aws-lambda';
import { Bucket as S3Bucket } from 'aws-cdk-lib/aws-s3';
import { S3Client, PutObjectCommand, CreateMultipartUploadCommand } from '@aws-sdk/client-s3';
import { v4 } from 'uuid';
import Busboy from 'busboy';

import { Bucket } from 'sst/node/bucket';

const s3 = new S3Client({});

type Result = {
    content: Buffer | null;
    filename: { filename: string; encoding: string; mimeType: string };
    contentType: string | null | undefined;
};

const sendResponse = (statusCode: number, body: any) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    };
    return response;
};

function getFile(event: any) {
    const busboy = Busboy({ headers: event.headers });
    const result: Result = { content: null, filename: { filename: '', encoding: '', mimeType: '' }, contentType: null };

    return new Promise((resolve, reject) => {
        busboy.on('file', (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
            file.on('data', (data: any) => {
                result.content = data;
                console.log('got data... ' + data.length + ' bytes');
            });

            file.on('end', () => {
                result.filename = filename;
                result.contentType = mimetype;
                resolve(result);
            });
        });

        busboy.on('error', (error) => reject(error));
        busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary');
        busboy.end();
    });
}

export const handler = async (event: APIGatewayProxyEvent) => {
    if (!('ImageUpload' in Bucket)) {
        return;
    }
    const bucket = Bucket.ImageUpload as S3Bucket;

    const file = await getFile(event);

    try {
        const key = `${v4()}.${(file as Result).filename.filename.split('.')[1]}`;
        const params = {
            ContentType: (file as Result).filename.mimeType,
            ACL: 'public-read',
            Bucket: bucket.bucketName,
            Body: (file as Result).content as Buffer,
            Key: key,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);

        const originalImage = `https://${bucket.bucketName}.s3.amazonaws.com/${key}`;

        const convertedImage = `https://${bucket.bucketName}.s3.amazonaws.com/400w-${key.split('.')[0]}.webp`;

        return sendResponse(200, {
            message: 'File sent!',
            originalImage: originalImage,
            convertedImage: convertedImage,
        });
    } catch (err) {
        return sendResponse(500, { message: err as Error });
    }
};
