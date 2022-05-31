const Joi = require('joi')

const schemas = {

    create: Joi.object().keys({
        title: Joi.string().required(),
        creator: Joi.string().required(),
        deadline: Joi.string().required(),
        description: Joi.any().required(),
        address: Joi.string().required(),
        amount: Joi.number().required(),
        image: Joi.string().required(),
        hash: Joi.string().required(),
        txHash: Joi.string()
    })

}

module.exports = schemas