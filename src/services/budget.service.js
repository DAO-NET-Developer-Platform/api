const Budget = require('../models/Budget')

class BudgetService {

    static async all(id) {

        return await Budget.find({ organization: id }).populate('organization').lean()

    }

    static async create(data) {

        data.image = `https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`
        
        return await Budget.create(data)

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