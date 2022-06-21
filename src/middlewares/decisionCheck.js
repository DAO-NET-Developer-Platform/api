const Language = require('../models/Language')
const createError = require('http-errors')
const db = require('../connectors/knex')
const Option = require('../models/Option')
const Organization = require('../models/Organization')
const Vote = require('../models/Vote')
const memberService = require('../services/member.service')
const User = require('../models/User')
const LanguageVote = require('../models/LanguageVote')
const LanguageOption = require('../models/LanguageOption')
const Decision = require('../models/Decision')

module.exports = {

    async isUser(req, res, next) {

        const { address } = req.query
        
        if(!address) return next()

        const check = await User.findOne({ address }).lean()
        if(check == null) return next(createError.NotFound('Invalid credentials'))


        req.params.user_id = check._id

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
        if(!member) return next(createError.Unauthorized('Must be a member'))

        req.body.organization = organization._id
        req.body.member = member._id
        req.body.user = member.user,
        req.body.address = req.query.address
        req.body.vote = vote._id

        return next()
    
    },

    async getLangVote(req, res, next) {

        let vote_id = req.params.vote_id

        if(req.query.lang) {
            const lang_vote = await LanguageVote.findById(req.params.vote_id).lean()
            if(!lang_vote) return next(createError.NotFound('No such Vote'))
            vote_id = lang_vote.vote
        }

        const vote = await Vote.findById(vote_id).lean()
        if(!vote) return next(createError.NotFound('No such Vote'))

        req.params.vote_id = vote._id

        return next()

    },

    async getLangOption(req, res, next) {

        let option_id = req.body.option

        if(req.query.lang) {
            const lang_option = await LanguageOption.findById(option_id)
            if(!lang_option) return next(createError.NotFound('No such option'))
            option_id = lang_option.option
        }

        const option = await Option.findById(option_id)
        if(!option) return next(createError.NotFound('No such option'))

        req.body.option = option._id

        return next()

    },

    //check if user has previously voted
    async hasDecided(req, res, next) {

        const { address } = req.query
        const { vote_id } = req.params

        console.log(vote_id)

        const decision = await Decision.findOne({ $and: [{ address, vote: vote_id }] }).lean()

        if(decision !== null) return next(createError.BadRequest('Cannot Decide more than once'))

        return next()

    },

    async checkDeadLine(req, res, next) {

        const vote = await Vote.findById(req.params.vote_id).lean()

        if(new Date() > new Date(vote.endDate)) return next('Vote has Ended')

        if(new Date() < new Date(vote.startDate)) return next('Vote has not started')

        return next()

    },

    async isPending(req, res, next) {

        const vote = await Vote.findOne({ id: req.params.vote_id }).lean()

        console.log(vote)


        if(vote.status == 'pending') return next(createError.BadRequest('Cannot vote on pending budget item'))

        return next()

    }

}
