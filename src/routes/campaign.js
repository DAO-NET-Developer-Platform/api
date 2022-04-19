const routes = require('express').Router()

routes.get('/')
routes.post('/')
routes.get('/:id')
routes.put('/:id')
routes.delete('/:id')


//search
routes.post('/search')

//join
routes.post('/:id/join')
routes.post('/:id/leave')


module.exports = routes