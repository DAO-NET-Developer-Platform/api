const user = require('../services/user.service')
const createError = require('http-errors')

class userController {

    static async createUser(req, res, next) {

        try {

            const data = await user.createUser(req.body)

            return res.status(200).json({
                status: true,
                message: 'User created successfully',
                data
            })

        } catch(e) {
            return next(createError(e.statusCode, e.message))
        }

    }

    static async all(req, res, next) {

        try {

            const data = await user.all()

            return res.status(200).json({
                status: true,
                message: 'All users',
                data
            })

        } catch(e) {
            return next(createError(e.statusCode, e.message))
        }

    }

}

module.exports = userController;
