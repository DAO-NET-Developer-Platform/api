const routes = require('express').Router()
const seedZero = require('../seeds/seedZeroHashes')
const append = require('../seeds/testAppend')
// const hasLeaf = require('../services/hasLeaf')

routes.post('/zeroHashes', seedZero)
routes.post('/append', append)
// routes.post('/verify', hasLeaf)

module.exports = routes