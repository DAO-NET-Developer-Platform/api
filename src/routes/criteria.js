const routes = require('express').Router()
const criteria = require('../controllers/criteria.controller')

// routes.post('/', criteria.create)
routes.get('/', criteria.all)

module.exports = routes