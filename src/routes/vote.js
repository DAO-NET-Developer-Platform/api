const routes = require('express').Router();
const vote = require('../controllers/vote.controller');

//vote
routes.get('/:organization_id', vote.all)
routes.post('/:organization_id', vote.create)

routes.get('/single/:id', vote.single)
routes.put('/:id', vote.update)
routes.delete('/:id', vote.delete)


//get voters
routes.get('/:id/voters')

module.exports = routes

