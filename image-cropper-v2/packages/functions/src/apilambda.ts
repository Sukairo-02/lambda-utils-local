import {  APIGatewayProxyStructuredResultV2 } from "aws-lambda";
// import { ApiHandler } from "sst/node/api";
import { cropFunction } from "./crop";

export const handler = async (evt: APIGatewayProxyStructuredResultV2) => {
    if (!evt.body) {
        return {
            statusCode: 500,
            body: "No body",
        };
    }

    const body = JSON.parse(evt.body)

    if (!body.image) {
        return {
            statusCode: 500,
            body: "No image",
        };
    }

    const imageBuffer = Buffer.from(body.image, 'base64')

    const formattedBuffer = await cropFunction(imageBuffer)

    const formattedImageBase64 = formattedBuffer.toString('base64')

    return {
        statusCode: 200,
        body: formattedImageBase64,
        headers: {
            "Content-Type": "image/webp",
        },
        isBase64Encoded: true,
    };
}
