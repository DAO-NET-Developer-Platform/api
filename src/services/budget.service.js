const Budget = require('../models/Budget')
const language = require('../services/language.service')
const Language = require('../models/Language')
const LanguageBudget = require('../models/LanguageBudget')
const organizationService = require('../services/organization.service')
const Organization = require('../models/Organization')
const Approval = require('../models/Approval')
const memberService = require('../services/member.service')
const User = require('../models/User')

class BudgetService {

    static async all(id, lang) {


        if(!lang) return await Budget.find({ organization: id }).populate('organization').lean()

        const language = await Language.findOne({ code: lang }).lean()

        return await LanguageBudget.find({ $and: [{language:  language._id, organization: id}] }).populate('budget').lean()

    }

    static async create(data) {

        const criteria = await this.getBudgetCriteria(data.organization)

        // const { cid, image } = await uploadFile(data.image.tempFilePath)

        // data.cid = cid
        // data.image = image

        const budget = await this.determineBudgetCreation(criteria, data)

        return budget

    }

    static async single(id, lang) {

        if(!lang) return (await Budget.findById(id)).toObject()

        const language = await Language.findOne({ code: lang }).lean()

        return await LanguageBudget.findOne({ $and:[{language:  language._id, budget: id }] }).populate('budget').lean()

    }

    static async search (data) {

    }

    static async getBudgetCriteria(id) {

        const organization = (await Organization.findById(id).populate('budgetCriteria')).toObject()

        return { criteria: organization.budgetCriteria.criteria, amount: organization.budgetCriteriaAmount }

    }

    static async determineBudgetCreation(criteria, data) {

        // console.log(criteria)

        data.status = "active"

        if(criteria.criteria.includes(`members' approval`)) {

            //create a vote for the the request
            data.status = 'pending'

        } else if(criteria.criteria == 'Anyone who pays the set fee') {

            if(!data.paymentHash) throw createError.Unauthorized('Please pay before joining Dao')

        }

        const languages = await language.all()

        const budget = await Budget.create(data)

        await Promise.all(languages.map(async (el, i) => {

            const [ title, description ] = await Promise.all([language.translate(data.title, el.code), language.translate(data.description, el.code)])

            const lang_data = {
                budget: budget._id,
                title,
                description,
                organization: data.organization,
                language: el._id,
                status: data.status
            }

            return LanguageBudget.create(lang_data)
        }))

        return budget

    }

    static async approve(organization_id, data) {
        /**
         * create a middleware to check membership
         */

        data.type = 'Budget'
        data.organization = data.organization_id

        //create approval

        await Approval.create(data)

        const { type, budgetItem } = data

        //find all membership approvals for member
        const approvals = await Approval.find({ $and: [ { type, budgetItem } ] })
    
        //find organization membership criteria
        const { criteria, amount } = await this.getBudgetCriteria(organization_id)

        let members = await memberService.getMembers(organization_id, null)

        members = members.filter((el) => el.status == "active")

        //check if criteria is met and approve accodingly
        let treshold = amount

        if(criteria.includes('By percentage')) {

        treshold = Math.round(members.length * Number(amount)/100)

        }

        approvals.length >= treshold ? await Budget.findByIdAndUpdate(budgetItem, {
        status: 'active'
        }, {
            new: true
        }) : null

        return
    }

    static async isPending(org_id, budgetItem) {

        return await Budget.findOne({ $and: [ { budgetItem, organization: org_id, status: 'pending' } ] }).lean()

    }

    static async decided(budgetItem, address) {

        const user = await User.findOne({ address }).lean()

        if(!user) return

        return await Approval.findOne({ $and: [ { budgetItem, user: user._id } ] }).lean()

    }

}

module.exports = BudgetService