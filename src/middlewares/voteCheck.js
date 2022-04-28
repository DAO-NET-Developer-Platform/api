const organization = require('../services/organization.service')
const Vote = require('../models/Budget')
const createError = require('http-errors')
const User = require('../models/User')

module.exports = {

    async organization(req, res, next) {

        const id = req.params.organization_id

        const check = await organization.find(id)

        if(check == null) return next(createError.NotFound('No such organization'))

        return next()

    },

    async user(req, res, next) {

        const { creator } = req.body

        const check = await User.findOne({ address: creator }).lean()

        if(check == null) return next(createError.Unauthorized('Invalid Credentials'))

        return next()      

    }

}