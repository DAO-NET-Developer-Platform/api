const routes = require('express').Router()
const seedZero = require('../seeds/seedZeroHashes')

routes.post('/zeroHashes', seedZero)

module.exports = routes