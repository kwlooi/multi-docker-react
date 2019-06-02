# builder stage to generate the build folder for the application
FROM node:alpine AS builder
WORKDIR /app
COPY package.json .
RUN npm install
# copy only the source files to the container
COPY src src
COPY public public
RUN npm run build

# run stage copies the build folder from the builder stage to a prod nginx container
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
