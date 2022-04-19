const routes = require('express').Router()

//vote
routes.post('/:id/vote')
routes.get('/:id/vote')

module.exports = routes

