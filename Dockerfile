FROM alpine:edge AS builder

COPY . /src/
WORKDIR /src/

ENV VITE_GRAPHQL_URL=https://ascentrade.app/graphql

RUN apk add --no-cache npm && \
    npm install && \
    npm run build

FROM caddy:alpine

COPY --from=builder /src/dist /usr/share/caddy
WORKDIR /usr/share/caddy/
