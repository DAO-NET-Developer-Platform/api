const createError = require('http-errors')
const budget = require('../services/budget.service')

class BudgetController {

    static async all(req, res, next) {

        const { organization_id } = req.params

        // const { lang, page } = req.query

        try {

            const data = await budget.all(organization_id, req.query)

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

        req.body.organization = req.params.organization_id
        
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

        const { lang } = req.query

        try {

            const data = await budget.single(id, lang)

            return res.status(200).json({
                status: true,
                message: "Single Budget",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async approve(req, res, next) {

        console.log('here')

        const organization = req.params.organization_id

        req.body.address = req.query.address


        try {

            await budget.approve(organization, req.body)

            return res.status(200).json({
                status: true,
                message: 'Budget approval successfull'
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }


    }

    // static async update(req, res, next) {

    //     const { id } = req.params

    //     try {

    //         const data = await budget.update(id, req.body)

    //         return res.status(200).json({
    //             status: true,
    //             message: "Budget updated successfully",
    //             data
    //         })

    //     } catch (e) {

    //         return next(createError(e.statusCode, e.message))

    //     }

    // }

    // static async delete(req, res, next) {

    //     const { id } = req.params

    //     try {

    //         const data = await budget.delete(id)

    //         return res.status(200).json({
    //             status: true,
    //             message: "Budget deleted successfully",
    //             data
    //         })

    //     } catch (e) {

    //         return next(createError(e.statusCode, e.message))

    //     }

    // }

    static async search(req, res, next) {

        const { organization_id } = req.params

        try {

            const data = await budget.search(organization_id, req.query)

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