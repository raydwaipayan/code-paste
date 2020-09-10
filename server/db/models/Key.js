const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Key = new Schema({
  key: { type: String, unique: true },
  used: { type: Boolean, default: false }
})

const model = mongoose.model('Key', Key)

module.exports = model
