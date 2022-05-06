const routes = require('express').Router()
const option = require('../controllers/option.controller')
const globalCheck = require('../middlewares/check')

routes.post('/migrate', option.create)
routes.get('/', [globalCheck.typeOptions, globalCheck.getLang], option.all)

module.exports = routes