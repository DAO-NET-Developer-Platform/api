const criteria = require('../services/criteria.service')
const createError = require('http-errors')

class criteriaController {

    static async create(req, res, next) {

        try {

            const data = await criteria.create()

            return res.status(200).json({
                status: true,
                message: "Criteria created successfully",
                data
            })

        } catch (e) {
            return next(createError(e.statusCode, e.message))
        }

    }

    static async all(req, res, next) {

        const { type } = req.query

        try {

            const data = await criteria.all(type)

            return res.status(200).json({
                status: true,
                message: `All ${type} criterias`,
                data
            })

        } catch (e) {
            return next(createError(e.statusCode, e.message))
        }

    }

}

module.exports = criteriaController