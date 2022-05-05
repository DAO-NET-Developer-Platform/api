const Member = require('../models/Member')
const createError = require('http-errors')
const memberService = require('../services/member.service')

module.exports = {

    async isMember(req, res, next) {

       const member = await memberService.isMember(req.params.organization_id, req.query.address)

       console.log(member)

       if(member == null) return next(createError.NotFound('Invalid user'))

       return next()

    },

    async isPending(req, res, next) {

        const member = await memberService.isPending(req.params.organization_id, req.body.member)

        if(member == null) return next(createError.NotFound('Member already exist'))

        return next()

    },

    async decided(req, res, next) {

        const decision = await memberService.decided(req.body.member, req.query.address)

        if(decision == null) return next(createError.NotFound('Cannot approve more than once'))

        // return next()

    }



}