const router = require('express').Router()
const fetch = require('node-fetch')
const moment = require('moment')
const Paste = require('../db/models/Paste')
const agenda = require('../utils/agenda')
const { clearCache } = require('../db/redis')

const { expiry, expiryAgenda, expirySeconds } = require('../constants')

router.get('/getExpiry', function(req, res) {
  res.json({ expiryTimes: expiry })
})

router.post('/create', async function(req, res) {
  const { customKey, expiryIndex, code } = req.body

  const url = process.env.BASE_URL + '/kgs/getKey?'
  const params = new URLSearchParams({ key: customKey })

  try {
    const resp = await fetch(url + params)
    const json = await resp.json()
    const key = json.key

    if (expiryIndex === 0) {
      await Paste.create({
        code,
        key,
        deleteOnAccess: true
      })
    } else {
      const addTime = expirySeconds[expiryIndex]
      const exptime = moment().add(addTime, 'seconds')

      await Paste.create({
        code,
        key,
        expires: moment(exptime, 'X').toISOString()
      })
      await agenda.schedule(expiryAgenda[expiryIndex], 'delete record', {
        key
      })
    }

    res.json({
      url: process.env.BASE_URL + '/pastes/' + key,
      message: 'Success'
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
})
router.get('/pastes/:key', async function(req, res) {
  const { key } = req.params

  if (!(await Paste.exists({ key }))) {
    return res.status(404).send({ message: 'Error! Paste not found.' })
  }

  const paste = await Paste.findOne({ key }).cache({ key })
  res.json(paste)

  try {
    clearCache(key)
    if (paste.deleteOnAccess) {
      if (paste.accessed >= 1) {
        await Paste.findOneAndRemove({ key })
        return
      }
    }
    await Paste.findByIdAndUpdate(paste._id, {
      accessed: paste.accessed + 1
    })
  } catch (error) {}
})
module.exports = router
