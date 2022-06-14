const Decision = require('../models/Decision')
const Option = require('../models/Option')
const LanguageOption = require('../models/LanguageOption')
const Member = require('../models/Member')
const createError = require('http-errors')

class DecisionController {

    static async createVoteDecision(data) {
        data.type = 'Vote'
        return await Decision.create(data)
    }

    static async getVoteDecisions(vote, lang, user) {

        const options = await Option.find({ type: 'Vote' }).lean()

        let lang_options = []

        await Promise.all(options.map(async (el, i) => {

            const decisions = await Decision.find({ $and: [{ vote, option: el._id }] }).lean()
            const isVoted = await Decision.find({ $and: [{ vote, user, option: el._id }] }).lean()

            if(lang) {
                const lang_option = await LanguageOption.findOne({ option: el._id }).lean()
                lang_option.voteCount = decisions.length
                lang_options.push(lang_option)
            }

            options[i].voteCount = decisions.length
            options[i].isVoted = !!isVoted.length
        }))

        if(lang) return lang_options

        return options

    }

    static async getAllVoters(vote, data) {

        let allDecisions

        if(data.lang) {
            //get lang options
            const langOptions = await LanguageOption.find({ language: data.lang }).lean()

            allDecisions = await Decision.find({ vote, type: 'Vote' }).lean()

            await Promise.all(allDecisions.map((el, i) => {
                const option = langOptions.find((opt) => 
                    opt.option.toString() == el.option.toString()
                )
                allDecisions[i].option = option
            }))

        } else {
            allDecisions = await Decision.find({ vote, type: 'Vote' }).populate('option').lean()
        }

        await Promise.all(allDecisions.map(async(el, i) => {
            if(el.address == data.address) allDecisions[i].isMe = true
        }))

        return allDecisions

    }

    static async createBudgetDecision(data) {

        data.type = 'Budget'

        const member = await Member.findById(data.member).lean()

        console.log(data)

        const decision = await Decision.findOne({ $and: [{ address: data.address, vote: data.vote }] }).lean()

        // amount/available_percentage * unspent

        if(data.amount > member.votingPower) throw createError.UnprocessableEntity('Invalid percenatage')

        if(decision !== null) throw createError.UnprocessableEntity(`Can't allocate more than once`)

        // if(decision !== null) {

        //     //increase decision by amount

        //     decision.percent = decision.percent == null ? 0 : decision.percent
        //     data.percent = decision.percent + parseInt(data.amount) //15 + 20 = 35

        //     data.amount = (parseInt(data.amount) / parseInt(member.votingPower)) * parseInt(member.unspent) // 20/85 * 85 = 20

        //     data.amount = parseInt(data.amount) + decision.amount //20 + 15 = 35

        //     const votingPower = parseInt(member.votingPower) - parseInt(data.amount)

        //     await Decision.findByIdAndUpdate(decision._id, {
        //         amount: data.amount,
        //         percent: data.percent
        //     }, {
        //         new: true
        //     })

        //     const unspent = parseInt(member.unspent) - parseInt(data.amount)

        //     await Member.findByIdAndUpdate(data.member, {
        //         unspent,
        //         votingPower,
        //     }, {
        //         new: true
        //     })

        //     return
            
        // }

        data.percent = data.amount


        data.amount = (parseInt(data.percent) / parseInt(member.votingPower)) * parseInt(member.unspent)

        const votingPower = parseInt(member.votingPower) - parseInt(data.percent)

        await Decision.create(data) 

        const unspent = parseInt(member.unspent) - parseInt(data.amount)

        await Member.findByIdAndUpdate(data.member, {
            unspent,
            votingPower,
        }, {
            new: true
        })
        
        return
        

    }

}

module.exports = DecisionController 