const routes = require('express').Router();
const vote = require('../controllers/vote.controller');
const validator = require('../middlewares/validator')
const schemas = require('../validators/vote.validator')

//vote
routes.get('/:organization_id', vote.all)
routes.post('/:organization_id', [validator(schemas.create)], vote.create)

routes.get('/single/:id', vote.single)

routes.put('/:id', vote.update)
routes.delete('/:id', vote.delete)


//get voters
routes.get('/:id/voters')

module.exports = routes

