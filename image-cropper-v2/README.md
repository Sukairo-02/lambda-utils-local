# Image Cropper v2

Utility to crop to square and convert images to `.webp` format

## Usage

To use utility, `PUT` image to `%apiUrl%/`

```Typescript
type Input = {
    body: {
        height?: number // positive number
        width?: number // positive number
        image: string // base64-encoded image
    }
}

type Output = {
    body: {
        image: string // base64-encoded image
    }
}
```

## Deployment

1.  `cd` to `/packages/functions/`
2.  `npm run build`
3.  `cd` to `/image-cropper-v2/`
4.  Deploy app via `npm run deploy`
