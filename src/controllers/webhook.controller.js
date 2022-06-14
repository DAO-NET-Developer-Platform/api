const createError = require('http-errors')
const webhook = require('../services/webhook.service')
const transaction = require

class webhookController {

    static async payment(req, res, next) {

        try {

            await webhook.payment(req.body)

            return res.status(200).json({
                status: true,
                message: "recieved"
            })
            
        } catch (error) {
            return next(createError(e.statusCode, e.message))
        }

    }

}

module.exports = webhookController