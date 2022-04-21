const createError = require('http-errors');
const member = require('../services/member.service');

class MemberController {

    static async getMembers(req, res, next) {

        try {

            const data = await member.getMembers()

            return res.status(200).json({
                status: true,
                message: 'All Members',
                data
            })

        } catch(e) {
            return next(createError(e.statusCode, e.message))
        }
    }
}

module.exports = MemberController