

ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

USER node

EXPOSE 3000

CMD npm start
