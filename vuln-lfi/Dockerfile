FROM node:16-alpine

WORKDIR /app

COPY . .

RUN npm install

RUN mkdir -p /home/robert && cp flag.txt /home/robert

EXPOSE 8000

CMD [ "node", "index.js" ]