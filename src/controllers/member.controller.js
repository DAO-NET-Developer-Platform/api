const createError = require('http-errors');
const member = require('../services/member.service');

class MemberController {

    static async getMembers(req, res, next) {

        const id = req.params.organization_id

        const address = req.query.address

        try {

            const data = await member.getMembers(id, address)

            return res.status(200).json({
                status: true,
                message: 'All Members',
                data
            })

        } catch(e) {
            return next(createError(e.statusCode, e.message))
        }
    }

    static async approve(req, res, next) {

        const organization = req.params.organization_id

        req.body.address = req.query.address


        try {

            await member.approve(organization, req.body)

            return res.status(200).json({
                status: true,
                message: 'Approval successfull'
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }
}

module.exports = MemberController