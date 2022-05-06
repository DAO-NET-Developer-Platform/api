const routes = require('express').Router();
const member = require('../controllers/member.controller');
const check = require('../middlewares/memberCheck')

routes.get('/:organization_id', member.getMembers)
routes.post('/:organization_id/approve', [check.isMember, check.isPending, check.decided], member.approve)

module.exports = routes