FROM public.ecr.aws/lambda/nodejs:18

ENV PATH /opt/node_app/node_modules/.bin:$PATH
ENV NODE_ENV production
ENV AWS_NODEJS_CONNECTION_REUSE_ENABLED 1
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN yum install wget curl -y
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
RUN yum install ./google-chrome-stable_current_*.rpm -y

COPY package.json ${LAMBDA_TASK_ROOT}
COPY build ${LAMBDA_TASK_ROOT}

RUN npm install
RUN npm prune --production
RUN npm cache clean --force

CMD ["node", "build/index.handler"]