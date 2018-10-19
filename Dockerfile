FROM arm64v8/node:10-alpine AS builder

LABEL maintainer="HelloEdit <corentin.poupry@protonmail.com>"

WORKDIR /home/node/app
COPY . .

RUN yarn install --ignore-optional && yarn run build

# Run image
FROM arm64v8/node:10-alpine

ENV NODE_ENV=production

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./

COPY --from=builder /home/node/app/dist/src ./src

RUN yarn install --prefer-offline --production

CMD ["node", "./src/index.js"]