# Lambda Utils

    Collection of utils

## Deployment

To deploy the utils, you need to configurate your `AWS CLI`, then follow the next steps:

1.  `npm i`
2.  `npm run build`
3.  `npm run deploy`

# Image cropper

## Usage

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
        type input = {
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
        type output = string
        ```

        Result image is returned as `base64`-encoded string, it gets decoded back into image by browsers automatically.

    -   Limits

        `Request` and `Response` payloads are limited to `5Mb` by `API Gateway`.  
        Exceeding the limits will\may result in `413`, `500`, `502` errors.
