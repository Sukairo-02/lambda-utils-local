import { Bucket as S3Bucket } from 'aws-cdk-lib/aws-s3';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { PDFDocument, TextAlignment } from 'pdf-lib';

import { ApiHandler, useBody } from 'sst/node/api';
import { Bucket } from 'sst/node/bucket';

const s3 = new S3Client({});

const sendResponse = (statusCode: any, body: any) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/pdf',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
    };
    return response;
};

async function readStreamFromS3({ Bucket, Key }: { Bucket: string; Key: string }) {
    const commandPullObject = new GetObjectCommand({
        Bucket,
        Key,
    });
    const response = await s3.send(commandPullObject);

    return response;
}

export const handler = ApiHandler(async (event) => {
    if (!('uploads' in Bucket)) {
        return;
    }
    const bucket = Bucket.uploads as S3Bucket;
    const date = new Date().toUTCString();

    const body = JSON.parse((useBody() as string).toString());
    try {
        const template = await readStreamFromS3({ Bucket: bucket.bucketName, Key: body.certificateTemplate });
        const templateString = await template.Body?.transformToString('base64');

        const pdfDoc = await PDFDocument.load(templateString as string);

        const form = pdfDoc.getForm();
        form.getTextField('name').setAlignment(TextAlignment.Left);
        form.getTextField('name').setText(body.name);
        form.getTextField('date').setAlignment(TextAlignment.Left);
        form.getTextField('date').setText(date);

        form.flatten();

        const pdfOut = await pdfDoc.saveAsBase64();

        const key = `images/${body.name}-${new Date().toUTCString()}.pdf`;
        const params = {
            // contentType: 'multipart/form-data',
            Bucket: bucket.bucketName,
            Body: Buffer.from(pdfOut, 'base64'),
            Key: key,
        };
        const command = new PutObjectCommand(params);
        await s3.send(command);

        return {
            statusCode: 200,
            body: pdfOut,
            isBase64Encoded: true,
            headers: {
                'Content-Type': 'application/pdf',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        return sendResponse(500, { message: err as Error });
    }
});
