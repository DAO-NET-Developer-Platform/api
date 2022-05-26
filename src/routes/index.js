const routes = require('express').Router();
const organization = require('../routes/organization')
const budget = require('./budget')
const member = require('./member')
const user = require('./user')
const vote = require('./vote')
const fund = require('./fund')
const criteria = require('./criteria')
const language = require('./language')
const option = require('./option')
const decision = require('./decision')
// const seed = require('./seed')
const createError = require('http-errors')


routes.all("/", (req, res)=> {

    res.status(200).json({
        status: true,
        message: "DAO.net API v1.0"
    })
})

routes.use('/organization', organization)
routes.use('/budget', budget)
routes.use('/member', member)
routes.use('/vote', vote)
routes.use('/user', user)
routes.use('/fund', fund)
routes.use('/criteria', criteria)
routes.use('/language', language)
routes.use('/option', option)
routes.use('/decision', decision)
// routes.use('/seed', seed)

routes.use( async (req, res, next) => {
    next(createError.NotFound('Route not Found'))
})

routes.use( (err, req, res, next) => {
    res.status(err.status || 500).json({
        status: false,
        message: err.message
    })
})

module.exports = routes;
