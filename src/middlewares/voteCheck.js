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

    },

    async getOrgId(req, res, next) {

        const org = await organization.findBy('slug', req.params.organization_slug)

        // console.log(org)

        if(!org) return next(createError.NotFound('No such organization'))

        req.params.organization_id = org._id

        return next()

    },

    async isUser(req, res, next) {

        const { address } = req.query

        if(!address) return next()

        const check = await User.findOne({ address }).lean()
        if(check == null) return next(createError.NotFound('Invalid credentials'))


        req.params.user_id = check._id

        return next()
    
    },

    async addEndDate(req, res, next) {

        if(req.body.deadline <= 1) return next(createError.UnprocessableEntity('invalid Deadline'))

        const endDate = Date.now() + parseInt(req.body.deadline) * 24 * 60 * 60 * 1000

        req.body.endDate = new Date(endDate)

        return next()

    }

}