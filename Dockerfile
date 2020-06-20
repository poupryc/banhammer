FROM arm64v8/node:14-alpine AS builder

LABEL maintainer="HelloEdit <corentin.poupry@protonmail.com>"

WORKDIR /home/node/app
COPY . .

RUN yarn install --ignore-optional \
  && yarn run build \
  && yarn install --prefer-offline --production

FROM arm64v8/node:14-alpine

ENV NODE_ENV=production

WORKDIR /home/node/app

COPY package.json .
COPY --from=builder /home/node/app/dist/src ./src
COPY --from=builder /home/node/app/node_modules ./node_modules/

CMD ["node", "./src/index.js"]
