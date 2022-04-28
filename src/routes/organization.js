const routes = require('express').Router()
const validator = require('../middlewares/validator')
const schemas = require('../validators/organization.validator')
const check = require('../middlewares/organizationCheck')
const generalCheck = require('../middlewares/check')

const organization = require('../controllers/organization.controller')

routes.get('/', organization.all)
routes.post('/', [validator(schemas.create), generalCheck.checkImage, check.user, check.organizationName], organization.create)
// routes.post('/lang_data', )

routes.get('/:id', [check.isMember, check.validOrganization], organization.single)

// routes.put('/:id', organization.update)
// routes.delete('/', organization.delete)


//search
routes.post('/search', organization.search)

//join
routes.post('/:id/join', [validator(schemas.join), check.validOrganization], organization.join)

// routes.post('/:id/leave/:member_id', organization.leave)


module.exports = routes