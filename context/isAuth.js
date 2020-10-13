const jwt = require("jsonwebtoken")
require("dotenv").config()
const { JWT_SECRET } = process.env

module.exports = (req) => {
  const auth = req.headers.authorization
  if (!auth) {
    return false
  }
  const token = auth.split(" ")[1]
  if (!token) {
    return false
  }

  let decodedToken
  try {
    const { userId } = jwt.verify(token, JWT_SECRET)
    decodedToken = userId
  } catch (error) {
    return false
  }
  if (!decodedToken) {
    return false
  }

  return { isAuth: true, userId: decodedToken }
}
