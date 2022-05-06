const Language = require('../models/Language')
const createError = require('http-errors')
const db = require('../connectors/knex')
const Option = require('../models/Option')
const Organization = require('../models/Organization')
const Vote = require('../models/Vote')
const memberService = require('../services/member.service')
const User = require('../models/User')
const LanguageVote = require('../models/LanguageVote')

module.exports = {

    async isUser(req, res, next) {

        const { address } = req.query
        if(!address) return next(createError.NotFound('Invalid credentials'))

        const check = await User.findOne({ address }).lean()
        if(check == null) return next(createError.NotFound('Invalid credentials'))

        return next()
    
    },
    
    async isMember(req, res, next) {
    
        //check the vote_id
        let { vote_id } = req.params

        if(req.query.lang) {
            const lang_vote = await LanguageVote.findById(req.params.vote_id)
            if(!lang_vote) return next(createError.NotFound('No such Vote'))
            vote_id = lang_vote.vote
        }

        const vote = await Vote.findById(vote_id)
        if(!vote) return next(createError.NotFound('No such Vote'))

        //get organization check if address is a member
        const organization = await Organization.findById(vote.organization)
        if(!organization) return next(createError.NotFound('No such Organization'))

        //check membership
        const member = await memberService.isMember(organization._id, req.query.address)
        if(!member) return (createError.Unauthorized('Must be a member'))

        req.body.organization = organization._id
        req.body.member = member._id
        req.body.user = member.user,
        req.body.address = req.query.address
        req.body.vote = vote._id

        return next()
    
    },

    async getLangVote(req, res, next) {

        if(!req.query.lang) return next()

        const lang_vote = await LanguageVote.findById(req.params.vote_id)
        if(!lang_vote) return next(createError.NotFound('No such Vote'))
        vote_id = lang_vote.vote

        const vote = await Vote.findById(vote_id)
        if(!vote) return next(createError.NotFound('No such Vote'))

        req.params.vote_id = vote._id

        return next()

    }

}
