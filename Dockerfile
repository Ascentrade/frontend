FROM alpine:edge AS builder

COPY . /src/
WORKDIR /src/

RUN apk add --no-cache npm && \
    npm install && \
    npm run build

FROM caddy:alpine

COPY --from=builder /src/dist /usr/share/caddy
WORKDIR /usr/share/caddy/
