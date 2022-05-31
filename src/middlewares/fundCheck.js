const organization = require('../services/organization.service')
const Budget = require('../models/Budget')
const createError = require('http-errors')
const budget = require('../services/budget.service')


module.exports = {

    async organization(req, res, next) {

        const id = req.params.organization_id

        // console.log(id)

        const check = await organization.find(id)

        if(check == null) return next(createError.NotFound('No such organization'))

        return next()

    },

    async getOrgId(req, res, next) {

        const org = await organization.findBy('slug', req.params.organization_slug)

        // console.log(org)

        if(!org) return next(createError.NotFound('No such organization'))

        req.params.organization_id = org._id

        return next()

    }

}