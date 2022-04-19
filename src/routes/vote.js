const routes = require('express').Router()

//vote
routes.post('/:id')
routes.get('/:id')

//get voters
routes.get('/:id/voters')

module.exports = routes

