const createError = require('http-errors');
const fund = require('../services/fund.service');


class FundController {

    static async getFunds(req, res, next) {
        try {

            const data = await fund.getFunds()

            return res.status(200).json({
                status: true,
                message: 'All Funds',
                data
            })

        } catch(e) {
            return next(createError(e.statusCode, e.message))
        }
    }

    static async fundDao(req, res, next) {

        const id = req.params.organization_id

        try {
            const data = await fund.fundDao(id, req.body)

            return res.status(200).json({
                status: true,
                message: 'Fund Successful',
                data
            })

        } catch(e) {
            return next(createError(e.statusCode, e.message))
        }
    }
}

module.exports = FundController