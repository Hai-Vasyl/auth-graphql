const express = require("express")
const { ApolloServer, gql } = require("apollo-server-express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const { typeDefs, resolvers } = require("./graphql")
const isAuth = require("./context/isAuth")
require("dotenv").config()
const { PORT = 4000, MONGO_PASS, MONGO_USER, NODE_ENV } = process.env

const startServer = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.osxef.mongodb.net/auth-db?retryWrites=true&w=majority`,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
      () => console.log("MongoDB started!")
    )

    const app = express()
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: NODE_ENV === "development",
      context: ({ req }) => {
        return { isAuth: isAuth(req) }
      },
    })
    server.applyMiddleware({ app })

    app.listen(PORT, () => console.log(`Server started on port: ${PORT}!`))
  } catch (error) {
    console.log(`Server error: ${error.message}`)
  }
}

startServer()
