const Budget = require('../models/Budget')
const language = require('../services/language.service')
const BudgetOrganization = require('../models/LanguageBudget')


class BudgetService {

    static async all(id) {

        return await Budget.find({ organization: id }).populate('organization').lean()

    }

    static async create(data) {

        data.image = `https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`

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

            return BudgetOrganization.create(lang_data)
        }))
        
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

}

module.exports = BudgetService