const routes = require('express').Router();
const vote = require('../controllers/vote.controller');
const validator = require('../middlewares/validator')
const schemas = require('../validators/vote.validator')
const globalCheck = require('../middlewares/check')
const check = require('../middlewares/voteCheck')

//vote
routes.get('/:organization_id', [globalCheck.getLang], vote.all)
routes.post('/:organization_id', [validator(schemas.create), check.organization, check.user], vote.create)

routes.get('/single/:id', [globalCheck.getLang], vote.single)

// routes.put('/:id', vote.update)
// routes.delete('/:id', vote.delete)


//get voters
routes.get('/:id/voters')

module.exports = routes

