const Language = require('../models/Language')
const createError = require('http-errors')
const Option = require('../models/Option')

module.exports = {

    async checkImage(req, res, next) {

        // if(!req.files.image) return next(createError.UnprocessableEntity('Please provide an image'))
        return next()

    },

    async getLang(req, res, next) {

        if(!req.query.lang) return next()
        
        const { lang: code } = req.query

        const language = await Language.findOne({ code }).select('_id').lean()

        req.language = language._id

        return next()

    },

    async typeOptions(req, res, next) {

        const { type } = req.query

        const options = await Option.find({ type }).lean()

        req.options = options

        return next()
    }

}
