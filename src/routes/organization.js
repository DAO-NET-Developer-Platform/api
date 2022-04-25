const routes = require('express').Router()
const validator = require('../middlewares/validator')
const schemas = require('../validators/organization.validator')

const organization = require('../controllers/organization.controller')

routes.get('/', organization.all)
routes.post('/', [validator(schemas.create)], organization.create)

routes.get('/:id', organization.single)
routes.put('/:id', organization.update)
routes.delete('/:id', organization.delete)


//search
routes.post('/search', organization.search)

//join
routes.post('/:id/join', organization.join)

routes.post('/:id/leave/:member_id', organization.leave)


module.exports = routes