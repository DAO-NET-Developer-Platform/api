const routes = require('express').Router();
const member = require('../controllers/member.controller');

routes.get('/:id', member.getMember)

module.exports = routes