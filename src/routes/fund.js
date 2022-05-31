const routes = require('express').Router();
const fund = require('../controllers/fund.controller');
const validator = require('../middlewares/validator')
const schemas = require('../validators/fund.validator')
const check = require('../middlewares/fundCheck')

//fund
// routes.get('/:organization_slug', fund.getFunds)
routes.post('/:organization_slug', [validator(schemas.fund), check.getOrgId, check.organization], fund.fundDao)

module.exports = routes