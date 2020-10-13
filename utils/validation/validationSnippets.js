const bcrypt = require("bcrypt")

function isEmpty(field, msg) {
  if (!field.value.trim()) {
    field.msg.push(msg)
  }
  return field
}

function isEmail(field, msg) {
  let patern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

  if (!field.value.match(patern)) {
    field.msg.push(msg)
  }
  return field
}

async function isUnique(field, msg, Model, prop) {
  try {
    const collection = await Model.find({ [prop]: field.value })

    if (collection.length) {
      field.msg.push(msg)
    }

    return field
  } catch (error) {
    console.log(`Error isUnique: ${error.message}`)
  }
}

function isLength(field, { min, max, minMsg, maxMsg }) {
  if (field.value.length < min) {
    field.msg.push(minMsg)
  } else if (field.value.length > max) {
    field.msg.push(maxMsg)
  }
  return field
}

async function isContains(field, msg, Model, prop) {
  try {
    const instance = await Model.findOne({ [prop]: field.value })
    if (!instance) {
      field.msg.push(msg)
    }
    return { instance, field }
  } catch (error) {
    console.log(`Error isContains: ${error.message}`)
  }
}

async function comparePassword(password, hashedPassword, msg) {
  try {
    const isValid = await bcrypt.compare(password.value, hashedPassword)
    if (!isValid) {
      password.msg.push(msg)
      return { passwordVerified: password, isSimilar: false }
    }
    return { passwordVerified: password, isSimilar: true }
  } catch (error) {
    console.log(`Compare password error: ${error.message}`)
  }
}

module.exports = {
  isEmpty,
  isEmail,
  isUnique,
  isContains,
  isLength,
  comparePassword,
}
