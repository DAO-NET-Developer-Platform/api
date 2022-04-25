const routes = require('express').Router();
const member = require('../controllers/member.controller');

routes.get('/:organization_id', member.getMembers)

module.exports = routes