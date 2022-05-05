const routes = require('express').Router()
const budget = require('../controllers/budget.controller')
const validator = require('../middlewares/validator')
const schemas = require('../validators/budget.validator')
const check = require('../middlewares/budgetCheck')
const memberCheck = require('../middlewares/memberCheck')

routes.get('/:organization_id', check.organization, budget.all)
routes.post('/:organization_id', [validator(schemas.create), check.organization], budget.create)

routes.post('/:organization_id/approve', [memberCheck.isMember, check.isPending, check.decided], budget.approve)

routes.get('/single/:id', budget.single)

// routes.put('/single/:id', budget.update)
// routes.delete('/single/:id', budget.delete)

//search
routes.post('/search', budget.search)

module.exports = routes