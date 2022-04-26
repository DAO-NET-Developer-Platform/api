const language = require('../services/language.service')
const createError = require('http-errors')

class LanguageController {

    static async all(req, res, next) {

        try {

            const data = await language.all()

            return res.status(200).json({
                status: true,
                message: `All available languages`,
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async migrate(req, res, next) {

        try {

            await language.migrate()

            return res.status(200).json({
                status: true,
                message: 'Language added successfully'
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

}

module.exports = LanguageController