const routes = require('express').Router();
const user = require('../controllers/user.controller');

routes.post('/', user.createUser)

module.exports = routes