const routes = require('express').Router()

routes.get('/')


routes.post('/')
routes.get('/:id')
routes.put('/:id')
routes.delete('/:id')

//search
routes.post('/search/:organization_id')



module.exports = routes