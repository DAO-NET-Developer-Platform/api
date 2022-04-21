const routes = require('express').Router()
const budget = require('../controllers/budget.controller')

routes.get('/:organization_id', budget.all)
routes.post('/:organization_id', budget.create)

routes.get('/single/:id', budget.single)
routes.put('/single/:id', budget.update)
routes.delete('/single/:id', budget.delete)

//search
routes.post('/search', budget.search)

module.exports = routes