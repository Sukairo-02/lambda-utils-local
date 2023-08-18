// src/crop.ts
import sharp from "sharp";
var cropFunction = async (image, config) => {
  let width, height;
  if (config) {
    width = config.width;
    height = config.height;
  } else {
    const defaultSize = 500;
    const { width: localWidth, height: localHeight } = await sharp(image).metadata();
    const min = localWidth && localHeight ? Math.min(localWidth, localHeight) : defaultSize;
    height = min;
    width = min;
  }
  if (!width || !height || width <= 0 || height <= 0)
    throw new Error("Image dimensions must be positive");
  const res = await sharp(image).resize({ width, height }).toFormat("webp").toBuffer();
  return res;
};

// src/apilambda.ts
var handler = async (evt) => {
  if (!evt.body) {
    return {
      statusCode: 500,
      body: "No body"
    };
  }
  const body = JSON.parse(evt.body);
  if (!body.image) {
    return {
      statusCode: 500,
      body: "No image"
    };
  }
  const imageBuffer = Buffer.from(body.image, "base64");
  const formattedBuffer = await cropFunction(imageBuffer);
  const formattedImageBase64 = formattedBuffer.toString("base64");
  return {
    statusCode: 200,
    body: formattedImageBase64,
    // body: imageBuffer.toString('base64'),
    headers: {
      "Content-Type": "image/webp"
    },
    isBase64Encoded: true
  };
};
export {
  handler
};
