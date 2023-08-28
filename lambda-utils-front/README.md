# Lambda utils front-end docs, using Astro + Svelte + SST Constructor.

## Deployment

To deploy, you will need at least Node.js 16.6 and npm 7. You also need to have an AWS account and AWS credentials configured locally.

### Test deployment

Follow this steps:

1.  `npm i`
2.  `npm run dev`
3.  `npm run start`

### Production deployment

Follow this steps:

1.  `npm i`
2.  `npx sst deploy --stage prod`

### Clean up

To remove the resources, created by this app run one of the following commands:

`npx sst remove` - to remove development stage recources.

`npx sst remove --stage prod` - to remove production stage resources.
