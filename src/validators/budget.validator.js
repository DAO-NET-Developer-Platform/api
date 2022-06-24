const Joi = require('joi')

const schemas = {

    create: Joi.object().keys({
        title: Joi.string().required(),
        creator: Joi.string().required(),
        deadline: Joi.string().required(),
        description: Joi.any().required(),
        address: Joi.string().required(),
        amount: Joi.number().required(),
        image: Joi.any(),
        cid: Joi.any(),
        hash: Joi.string().required(),
        txHash: Joi.any()
    })

}

module.exports = schemas