const createError = require('http-errors')
const option = require('../services/option.service.js')

class OptionController {

    static async create(req, res, next) {
        
        try {

            const data = await option.create()

            return res.status(200).json({
                status: true,
                message: "successfully added options",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async all(req, res, next) {

        try {

            const data = await option.all(req.options, req.language)

            return res.status(200).json({
                status: true,
                message: "All options",
                data
            })

        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }        

    }

}

module.exports = OptionController