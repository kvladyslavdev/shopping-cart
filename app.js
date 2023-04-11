const mongoose = require('mongoose');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const { typeDefs } = require('./src/graphql/schema');
const { resolvers } = require('./src/graphql/resolvers');

const server = new ApolloServer({ typeDefs, resolvers });

(async function init() {
  await mongoose.connect(process.env.MONGO_URI);

  const { url } = await startStandaloneServer(server, {
    listen: { port: process.env.PORT },
  });

  console.log(`🚀  Server ready at ${url}`);
})();
