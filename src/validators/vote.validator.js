const Joi = require('joi')

const schemas = {

    create: Joi.object().keys({
        title: Joi.string().required(),
        creator: Joi.string().required(),
        deadline: Joi.any().required(),
        description: Joi.any().required(),
        address: Joi.string().required()
    })

}

module.exports = schemas