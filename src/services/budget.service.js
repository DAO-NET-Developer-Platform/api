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
const Decision = require('../models/Decision')


class BudgetService {

    static async all(id, query) {

        // const { lang, page } = query

        let page, lang

        if(query) {
            page = query.page
            lang = query.lang
        }  

        if(!lang) {

            let data

            if(!page) return await Budget.find({ organization: id }).populate('organization').lean()

            if(query.criteria) {

                data = await this.search(id, query)
                
            } else {

                data = await Budget.paginate({ organization: id }, { 
                    page,
                    limit: 12,
                    populate: 'organization',
                    lean: true,
                    sort: { createdAt: 'desc' }
                })

            }

            // data = data.docs ? data.docs : data

            await Promise.all(data.docs.map(async (el, i) => {
                const vote = await Vote.findOne({ budget: el.id }).lean()
                data.docs[i].amountRaised = await this.getAmountRaised(vote._id)
            }))


            return data

        } 

        const language = await Language.findOne({ code: lang }).lean()

        let budget, metadata

        if(!page) {

            budget = await LanguageBudget.find({ $and: [{language:  language._id, organization: id}] }).populate('budget').lean()

        } else {

            query.lang = lang

            const data = query.criteria ? await this.langSearch(id, query) : await LanguageBudget.paginate({ $and: [{language:  language._id, organization: id}] }, { 
                page,
                limit: 12,
                populate: 'budget',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            // budget = data.docs != null ? data.docs : data

            const { docs, ...meta } = data
            budget = docs
            metadata = meta

        }

        if(!budget.length) return budget

        await Promise.all(budget.map(async (el, i) => {
            budget[i].status = el.budget.status
            budget[i].image = el.budget.image
            const vote = await Vote.findOne({ budget: el.budget }).lean()
            budget[i].amountRaised = await this.getAmountRaised(vote)
        }))

        if(metadata) return { docs: budget, ...metadata }

        return { docs: budget }

    }

    static async create(data) {

        const criteria = await this.getBudgetCriteria(data.organization)

        // const { cid, image } = await uploadFile(data.image.tempFilePath)

        // data.cid = cid
        // data.image = image

        const budget = await this.determineBudgetCreation(criteria, data)

        return budget

    }

    static async single(id, lang, user) {
        
        const vote = await Vote.findOne({ budget: id }).lean()

        if(!lang) {

            const budget = (await Budget.findById(id)).toObject()
            budget.vote = vote._id

            budget.amountRaised = await this.getAmountRaised(budget.vote)

            budget.decided = await this.decided(budget._id, user) == null ? false : true

            return budget
        }

        const language = await Language.findOne({ code: lang }).lean()

        const budget = await LanguageBudget.findOne({ $and:[{language:  language._id, budget: id }] }).populate('budget').lean()

        budget.status = budget.budget.status
        budget.vote = vote._id

        budget.amountRaised = await this.getAmountRaised(budget.vote)

        budget.decided = await this.decided(budget.budget._id, user)  == null ? false : true

        return budget

    }

    static async search (id, data) {

        const criterias = [ 'active', 'all' ]

        let { search, criteria, address, page } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid criteria')

        let results

        search = search == null ? '' : search

        //search all budgets
        if(criteria == 'all') {

            results = await Budget.paginate({
                $and: [{
                    organization: id, title: { $regex: new RegExp(`${search}`), $options: 'i'}
                }]
            }, { 
                page,
                limit: 12,
                populate: 'organization',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            // console.log(results)
            return results
        }

        //search active budgets
        results = await Budget.paginate({
            $and: [{
                organization: id, status: 'active', title: { $regex: new RegExp(`${search}`), $options: 'i'}
            }]
        }, { 
            page,
            limit: 12,
            populate: 'organization',
            lean: true,
            sort: { createdAt: 'desc' }
        })

        // console.log(results)
        return results

    }

    static async langSearch(id, data) {

        const criterias = [ 'active', 'all' ]

        let { search, criteria, address, page, lang } = data

        if(!criterias.includes(criteria)) throw createError.UnprocessableEntity('Invalid criteria')

        let results

        search = search == null ? '' : search

        const language = await Language.findOne({ code: lang }).lean()

        //search all budgets
        if(criteria == 'all') {

            results = await LanguageBudget.paginate({
                $and: [{
                    language: language._id, organization: id, title: { $regex: new RegExp(`${search}`), $options: 'i'}
                }]
            }, { 
                page,
                limit: 12,
                populate: 'organization',
                lean: true,
                sort: { createdAt: 'desc' }
            })

            return results
        }

        //search active budgets
        results = await LanguageBudget.paginate({
            $and: [{
                language: language._id, organization: id, title: { $regex: new RegExp(`${search}`), $options: 'i'}
            }]
        }, { 
            page,
            limit: 12,
            populate: 'organization',
            populate: {
                path: 'budget',
                match: {
                    status: 'active'
                }
            },
            lean: true,
            sort: { createdAt: 'desc' }
        })

        results.docs.map((el, i) => {
            el.budget != null ? results.docs[i].budget = el.budget : delete results.docs[i]
        })

        results.docs = results.docs.filter((el, i) => {
            return el != null
        })

        return results

    }

    static async getBudgetCriteria(id) {

        const organization = (await Organization.findById(id).populate('budgetCriteria')).toObject()

        return { criteria: organization.budgetCriteria.criteria, amount: organization.budgetCriteriaAmount }

    }

    static async determineBudgetCreation(criteria, data) {

        // console.log(criteria)

        data.status = "active"

        const organization = await Organization.findById(data.organization).lean()

        if(criteria.criteria.includes(`members' approval`)) {

            //create a vote for the the request
            data.status = 'pending'

        } else if(criteria.criteria == 'Anyone who pays the set fee') {

            if(!data.txHash) throw createError.Unauthorized('Please pay before creating a budget item')

            let transaction = await transactionService.checkTransaction(data.txHash)

            if(transaction == null) throw createError.Unauthorized('Invalid Hash')

            let current = transaction.outputs.find((el) => el.address == organization.address)

            // if(!current) throw createError.Unauthorized('Invalid Transaction')

            let treasury = parseInt(organization.treasury)

            if(!current) {

                console.log('will try to validate later')
                setTimeout(async() => {

                    transaction = await transactionService.checkTransaction(data.txHash)
                    // console.log(transaction)

                    current = transaction.outputs.find((el) => el.address == organization.address)

                    console.log(current)

                    if(parseInt(current.value) !== parseInt(criteria.amount * 1000000)) throw createError.Unauthorized('Invalid Quantity')

                    treasury += (parseInt(criteria.amount) * 1000000)

                    await Organization.findByIdAndUpdate(data.organization, {
                        treasury
                    }, { new: true })

                    transaction.type = 'Joining fee'
                    transaction.amount = criteria.amount * 1000000

                    await transactionService.createTransaction(transaction, data.organization)

                    console.log('updated')

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
                            // image: data.image
                            // status: data.status
                        }

                        return LanguageBudget.create(lang_data)
                    }))

                    const vote_data = {
                        budget: budget._id,
                        ...data,
                        type: "Budget",
                        status: data.status,
                        // image: data.image
                    }

                    await vote.create(vote_data)


                    return
                    

                }, 200000)

                return
            }
            
            if(parseInt(current.value) !== parseInt(criteria.amount * 1000000)) throw createError.Unauthorized('Invalid Quantity')

            treasury += (parseInt(criteria.amount) * 1000000)

            await Organization.findByIdAndUpdate(data.organization, {
                treasury
            }, { new: true })

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
                // image: data.image
                // status: data.status
            }

            return LanguageBudget.create(lang_data)
        }))

        const vote_data = {
            budget: budget._id,
            ...data,
            type: "Budget",
            status: data.status,
            // image: data.image
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

    static async getAmountRaised(vote) {

        const decision = await Decision.find({ $and: [{type: 'Budget', vote}] }).lean()

        // console.log('current', decision)

        const amount = decision.map((el) => el.amount)
        
        if(!amount.length) return 0

        const total = amount.reduce((a, b) => {
            if(!a) a = 0
            if(!b) b = 0
            return parseInt(a) + parseInt(b)
        }, 0)

        return total/1000000

    }

}

module.exports = BudgetService