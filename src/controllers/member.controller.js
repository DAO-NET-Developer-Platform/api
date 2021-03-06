const createError = require('http-errors');
const member = require('../services/member.service');

class MemberController {

    static async getMembers(req, res, next) {

        const id = req.params.organization_id

        try {

            const data = await member.getMembers(id, req.query)

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

            console.log(e)
            return next(createError(e.statusCode, e.message))

        }

    }

    static async verify(req, res, next) {

        try {

            const isMember = await member.verifyMember(req.body)

            return res.status(200).json({
                status: true,
                message: 'Member verification',
                data: {
                    isMember
                }
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }
}

module.exports = MemberController