const routes = require('express').Router()
const seedZero = require('../seeds/seedZeroHashes')
const append = require('../seeds/testAppend')

routes.post('/zeroHashes', seedZero)
routes.post('/append', append)
module.exports = routes