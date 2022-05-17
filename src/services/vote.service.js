const Vote = require('../models/Vote')
const LanguageVote = require('../models/LanguageVote')
const { uploadFile, retrieve } = require('../connectors/web3.storage')
const language = require('../services/language.service')

class VoteService {

    static async all(id, language) {

        // console.log(language, id)

        if(!language) return await Vote.find({organization: id}).lean()

        const vote = await LanguageVote.find({ $and: [{ language, organization: id }] }).populate('vote').lean()

        await Promise.all(vote.map((el, i) => {
            vote[i].status = el.vote.status
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
}

module.exports = VoteService