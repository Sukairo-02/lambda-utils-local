# Lambda Utils

Collection of utils

### Deployment

To deploy the utils, you need to configurate your `AWS CLI`, then follow the next steps:

1.  `npm i`
2.  `npm run build`
3.  `npm run deploy`

### Limits

`Request` and `Response` payloads are limited to `5Mb` and `30s` by `API Gateway`.  
Exceeding the limits may result in `413`, `500`, `502` errors.

## Image Cropper

-   `POST /crop-image`

    -   General

        Operations that will be used on image are determined by fields passed in input's `config`.  
        The order of operations is always `crop` => `resize` => `convert` => `compress`.

        -   Crop

            Crop operation allows you to extract selected region of image by specifying starting point and region's size.  
            Region must not go out of image's bounds.

        -   Resize

            Resize operation allows you to rescale your image and\or change it's aspect ratio.  
            If only one of dimensions is specified, original aspect ratio is preserved;  
            otherwise, image is cropped to fit the specified dimensions.

        -   Convert

            Convert allows you to select output image's format.  
            Do not specify it to retain original format.

        -   Compress

            Compress operation attempts applying compression options to an image.  
            Only supported by output format options will be applied (i.e. don't expect `jpeg` to be `lossless`).  
            If `convert` isn't specified, compression is attempted using source image's format.

    -   Input

        ```Typescript
        type Input = {
            config: {
                crop?: {
                    top: number; // non-negative integer
                    left: number; // non-negative integer
                    height: number; // positive integer
                    width: number; // positive integer
                };
                resize?: {
                    height?: number; // positive integer
                    width?: number; // positive integer
                };
                convert?: {
                    format: "jpeg" | "png" | "webp";
                };
                compress?: {
                    quality?: number; // [1-100] range
                    lossless?: boolean;
                };
            };

            image: File;
        }
        ```

        Input must be passed as `multipart/form-data`;  
        `config` object must be JSON-stringified.  
        Only one file per request is supported.

    -   Output

        ```Typescript
        type Output = string
        ```

        Result image is returned as `base64`-encoded string, it gets decoded back into image by browsers automatically.

## PDF Generator

-   `POST /generate-pdf`

    -   Input

        ```Typescript
        type Input = {
            source: URL | string | Buffer;
            pdfOptions?: {
                scale?: number; // Must be in [0.1 - 2] range
                displayHeaderFooter?: boolean;
                printBackground?: boolean;
                landscape?: boolean;
                pageRanges?: string;
                format?: "letter" | "legal" | "tabloid" | "ledger" | "a0" | "a1" | "a2" | "a3" | "a4" | "a5" | "a6";  // case-insensitive
                width?: string | number;
                height?: string | number;
                preferCSSPageSize?: boolean;
                margin?: {
                    top?: string | number;
                    bottom?: string | number;
                    left?: string | number;
                    right?: string | number;
                };
                omitBackground?: boolean;
                timeout?: number;
            };
            browserOptions?: {
                secondaryRenderAwait?: boolean;
                adBlocker?: boolean;
                width?: number; // Must be in [240-1920] range
                height?: number; // Must be in [240-1920] range
            };
        }

        ```

        -   `source` - Link to webpage or HTML string to be converted to `pdf`.  
            :warning: Invalid links will be resolved as HTML.

        -   `pdfOptions`

            -   `scale` - Scales the rendering of the web page.  
                Amount must be between `0.1` and `2`.  
                `Default`: `1`

            -   `displayHeaderFooter` - Whether to show the header and footer.  
                `Default`: `false`

            -   `headerTemplate`, `footerTemplate` - HTML template for the print header\footer.  
                Should be valid HTML with the following classes used to inject values into them:

                -   `date` - formatted print date.

                -   `title` - document title.

                -   `url` - document location.

                -   `pageNumber` - current page number.

                -   `totalPages` - total pages in the document.

                :warning: `margin` must be set for them to not be overlayed by main content.

            -   `printBackground` - Whether to print background graphics.  
                `Default`: `true`

            -   `landscape` - Whether to print in landscape orientation.  
                `Default`: `false`

            -   `pageRanges` - Paper ranges to print, e.g. `1-5, 8, 11-13`.  
                Empty value means all pages are printed.  
                `Default`: `undefined`

            -   `format` - Paper format of `pdf`.  
                :warning: If set, this takes priority over the `width` and `height` options.  
                `Default`: `'letter'`

            -   `width` - Sets the width of paper.  
                :warning: You can pass in a number or a string with a unit.  
                `Default`: `undefined`

            -   `height` - Sets the height of paper.  
                :warning: You can pass in a number or a string with a unit.  
                `Default`: `undefined`

            -   `preferCSSPageSize` - Give any CSS `@page` size declared in the page priority over what is declared in the `width` or `height` or `format` options.  
                `Default`: `undefined`

            -   `margin` - Set the PDF margins.  
                :warning: You can pass in numbers or strings with units.  
                `Default`: `undefined`

            -   `omitBackground` - Hides default white background and allows generating pdfs with transparency.  
                `Default`: `false`

            -   `timeout` - Timeout in milliseconds.  
                :warning:Pass `0` to disable timeout.  
                `Default`: `30_000`

        -   `browserOptions`

            -   `secondaryRenderAwait` - Whether to attempt to await for additional renders on a page.  
                `Default`: `false`

            -   `adBlocker` - Whether to attempt to block ads and cookie consent popups.  
                `Default`: `false`

            -   `width`, `height` - Custom viewport dimensions.  
                :speech_balloon:It is recommended to match viewport dimensiont to `pdf` output dimensions.  
                `Default`: `1920`, `1080`

    -   Output

        ```Typescript
        type Output = string
        ```

        Result dociment is returned as `base64`-encoded string, it gets decoded back into `pdf` by browsers automatically.

## Node Mailer

-   `POST /send-mail`

    -   Input

        ```Typescript
        type Input = {
            credentials: {
                user: string;
                pass: string;
            };
            mail: {
                to: string;
                subject: string;
                text: string;
                html?: string;
            };
        }
        ```

        -   `credentials` - Credentials of a `Gmail` account you want to send a message from.

            -   `user` - Email

            -   `pass` - [Application password](https://support.google.com/accounts/answer/185833?hl=en)

        -   `mail`

            -   `to` - Recipient of the e-mail.

            -   `subject` - The subject of the e-mail.

            -   `text` - The `plaintext` version of the message.

            -   `html` - The `HTML` version of the message.

    -   Output

        ```Typescript
            type Output = {
                message: string
            }
        ```
