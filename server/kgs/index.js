const router = require('express').Router()
const crypt = require('crypto-random-string')
const Key = require('../db/models/Key')

router.get('/getKey', async function(req, res) {
  let key =
    req.query.key || req.query.key.length
      ? req.query.key
      : crypt({ length: 6, type: 'alphanumeric' })

  while (await Key.findOne({ key, used: true })) {
    key = crypt({ length: 6, type: 'alphanumeric' })
  }
  await Key.create({ key, used: true })
  res.json({ key })
})

module.exports = router
