const organization = require('../services/organization.service')
const Budget = require('../models/Budget')
const createError = require('http-errors')


module.exports = {

    async organization(req, res, next) {

        const id = req.params.organization_id

        const check = await organization.find(id)

        if(check == null) return next(createError.NotFound('No such organization'))

        return next()

    }

}