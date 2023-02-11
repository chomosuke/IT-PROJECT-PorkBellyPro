FROM node:16-alpine as builder
WORKDIR /app
COPY ./ ./
RUN npm ci
RUN npm run build
CMD npm start -- -c $DB_STRING -s $SECRET_KEY -p $PORT
