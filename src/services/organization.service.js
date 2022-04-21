const Organization = require('../models/Organization');

class OrganizationService {

    static async all() {

        return Organization.find({}).toObject()

    }

    static async create(data) {

    }

    static async single(id) {

    }

    static async update(id, data) {

    }

    static async search (data) {

    }

    static async delete(id) {

    }

}

module.exports = OrganizationService