const routes = require('express').Router()
const seedZero = require('../seeds/seedZeroHashes')
const append = require('../seeds/testAppend')
const updateImage = require('../seeds/updateImage')
// const hasLeaf = require('../services/hasLeaf')

routes.post('/zeroHashes', seedZero)
routes.post('/append', append)
// routes.post('/verify', hasLeaf)
routes.get('/updateImage', updateImage)

module.exports = routes