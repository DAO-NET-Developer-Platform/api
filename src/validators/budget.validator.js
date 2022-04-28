const Joi = require('joi')

const schemas = {

    create: Joi.object().keys({
        title: Joi.string().required(),
        creator: Joi.string().required(),
        startDate: Joi.any().required(),
        endDate: Joi.any().required(),
        description: Joi.any().required(),
        address: Joi.string().required(),
        amount: Joi.number().required(),
    })

}

module.exports = schemas