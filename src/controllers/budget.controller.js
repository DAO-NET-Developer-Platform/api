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
                message: "Budget created successfully",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async single(req, res, next) {

        const { id } = req.params

        try {

            const data = await budget.single(id)

            return res.status(200).json({
                status: true,
                message: "Single Budget",
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
                message: "Budget updated successfully",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async delete(req, res, next) {

        const { id } = req.params

        try {

            const data = await budget.delete(id)

            return res.status(200).json({
                status: true,
                message: "Budget deleted successfully",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async search(req, res, next) {

        try {

            const data = await budget.search(req.query)

            return res.status(200).json({
                status: true,
                message: "Search Results",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

}

module.exports = BudgetController