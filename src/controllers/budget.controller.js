const createError = require('http-errors')
const budget = require('../services/budget.service')

class BudgetController {

    static async all(req, res, next) {

        const { organization_id } = req.params

        try {

            const data = await budget.all(organization_id)

            return res.status(200).json({
                status: true,
                message: "All organization budgets",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }
 
    }

    static async create(req, res, next) {

        try {

            const data = await budget.create(req.body)

            return res.status(200).json({
                status: true,
                message: "Budget creation successful",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async single(req, res, next) {

        try {

            const data = await budget.single(req.body)

            return res.status(200).json({
                status: true,
                message: "Budget creation successful",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async update(req, res, next) {

        const { id } = req.params

        try {

            const data = await budget.update(id, req.body)

            return res.status(200).json({
                status: true,
                message: "Budget creation successful",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async delete(req, res, next) {

    }

    static async search(req, res, next) {

    }

}

module.exports = BudgetController