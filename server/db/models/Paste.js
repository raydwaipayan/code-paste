const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Paste = new Schema({
  code: String,
  key: String,
  lang: String,
  exprires: { type: Date, default: null },
  accessed: { type: Number, default: 0 },
  deleteOnAccess: { type: Boolean, default: false }
})

const model = mongoose.model('Paste', Paste)

module.exports = model
