FROM node:latest AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf