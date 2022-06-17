const Vote = require('../models/Vote')
const LanguageVote = require('../models/LanguageVote')
const { uploadFile, retrieve } = require('../connectors/web3.storage')
const language = require('../services/language.service')
const Decision = require('../models/Decision')
const createError = require('http-errors')
const Member = require('../models/Member')

class VoteService {

    static async all(id, user, query) {

        // console.log(language, id)

        // const { language, page } = query

        const percents = []

        let page, language

        if(query) {
            page = query.page
            language = query.language
        }

        if(!language) {

            let vote

            if(!page) {
                vote = await Vote.find({organization: id}).lean()
            } else {
                const data = query.criteria ?  await this.search(id, query) :  await Vote.paginate({ $and: [{ organization: id, status: "active" }]}, {
                    page,
                    limit: 12,
                    lean: true
                })

                vote = data.docs ? data.docs : data
            }

            await Promise.all(vote.map(async (el, i) => {
                if(user) {
                    const isVoted = await Decision.find({ $and: [{ vote: el._id, user }] }).lean()
    
                    vote[i].isVoted = !!isVoted.length
                }
                //check for percentage
                if(el.type == 'Budget') {

                    vote[i].percentage = await this.calculatePercentage(el._id)
                    percents.push(vote[i].percentage)

                }
            }))

            vote.unshift({
                treasuryPercent: 100 - percents.reduce((a, b) => { return a + b }, 0)
            })

            return vote
        }

        let vote

        if(!page) {
            vote = await LanguageVote.find({ $and: [{ language, organization: id }] }).populate('vote').lean()
        } else {

            query.language = language

            const data = query.criteria ? await this.langSearch(id, query) : await LanguageVote.paginate({ $and: [{ language, organization: id }] }, {
                page,
                limit: 12,
                populate: 'vote',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            vote = data.docs != null ? data.docs : data
        }

        await Promise.all(vote.map(async (el, i) => {

            vote[i].status = el.vote.status
            vote[i].image = el.vote.image
            if(user) {
                const isVoted = await Decision.find({ $and: [{ vote: el.vote._id, user }] }).lean()
                vote[i].isVoted = !!isVoted.length
            }

            if(el.vote.type == 'Budget') {

                vote[i].percentage = await this.calculatePercentage(el.vote._id)
                percents.push(vote[i].percentage)

            }
        }))

        
        vote.unshift({
            treasuryPercent: 100 - percents.reduce((a, b) => { return a + b }, 0)
        })

        return vote

    }

    static async create(data) {

        // if(data.image) {

        //     const { cid, image } = await uploadFile(data.image.tempFilePath)
        //     data.cid = cid
        //     data.image = image

        // }

        const languages = await language.all()

        const vote = await Vote.create(data)

        await Promise.all(languages.map(async (el, i) => {

            const [ title, description ] = await Promise.all([language.translate(data.title, el.code), language.translate(data.description, el.code)])

            const lang_data = {
                vote: vote._id,
                title,
                description,
                organization: data.organization,
                language: el._id,
                // image: data.image
                // status: data.status
            }

            return LanguageVote.create(lang_data)
        }))
        
        return vote

    }

    static async single(id, user, language) {


        if(!language) {
            const vote =  await Vote.findById(id).lean()

            const voteDetails =  await this.myVotePercent(vote._id, user)
            // console.log(voteDetails)
            vote.isVoted = voteDetails.isVoted
            vote.myPercent = voteDetails.percent
            vote.votingPower = await this.getRemainingVote(vote.organization, user)
            return vote
        }

        const vote = await LanguageVote.findOne({ $and: [{ language, vote: id }] }).populate('vote').lean()

        // console.log(vote)
        // console.log(vote != null, user, vote.vote.type == "Budget")

        if(vote != null && user && vote.vote.type == "Budget") {
            const voteDetails =  await this.myVotePercent(vote.vote._id, user)
            vote.isVoted = voteDetails.isVoted
            vote.myPercent = voteDetails.percent
            vote.votingPower = await this.getRemainingVote(vote.vote.organization, user)
        }

        vote.status = vote.vote.status

        return vote

    }

    static async createVoteOptions() {

        // const options = [ 'Yes, i support', '' ]

    }

    static async search(id, data) {

        const criterias = [ 'all', 'budget', 'vote', 'voted' ]

        let { search, criteria, address, page } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid criteria')

        let results

        search = search == null ? '' : search

        //search all budgets
        if(criteria == 'all') {

            results = await Vote.paginate({
                $and: [{
                    organization: id, title: { $regex: new RegExp(`${search}`), $options: 'i'}
                }]
            }, {
                page,
                limit: 12,
                populate: 'vote',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            return results.docs
        }

        //search budget votes only
        if(criteria == 'budget') {

            results = await Vote.paginate({ $and: [{
                organization: id, type: 'Budget', title: { $regex: new RegExp(`${search}`), $options: 'i'}
            }] }, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })
            
            return results.docs

        }

        if(criteria == 'vote') {

            results = await Vote.paginate({  $and: [{
                organization: id, type: null, title: { $regex: new RegExp(`${search}`), $options: 'i'}
            }] }, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })
            
            return results

        }

        if(criteria == 'voted') {

            results = await Decision.paginate({ $and: [{ address, organization: id }] }, { 
                page,
                limit: 12,
                populate: {
                    path: 'vote',
                    match: {
                        title: { $regex: new RegExp(`${search}`), $options: 'i'}
                    }
                },
                lean: true,
                sort: { createdAt: 'desc' }
            })
    
            results.docs.map((el, i) => {
                el.vote != null ? results.docs[i] = el.vote : delete results.docs[i]
            })
    
            results = results.docs.filter((el, i) => {
                return el != null
            })

            // return results
    
            const groupname = []
    
            await Promise.all(results.map(async (el, i) => {
                if(groupname.includes(el._id.toString())) {
                    delete results[i]
                    return
                }
                groupname.push(el._id.toString())
                results[i] = el
            }))
    
            results = results.filter((el, i) => {
                return el != null
            })
    
            return results

        }

    }

    static async langSearch(id, data) {

        const criterias = [ 'all', 'budget', 'vote', 'voted' ]

        let { search, criteria, address, page, language } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid criteria')

        let results

        search = search == null ? '' : search

        //search all budgets
        if(criteria == 'all') {

            results = await LanguageVote.paginate({
                $and: [{
                    language, organization: id, title: { $regex: new RegExp(`${search}`), $options: 'i'}
                }]
            }, {
                page,
                limit: 12,
                populate: 'vote',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            return results.docs
        }

        //search budget votes only
        if(criteria == 'budget') {

            results = await LanguageVote.paginate({ $and: [{
                language, organization: id, type: 'Budget', title: { $regex: new RegExp(`${search}`), $options: 'i'}
            }] }, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })
            
            return results.docs

        }

        if(criteria == 'vote') {

            results = await LanguageVote.paginate({  $and: [{
                language, organization: id, type: null, title: { $regex: new RegExp(`${search}`), $options: 'i'}
            }] }, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })
            
            return results.docs

        }

        if(criteria == 'voted') {

            const aggregate = Decision.aggregate([

                { 
                    $lookup: {
                        from: "languagevotes",
                        localField: "vote",    // field in the Decision collection
                        foreignField: "vote",  //field in the LanguageVote collection
                        as: "LanguageVotes"
                    },
                },

                {
                    $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$LanguageVotes", 0 ] }, "$$ROOT" ] } }
                },

                { $project: { LanguageVotes: 0 } },

                {
                    $match: {
                        title: { $regex: new RegExp(`${search}`), $options: 'i'}
                    }
                },

                {
                    $group: {
                        _id: '$vote'
                    }
                }
            ])

            results = await Decision.aggregatePaginate(aggregate, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })

            await Promise.all(results.docs.map(async (el, i) => results.docs[i] = await LanguageVote.findOne({ vote: el._id, language }).populate('vote').lean()))
            
            return results

        }

    }

    static async calculatePercentage(vote) {

        const decision = await Decision.find({ $and: [{type: 'Budget', vote, done: false}] }).lean()

        const percents = decision.map(el => el.percent)

        //get average
        if(!percents.length) return 0

        const total = percents.reduce((a, b) => {
            if(!a) a = 0
            if(!b) b = 0
            return parseInt(a) + parseInt(b)
        }, 0)

        return Math.round(total/decision.length)

    }

    static async myVotePercent(vote, address) {

        const myVote = await Decision.findOne({ $and: [{ type: "Budget", vote, address }] }).lean()

        if(myVote == null) return { isVoted: false, percent: 0}

        return { isVoted: true, percent: myVote.percent == null ? 0 : myVote.percent }
    }

    static async getRemainingVote(id, address) {
        const member = await Member.findOne({ $and: [{ organization: id, address }] }).lean()
        return member == null ? null : member.votingPower
    }
 }

module.exports = VoteService