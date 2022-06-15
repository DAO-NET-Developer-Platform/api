const routes = require('express').Router()
const webhook = require('../controllers/webhook.controller')


routes.post('/funding', webhook.payment)
routes.get('/funding', webhook.payment)


module.exports = routes