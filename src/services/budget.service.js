const Budget = require('../models/Budget')
const language = require('../services/language.service')
const Language = require('../models/Language')
const LanguageBudget = require('../models/LanguageBudget')
const organizationService = require('../services/organization.service')
const Organization = require('../models/Organization')
const Approval = require('../models/Approval')
const memberService = require('../services/member.service')
const User = require('../models/User')
const Vote = require('../models/Vote')
// const LanguageVote = require('../models/LanguageVote')
const vote = require('../services/vote.service')
const transactionService = require('./transaction.service')
const createError = require('http-errors')


class BudgetService {

    static async all(id, query) {

        const { lang, page } = query

        if(query.title) return this.search(id, query)

        if(!lang) {

            if(!page) return await Budget.find({ organization: id }).populate('organization').lean()

            const data = await Budget.paginate({ organization: id }, { 
                page,
                limit: 12,
                populate: 'organization',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            return data.docs

        } 

        const language = await Language.findOne({ code: lang }).lean()

        let budget

        if(!page) {

            budget = await LanguageBudget.find({ $and: [{language:  language._id, organization: id}] }).populate('budget').lean()

        } else {

            const data = await LanguageBudget.paginate({ $and: [{language:  language._id, organization: id}] }, { 
                page,
                limit: 12,
                populate: 'budget',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            budget = data.docs

        }

        await Promise.all(budget.map((el, i) => {
            budget[i].status = el.budget.status
        }))

        return budget

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
        
        const vote = await Vote.findOne({ budget: id }).lean()

        if(!lang) {

            const budget = (await Budget.findById(id)).toObject()
            budget.vote = vote._id

            return budget
        }

        const language = await Language.findOne({ code: lang }).lean()

        const budget = await LanguageBudget.findOne({ $and:[{language:  language._id, budget: id }] }).populate('budget').lean()

        budget.status = budget.budget.status
        budget.vote = vote._id

        return budget

    }

    static async search (id, data) {

        const criterias = [ 'active', 'all' ]

        const { title, criteria, address, page } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid criteria')

        let results

        //search all budgets
        if(criteria == 'all') {

            results = await Budget.paginate({
                $and: [{
                    organization: id, title: { $regex: new RegExp(`${title}`), $options: 'i'}
                }]
            }, { 
                page,
                limit: 12,
                populate: 'organization',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            return results.docs
        }

        //search active budgets
        results = await Budget.paginate({
            $and: [{
                organization: id, status: 'active', title: { $regex: new RegExp(`${title}`), $options: 'i'}
            }]
        }, { 
            page,
            limit: 12,
            populate: 'organization',
            lean: true,
            sort: { createdAt: 'desc' }
        })

        return results.docs

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

            if(!data.txHash) throw createError.Unauthorized('Please pay before creating a budget item')

            const transaction = await transactionService.checkTransaction(data.txHash)

            if(transaction == null) throw createError.Unauthorized('Invalid Hash')

            if(parseInt(transaction.outputs[0].amount[0].quantity) !== parseInt(criteria.amount * 1000000)) throw createError.Unauthorized('Invalid Quantity')

            transaction.type = 'Joining fee'
            transaction.amount = criteria.amount * 1000000

            await transactionService.createTransaction(transaction, data.organization)
        }

        if(data.status == 'active') data.endDate = this.addEndDate(data)
        
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
                // status: data.status
            }

            return LanguageBudget.create(lang_data)
        }))

        const vote_data = {
            budget: budget._id,
            ...data,
            type: "Budget",
            status: data.status
        }

        await vote.create(vote_data)

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

        if(approvals.length >= treshold) {
            const budget = await Budget.findById(budgetItem).lean()

            console.log('here')

            const endDate = this.addEndDate(budget)

            console.log('here2')

            await Budget.findByIdAndUpdate(budgetItem, { status: 'active', endDate }, { new: true })

            await Vote.findOneAndUpdate({ $and: [{ budget: budgetItem, type: 'Budget' }] }, { status: 'active', endDate }, { new: true })
        }

        return
    }

    static async isPending(org_id, budgetItem) {

        console.log(org_id, budgetItem)

        return await Budget.findOne({ $and: [ { _id: budgetItem, organization: org_id, status: 'pending' } ] }).lean()

        // console.log(data)
        // return
    }

    static async decided(budgetItem, address) {

        const user = await User.findOne({ address }).lean()

        if(!user) return

        return await Approval.findOne({ $and: [ { budgetItem, user: user._id } ] }).lean()

    }

    static addEndDate(data) {

        if(data.deadline <= 1) throw createError.UnprocessableEntity('invalid Deadline')

        let endDate = Date.now() + parseInt(data.deadline) * 24 * 60 * 60 * 1000

        endDate = new Date(endDate)

        // console.log(endDate)

        return endDate

    }

}

module.exports = BudgetService