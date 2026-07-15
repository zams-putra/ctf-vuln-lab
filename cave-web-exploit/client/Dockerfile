FROM node:22 AS buildernya
WORKDIR /client
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM nginx
COPY --from=buildernya /client/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD [ "nginx", "-g", "daemon off;" ]