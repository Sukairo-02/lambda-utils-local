FROM public.ecr.aws/lambda/nodejs:18-arm64

COPY . ${LAMBDA_TASK_ROOT}

CMD ["build/index.handler"]