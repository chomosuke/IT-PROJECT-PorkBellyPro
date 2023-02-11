FROM node:16 as builder
WORKDIR /app
COPY ./ ./
RUN npm ci
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD npm start -- -c $DB_STRING -s $SECRET_KEY -p $PORT
