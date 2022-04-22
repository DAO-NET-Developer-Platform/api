const Organization = require('../models/Organization');

class OrganizationService {

    static async all() {

        const organizations = await Organization.find({}).populate('joinCriteria').populate('budgetCriteria').lean()

        return organizations

    }

    static async create(data) {

        data.image = `https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80`

        return await Organization.create(data)

    }

    static async single(id) {

        const data = (await Organization.findOne({ _id: id }).populate('joinCriteria').populate('budgetCriteria')).toObject()

        return data

    }

    static async update(id, data) {

        await Organization.findByIdAndUpdate(id, data, {
            new: true
        }).toObject()

    }

    static async search (data) {

    }

    static async delete(id) {

        return await Organization.findByIdAndDelete(id)

    }

    static async join() {

    }

    static async leave() {

    }

}

module.exports = OrganizationService