FROM public.ecr.aws/lambda/nodejs:18-arm64

COPY . ${LAMBDA_TASK_ROOT}

RUN npm cache clean --force
RUN rm -rf node_modules

RUN npm install
RUN SHARP_IGNORE_GLOBAL_LIBVIPS=1 npm install --arch=x64 --platform=linux sharp

CMD ["build/index.handler"]