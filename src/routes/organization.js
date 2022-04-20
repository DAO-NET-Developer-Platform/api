const routes = require('express').Router()
const organization = require('../controllers/organization.controller')

routes.get('/', organization.getAll)
routes.post('/', organization.create)

routes.get('/:id', organization.single)
routes.put('/:id', organization.update)
routes.delete('/:id', organization.delete)


//search
routes.post('/search')

//join
routes.post('/:id/join')
routes.post('/:id/leave')


module.exports = routes