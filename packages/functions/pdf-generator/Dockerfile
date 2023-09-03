FROM public.ecr.aws/lambda/nodejs:18


RUN npx @puppeteer/browsers install chromium@latest --path /tmp/localChromium

COPY . ${LAMBDA_TASK_ROOT}


RUN npm install

RUN sudo SOURCE_DATE_EPOCH=$(date +%s) fc-cache -rs

CMD ["build/index.handler"]
