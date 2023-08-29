import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// chrome-aws-lambda handles loading locally vs from the Layer

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { badRequest } from "@hapi/boom";
import { GeneratorOptions } from "./types";
import schema from "./schema";

// This is the path to the local Chromium binary
const YOUR_LOCAL_CHROMIUM_PATH =
  "/tmp/localChromium/chromium/mac-1165945/chrome-mac/Chromium.app/Contents/MacOS/Chromium";

const pdfgen = async (
  html: URL | Buffer | string,
  options?: GeneratorOptions
) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: process.env.IS_LOCAL
      ? YOUR_LOCAL_CHROMIUM_PATH
      : await chromium.executablePath(),
    headless: chromium.headless,
  });

  const page = await browser.newPage();

  try {
    if (html instanceof URL) {
      await page.goto(html.toString(), { waitUntil: "networkidle0" });
    } else {
      await page.setContent(html.toString(), { waitUntil: "domcontentloaded" });
    }

    await page.emulateMediaType("screen");

    let pdf: Buffer;

    try {
      pdf = await page.pdf(options);
    } catch (err) {
      if (err && typeof err === "object") throw badRequest((<any>err).message);

      throw err;
    }

    return pdf;
  } catch (e) {
    throw e;
  }
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  if (!event.body) throw badRequest("Invalid input");
  let bodyObj: any;

  try {
    bodyObj = JSON.parse(event.body);
  } catch (e) {
    throw badRequest("Unable to parse body: Invalid JSON.");
  }


  const parseResult = schema.safeParse(bodyObj);
  if (!parseResult.success)
    throw badRequest("Invalid input", parseResult.error.errors);


  const { source, config } = parseResult.data;


  const pdf = await pdfgen(source, config);

  return {
    statusCode: 200,
    body: pdf.toString("base64"),
    headers: {
      "Content-Type": "application/pdf",
    },
    isBase64Encoded: true,
  };
};
