const Criteria = require('../models/Criteria')
const criterias = require('../data/criteria.json')

class criteriaService {

    static async create() {

        await Criteria.deleteMany()

        return await Criteria.insertMany(criterias)

    }

    static async all(type) {

        return await Criteria.find({ type }).lean()

    }

}

module.exports = criteriaService