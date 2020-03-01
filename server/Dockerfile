FROM node:alpine

WORKDIR /app

# copy the package.json only before build to reduce rebuild of the container layers
COPY ./package*.json ./
RUN npm install

# copy only the source files to the container
# COPY . .
COPY ./*.js ./

CMD [ "npm", "run", "start" ]