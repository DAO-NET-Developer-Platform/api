const routes = require('express').Router();
const member = require('../controllers/member.controller');
const check = require('../middlewares/memberCheck')

routes.get('/:organization_slug', check.getOrgId, member.getMembers)
routes.post('/:organization_slug/approve', [check.getOrgId, check.isMember, check.isPending, check.decided], member.approve)

module.exports = routes