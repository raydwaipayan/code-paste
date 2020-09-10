const Agenda = require('agenda')
const Paste = require('../db/models/Paste')

const agenda = new Agenda({ db: { address: process.env.MONGO_URI } })

agenda.define('delete record', async (job) => {
  await Paste.findOneAndRemove({ key: job.attrs.data.key })
})

module.exports = agenda
