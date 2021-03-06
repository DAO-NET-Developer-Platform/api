const Member = require('../models/Member')
const createError = require('http-errors')
const memberService = require('../services/member.service')
const organization = require('../services/organization.service')

module.exports = {

    async isMember(req, res, next) {

       const member = await memberService.isMember(req.params.organization_id, req.query.address)

       if(member == null) return next(createError.NotFound('Invalid user'))

    //    console.log(member)

    //    req.body.member = member._id,
       req.body.user = member.user

       return next()

    },

    async isPending(req, res, next) {

        const member = await memberService.isPending(req.params.organization_id, req.body.member)

        console.log(member)

        if(member == null) return next(createError.NotFound('Member already exist'))

        return next()

    },

    async decided(req, res, next) {

        const decision = await memberService.decided(req.body.member, req.query.address)

        if(decision != null) return next(createError.NotFound('Cannot approve more than once'))

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