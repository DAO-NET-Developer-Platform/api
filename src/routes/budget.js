const routes = require('express').Router()
const budget = require('../controllers/budget.controller')
const validator = require('../middlewares/validator')
const schemas = require('../validators/budget.validator')
const check = require('../middlewares/budgetCheck')
const memberCheck = require('../middlewares/memberCheck')


routes.get('/:organization_slug', check.getOrgId, check.organization, budget.all)

//add identityCommitment middleware
routes.post('/:organization_slug', [validator(schemas.create), check.getOrgId, check.organization, check.addEndDate], budget.create)

routes.post('/:organization_slug/approve', [check.getOrgId, memberCheck.isMember, check.isPending, check.decided], budget.approve)

routes.get('/single/:id', budget.single)


//search
routes.post('/:organization_slug/search', check.getOrgId, budget.search)

module.exports = routes