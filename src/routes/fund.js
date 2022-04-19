const routes = require('express').Router()

//fund
routes.get('/:id/fund')
routes.post('/:id/fund')

module.exports = routes