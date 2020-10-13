const { User } = require("../../models")
const {
  isEmpty,
  isEmail,
  isUnique,
  isContains,
  isLength,
  comparePassword,
} = require("./validationSnippets")

async function register(fields) {
  try {
    let isError = false
    Object.keys(fields).forEach((key) => {
      let field = { value: fields[key], msg: [] }
      if (key === "bio") {
        fields[key] = field
      } else {
        fields[key] = isEmpty(field, "This field cannot be empty!")
        if (fields[key].msg.length) {
          isError = true
        }
      }
    })
    if (isError) {
      return { ...fields, isError }
    }

    let { username, email, password, bio } = fields

    email = isEmail(email, "Email is not correct!")
    username = isLength(username, {
      min: 4,
      max: 15,
      minMsg: "Username must contain at least 4 characters!",
      maxMsg: "Username must be no more than 15 characters!",
    })
    password = isLength(password, {
      min: 4,
      max: 25,
      minMsg: "Password must contain at least 4 characters!",
      maxMsg: "Password must be no more than 25 characters!",
    })
    bio = isLength(bio, {
      max: 60,
      maxMsg: "Bio must be no more than 60 characters!",
    })
    if (
      email.msg.length ||
      username.msg.length ||
      password.msg.length ||
      bio.msg.length
    ) {
      return { username, email, password, bio, isError: true }
    }

    email = await isUnique(
      fields.email,
      "This email already exists, choose another one!",
      User,
      "email"
    )
    username = await isUnique(
      fields.username,
      "This username already exists, choose another one!",
      User,
      "username"
    )
    if (email.msg.length || username.msg.length) {
      return { username, email, password, bio, isError: true }
    }

    return { username, email, password, bio, isError: false }
  } catch (error) {
    console.log(`Register validation error: ${error.message}`)
  }
}

async function login(fields) {
  try {
    let isError = false
    Object.keys(fields).forEach((key) => {
      fields[key] = isEmpty(
        { value: fields[key], msg: [] },
        "This field cannot be empty!"
      )
      if (fields[key].msg.length) {
        isError = true
      }
    })
    if (isError) {
      return { ...fields, isError }
    }

    let { email, password } = fields

    email = isEmail(email, "Email is not correct!")
    password = isLength(password, {
      min: 4,
      max: 25,
      minMsg: "Password must contain at least 4 characters!",
      maxMsg: "Password must be no more than 25 characters!",
    })
    if (email.msg.length || password.msg.length) {
      return { email, password, isError: true }
    }

    const { instance, field: emailVerified } = await isContains(
      email,
      "This email is not exists, choose another one!",
      User,
      "email"
    )
    if (instance) {
      let { passwordVerified, isSimilar } = await comparePassword(
        password,
        instance.password,
        "Password is wrong, please try again!"
      )
      const resultVerification = {
        email: emailVerified,
        password: passwordVerified,
      }
      if (!isSimilar) {
        return { isError: true, ...resultVerification }
      }
      return { isError: false, ...resultVerification, instance }
    } else {
      return { email: emailVerified, password, isError: true }
    }
  } catch (error) {
    console.log(`Login validation error: ${error.message}`)
  }
}

module.exports = {
  loginValid: login,
  registerValid: register,
}
