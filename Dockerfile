# Specify node version
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*json ./

RUN npm install

COPY src .
EXPOSE 8080
CMD [ "node", "index.js" ]
