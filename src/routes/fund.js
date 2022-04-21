const routes = require('express').Router();
const fund = require('../controllers/fund.controller');

//fund
routes.get('/:id', fund.getFunds)
routes.post('/:id', fund.fundDao)

module.exports = routes