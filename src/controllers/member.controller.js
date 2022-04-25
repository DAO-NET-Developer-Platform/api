const createError = require('http-errors');
const member = require('../services/member.service');

class MemberController {

    static async getMembers(req, res, next) {

        const id = req.params.organization_id

        try {

            const data = await member.getMembers(id)

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