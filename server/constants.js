const expiry = [
  'First View',
  '30 minutes',
  '1 hour',
  '2 hours',
  '12 hours',
  '24 hours'
]
const expirySeconds = [0, 30 * 60, 3600, 3600 * 2, 3600 * 12, 3600 * 24]
const expiryAgenda = [
  '',
  'in 30 minutes',
  'in 60 minutes',
  'in 2 hours',
  'in 12 hours',
  'in 24 hours'
]
module.exports = { expiry, expirySeconds, expiryAgenda }
