const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const hashPasswordAsync = async (password) => {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
}

const isPasswordMatchAsync = async (password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}

const getJwtToken= (payload, secretKey) => {
  const token = jwt.sign(payload, secretKey)
  return token
}

module.exports = {
  hashPasswordAsync,
  isPasswordMatchAsync,
  getJwtToken
}