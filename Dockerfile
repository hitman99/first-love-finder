FROM node:9.2-alpine

WORKDIR /usr/src/first-love-finder

COPY . .

CMD ["npm", "start"]