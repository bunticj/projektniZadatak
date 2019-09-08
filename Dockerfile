FROM node:11.4

WORKDIR /user/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3300

CMD ["npm", "start"]