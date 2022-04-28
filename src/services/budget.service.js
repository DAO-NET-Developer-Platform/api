const Budget = require('../models/Budget')
const language = require('../services/language.service')
const LanguageBudget = require('../models/LanguageBudget')
const organizationService = require('../services/organization.service')
const Organization = require('../models/Organization')
const { uploadFile, retrieve } = require('../connectors/web3.storage')


class BudgetService {

    static async all(id) {

        return await Budget.find({ organization: id }).populate('organization').lean()

    }

    static async create(data) {

        const criteria = await this.getBudgetCriteria(data.organization)

        const { cid, image } = await uploadFile(data.image.tempFilePath)

        data.cid = cid
        data.image = image

        const budget = await this.determineBudgetCreation(criteria, data)

        return budget

    }

    static async single(id) {

        return (await Budget.findById(id)).toObject()

    }

    static async update(id, data) {

    }

    static async search (data) {

    }

    static async delete(id) {

    }

    static async getBudgetCriteria(id) {

        const organization = (await Organization.findById(id).populate('budgetCriteria')).toObject()

        return { criteria: organization.budgetCriteria.criteria, amount: organization.budgetCriteriaAmount }

    }

    static async determineBudgetCreation(criteria, data) {

        if(criteria.criteria.includes(`members' approval`)) {

            //create a vote for the the request

        }

        if(criteria.criteria == 'Anyone who pays the set fee') {

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
                language: el._id
            }

            return LanguageBudget.create(lang_data)
        }))

        return budget

    }

}

module.exports = BudgetService