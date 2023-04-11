# Shopping Cart API

## Docker Setup

- Run `docker-compose buid`
- Run `docker-compose up`

## Local Setup

- Install Node.js v18 LTS
- Startup local/remote MongoDB instance
- Replace with env variables or manually MONGO_URI in migrate-mongo-config and app.js files
- Run `npm install`
- Run `npm run migration:up` to initialize collections and seed application data
- Run `npm run start`
