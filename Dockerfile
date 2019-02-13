FROM node:alpine

WORKDIR /usr/src/chatapp

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 4200

CMD [ "npm", "start" ]

