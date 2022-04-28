const routes = require('express').Router();
const user = require('../controllers/user.controller');
// const check = require('../middlewares/user.check')

routes.post('/', user.createUser)
routes.get('/', user.all)

module.exports = routes