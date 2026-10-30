FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run package

FROM scratch AS package
COPY --from=build /app/release/ /

FROM nginx:1.29-alpine
COPY nginx/pendientes.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html/pendientes
EXPOSE 80
