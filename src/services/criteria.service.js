const Criteria = require('../models/Criteria')

class criteriaService {

    static async create(data) {

        return await Criteria.create(data)

    }

    static async all(type) {

        return await Criteria.find({ type }).lean()

    }

}

module.exports = criteriaService