const routes = require('express').Router()
const language = require('../controllers/language.controller')

routes.get('/', language.all)
routes.post('/migrate', language.migrate)

module.exports = routes