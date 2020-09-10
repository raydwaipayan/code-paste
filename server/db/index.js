const mongoose = require('mongoose')

require('./models/Paste.js')
require('./models/Key.js')
require('./redis.js')

mongoose.connect(process.env.MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

module.exports = mongoose
