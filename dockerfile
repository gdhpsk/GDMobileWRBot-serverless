FROM node:22
WORKDIR /app
COPY package*.json ./
COPY . .
EXPOSE 5000
CMD node index.js