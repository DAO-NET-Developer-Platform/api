const routes = require('express').Router();
const fund = require('../controllers/fund.controller');
const validator = require('../middlewares/validator')
const schemas = require('../validators/fund.validator')
const check = require('../middlewares/fundCheck')

//fund
// routes.get('/:organization_slug', fund.getFunds)
routes.post('/:organization_slug', [validator(schemas.fund), check.getOrgId, check.organization], fund.fundDao)
routes.post('/budget/:budget_id', [validator(schemas.fund)], fund.fundBudget)

module.exports = routes