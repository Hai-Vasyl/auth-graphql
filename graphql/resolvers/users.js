const { User, Todo } = require("../../models")
const {
  registerValid,
  loginValid,
} = require("../../utils/validation/authValidation")
const { AuthenticationError } = require("apollo-server-express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
require("dotenv").config()
const { JWT_SECRET } = process.env

module.exports = {
  Query: {
    async register(_, args) {
      try {
        const validatedFields = await registerValid(args)
        if (validatedFields.isError) {
          throw new Error(JSON.stringify(validatedFields))
        }

        const { username, email, password, bio } = args

        const hashedPassword = await bcrypt.hash(password.value, 12)
        const user = await User.create({
          username: username.value,
          email: email.value,
          bio: bio.value,
          password: hashedPassword,
        })
        const token = jwt.sign({ userId: user._id }, JWT_SECRET)

        return { user, token }
      } catch (error) {
        throw new AuthenticationError(error.message)
      }
    },
    async login(_, args) {
      try {
        const validatedFields = await loginValid(args)
        if (validatedFields.isError) {
          throw new Error(JSON.stringify(validatedFields))
        }

        const { instance: user } = validatedFields
        const token = jwt.sign({ userId: user._id }, JWT_SECRET)

        return { user, token }
      } catch (error) {
        throw new AuthenticationError(error.message)
      }
    },
  },
  Mutation: {
    async addTodo(_, args, { isAuth }) {
      try {
        if (!isAuth) {
          throw new Error("Access denied!")
        }
        // const {task, owner} = args
        return await Todo.create({ ...args })
      } catch (error) {
        console.log(`Add new todo error: ${error.message}`)
      }
    },
  },
}
