const Joi = require('joi')

const schemas = {

    create: Joi.object().keys({
        title: Joi.string().required(),
        creator: Joi.string().required(),
        deadline: Joi.string().required(),
        description: Joi.any().required(),
        address: Joi.string().required(),
        image: Joi.string().empty('').default(null)
    })

}

module.exports = schemas