const routes = require('express').Router();
const vote = require('../controllers/vote.controller');
const validator = require('../middlewares/validator')
const schemas = require('../validators/vote.validator')
const globalCheck = require('../middlewares/check')
const check = require('../middlewares/voteCheck')

//vote
routes.get('/:organization_slug', [check.getOrgId, check.isUser, globalCheck.getLang], vote.all)
routes.post('/:organization_slug', [validator(schemas.create), check.getOrgId, check.organization, check.user], vote.create)

routes.get('/single/:id', [globalCheck.getLang], vote.single)

// routes.put('/:id', vote.update)
// routes.delete('/:id', vote.delete)


//get voters
routes.post('/:organization_slug/search', check.getOrgId, vote.search)

module.exports = routes

