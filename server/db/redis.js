const util = require('util')
const mongoose = require('mongoose')
const redis = require('redis')
const client = redis.createClient(process.env.REDIS_URL)

client.hget = util.promisify(client.hget)

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.cache = function(options = {}) {
  this.enableCache = true
  this.hashKey = JSON.stringify(options.key || 'default')

  return this
}

mongoose.Query.prototype.exec = async function() {
  if (!this.enableCache) {
    return await exec.apply(this, arguments)
  }

  const key = await JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  )

  const cachedValue = await client.hget(this.hashKey, key)

  if (cachedValue) {
    const doc = await JSON.parse(cachedValue)
    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc)
  }
  const result = await exec.apply(this, arguments)
  client.hmset(this.hashKey, key, JSON.stringify(result), 'EX', 300)

  return result
}
module.exports = {
  clearCache(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}
