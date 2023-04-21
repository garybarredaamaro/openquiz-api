const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
  username: String,
  password: String,
  profile: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = model('User', userSchema)