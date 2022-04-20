const routes = require('express').Router();
const organization = require('../routes/organization')
const budget = require('../routes/budget')
const member = require('../routes/member')
const user = require('../routes/user')
const vote = require('../routes/vote')
const fund = require('../routes/fund')
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
