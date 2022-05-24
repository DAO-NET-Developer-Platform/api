const organization = require('../services/organization.service')
const Budget = require('../models/Budget')
const createError = require('http-errors')
const budget = require('../services/budget.service')


module.exports = {

    async organization(req, res, next) {

        const id = req.params.organization_id

        const check = await organization.find(id)

        if(check == null) return next(createError.NotFound('No such organization'))

        return next()

    },

    async isPending(req, res, next) {

        const approved = await budget.isPending(req.params.organization_id, req.body.budgetItem)

        if(approved == null) return next(createError('Budget is active'))

        return next()
    },

    async decided(req, res, next) {

        const decision = await budget.decided(req.body.budgetItem, req.query.address)

        if(decision != null) return next(createError('Cannot approve more than once'))

        return next()

    },

    async getOrgId(req, res, next) {

        const org = await organization.findBy('slug', req.params.organization_slug)

        if(!org) return next(createError.NotFound('No such organization'))

        req.params.id = org._id

        return next()

    }

}