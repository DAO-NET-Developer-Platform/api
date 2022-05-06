const Decision = require('../models/Decision')
const Option = require('../models/Option')
const LanguageOption = require('../models/LanguageOption')

class DecisionController {

    static async createVoteDecision(data) {
        data.type = 'Vote'
        return await Decision.create(data)
    }

    static async getVoteDecisions(vote, lang) {

        const options = await Option.find({ type: 'Vote' }).lean()

        let lang_options = []

        await Promise.all(options.map(async (el, i) => {
            const decisions = await Decision.find({ $and: [{ vote, option: el._id }] }).lean()

            if(!decisions) return

            if(lang) {
                const lang_option = await LanguageOption.findOne({ option: el._id }).lean()

                lang_option.voteCount = decisions.length
                lang_options.push(lang_option)
            }

            options[i].voteCount = decisions.length
        }))

        if(lang) return lang_options

        return options

    }

}

module.exports = DecisionController