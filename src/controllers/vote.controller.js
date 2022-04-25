const createError = require('http-errors');
const vote = require('../services/vote.service');

class VoteController {

    static async all(req, res, next) {

        const { organization_id } = req.params

        try {

            const data = await vote.all(organization_id)

            return res.status(200).json({
                status: true,
                message: 'All Votes',
                data
            })

        } catch(e) {
            return next(createError(e.statusCode, e.message))
        }
    }

    static async create(req, res, next) {

        req.body.organization = req.params.organization_id

        try {

            const data = await vote.create(req.body)

            return res.status(200).json({
                status: true,
                message: 'Vote Created Successfully',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }
    }

    static async single(req, res, next) {
        
        const id = req.params.id

        try {

            const data = await vote.single(id)

            return res.status(200).json({
                status: true,
                message: 'Single Vote',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }
    }

    static async update(req, res, next) {
        
        const id = req.params.id

        try {

            const data = await vote.update(id, req.body)

            return res.status(200).json({
                status: true,
                message: 'Vote updated successfully',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }
    }

    static async delete(req, res, next) {
        const id = req.params.id

        try {

            const data = await Vote.delete(id)

            return res.status(200).json({
                status: true,
                message: 'Vote Deleted',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }
    }

}

module.exports = VoteController