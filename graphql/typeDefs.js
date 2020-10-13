const { gql } = require("apollo-server-express")

module.exports = gql`
  type User {
    username: String!
    email: String!
    password: String!
    bio: String
    todos: [Todo]!
  }
  type Todo {
    task: String!
    completed: Boolean!
    owner: User!
  }
  type Auth {
    token: String
    user: User
  }
  type Query {
    user(id: ID!): User!
    users: [User!]!
    login(email: String!, password: String!): Auth
    register(
      username: String!
      email: String!
      password: String!
      bio: String
    ): Auth
    todos(owner: ID!): [Todo]!
    todo(id: ID!): Todo!
  }
  type Mutation {
    addTodo(task: String!, owner: ID!): Todo!
    removeTodo(id: ID!): Todo!
    updateTodo(id: ID!, task: String, completed: Boolean): Todo!
    removeUser(id: ID!): User!
    updateUser(id: ID!, username: String, email: String, bio: String): User!
  }
`
