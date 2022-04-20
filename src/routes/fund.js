const routes = require('express').Router();
const fund = require('../controllers/fund.controller');

//fund
routes.get('/:id/fund')
routes.post('/:id/fund')

module.exports = routes