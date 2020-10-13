const typeDefs = require("./typeDefs")
const users = require("./resolvers/users")

module.exports = {
  typeDefs,
  resolvers: {
    Query: {
      ...users.Query,
    },
    Mutation: {
      ...users.Mutation,
    },
  },
}
