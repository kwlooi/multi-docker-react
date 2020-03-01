# builder stage to generate the build folder for the application
FROM node:alpine AS builder
WORKDIR /app
COPY ./package*.json ./
RUN npm install

# copy only the source files to the container
# COPY . .
COPY src src
COPY public public
RUN npm run build

# run stage copies the build folder from the builder stage to a prod nginx container
# use second nginx server to serve up client react files
# see lession 141-143
FROM nginx
EXPOSE 3000
# copy the nginx config to second nginx server for client react files
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
# copy the builder output from /app/build to niginx root folder
COPY --from=builder /app/build /usr/share/nginx/html
