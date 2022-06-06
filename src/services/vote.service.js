const Vote = require('../models/Vote')
const LanguageVote = require('../models/LanguageVote')
const { uploadFile, retrieve } = require('../connectors/web3.storage')
const language = require('../services/language.service')
const Decision = require('../models/Decision')
const createError = require('http-errors')

class VoteService {

    static async all(id, user, query) {

        // console.log(language, id)

        const { language, page } = query

        if(query.title) return this.search(id, query)

        if(!language) {

            let vote

            if(!page) {
                vote = await Vote.find({organization: id}).lean()
            } else {
                const data = await Vote.paginate({organization: id}, {
                    page,
                    limit: 12,
                    lean: true
                })

                vote = data.docs
            }

            await Promise.all(vote.map(async (el, i) => {
                if(user) {
                    const isVoted = await Decision.find({ $and: [{ vote: el._id, user }] }).lean()
    
                    vote[i].isVoted = !!isVoted.length
                }
                //check for percentage
                if(vote.type == 'budget') {

                } else {
                    vote[i].percentage == null
                }
            }))

            return vote
        }

        let vote

        if(!page) {
            vote = await LanguageVote.find({ $and: [{ language, organization: id }] }).populate('vote').lean()
        } else {
            const data = await LanguageVote.paginate({ $and: [{ language, organization: id }] }, {
                page,
                limit: 12,
                populate: 'vote',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            vote = data.docs
        }


        await Promise.all(vote.map(async (el, i) => {
            vote[i].status = el.vote.status
            if(user) {
                const isVoted = await Decision.find({ $and: [{ vote: el.vote._id, user }] }).lean()
                vote[i].isVoted = !!isVoted.length
            }
        }))

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
                // status: data.status
            }

            return LanguageVote.create(lang_data)
        }))
        
        return vote

    }

    static async single(id, language) {

        if(!language) return await Vote.findById(id).lean()

        const vote = await LanguageVote.findOne({ $and: [{ language, vote: id }] }).populate('vote').lean()

        vote.status = vote.vote.status

        return vote

    }

    static async createVoteOptions() {

        // const options = [ 'Yes, i support', '' ]

    }

    static async search(id, data) {

        const criterias = [ 'all', 'budget', 'vote', 'voted' ]

        const { title, criteria, address, page } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid criteria')

        let results

        //search all budgets
        if(criteria == 'all') {

            results = await Vote.paginate({
                $and: [{
                    organization: id, title: { $regex: new RegExp(`${title}`), $options: 'i'}
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
                organization: id, type: 'Budget', title: { $regex: new RegExp(`${title}`), $options: 'i'}
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
                organization: id, type: null, title: { $regex: new RegExp(`${title}`), $options: 'i'}
            }] }, {
                page,
                limit: 12,
                lean: true,
                sort: { createdAt: 'desc' }
            })
            
            return results.docs

        }

        if(criteria == 'voted') {

            results = await Decision.paginate({ $and: [{ address, organization: id }] }, { 
                page,
                limit: 12,
                populate: {
                    path: 'vote',
                    match: {
                        title: { $regex: new RegExp(`${title}`), $options: 'i'}
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
}

module.exports = VoteService