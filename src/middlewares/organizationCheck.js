const organization = require('../services/organization.service')
const createError = require('http-errors')
const User = require('../models/User')

module.exports = {

    async user(req, res, next) {

        const address = req.body.creator

        const check = await User.findOne({ address }).lean()

        if(check == null) return next(createError.NotFound('Invalid credentials'))

        return next()

    },

    async validOrganization(req, res, next) {

        const id = req.params.id

        const check = await organization.find(id)

        if(check == null) return next(createError.NotFound('No such organization'))

        return next()

    },

    async organizationName(req, res, next) {

        const name = req.body.name

        const check = await organization.findBy('name', name)

        if(check !== null) return next(createError.NotFound('Organization name Exist'))

        return next()

    },

    async isMember(req, res, next) {

        if(!req.query.address) return next()

        const member = await organization.isMember(req.query.address, req.params.id)

        // if(!member) return next(createError.Unauthorized('Invalid Credentials'))

        req.isMember = member == null ? false : true
        req.memberStatus = member != null ? member.status : null

        return next()

    },

    async getOrgId(req, res, next) {

        const org = await organization.findBy('slug', req.params.slug)

        if(!org) return next(createError.NotFound('No such organization'))

        req.params.id = org._id

        return next()

    },

    // async getUser() {

    // }

}