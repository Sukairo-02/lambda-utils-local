FROM node:18-alpine as builder

ENV NODE_ENV build

COPY src ./src 
COPY package.json ./package.json
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.paths.json ./tsconfig.paths.json

RUN npm i
RUN npx tsc
RUN npm prune --production

FROM zenika/alpine-chrome:89-with-node-18

USER root

COPY --from=builder package*.json ./
COPY --from=builder dist ./dist
COPY --from=builder node_modules ./node_modules

ENV NODE_ENV production

CMD ["node", "dist/app.js"]
