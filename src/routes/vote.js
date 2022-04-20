const routes = require('express').Router();
const vote = require('../controllers/vote.controller');

//vote
routes.post('/:id')
routes.get('/:id')

//get voters
routes.get('/:id/voters')

module.exports = routes

