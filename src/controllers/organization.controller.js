const createError = require('http-errors')
const organization = require('../services/organization.service')

class OrganizationController {

    static async all(req, res, next) {

        try {

            const data = await organization.all()

            return res.status(200).json({
                status: true,
                message: 'All Organizations',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async create(req, res, next) {

        try {

            const data = await organization.create(req.body)

            return res.status(200).json({
                status: true,
                message: 'Organization Created successfully',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async single(req, res, next) {

        const id = req.params.id

        try {

            const data = await organization.single(id)

            return res.status(200).json({
                status: true,
                message: 'Single Organization',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async update(req, res, next) {

        const id = req.params.id

        try {

            const data = await organization.update(id, req.body)

            return res.status(200).json({
                status: true,
                message: 'Organization Updated successfully',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async delete(req, res, next) {

        const id = req.params.id

        try {

            const data = await organization.delete(id)

            return res.status(200).json({
                status: true,
                message: 'Organization Deleted',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async search(req, res, next) {

        try {

            const data = await organization.search(req.query)

            return res.status(200).json({
                status: true,
                message: 'Single Organization',
                data
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    }

    static async join(req, res, next) {

        try {

            const data = await organization.join()

            return res.status(200).json({
                status: true,
                message: 'Join requested successfully'
            })

        } catch(e) {

            return next(createError(e.statusCode, e.message))

        }

    } 

    static async leave(req, res, next) {

        try {

            const data = await organization.leave()

            return res.status(200).json({
                status: true,
                message: 'Left organization successfully'
            })


        } catch (e) {

            return next(createError(e.statusCode, e.message))

        }

    }

}

module.exports = OrganizationController