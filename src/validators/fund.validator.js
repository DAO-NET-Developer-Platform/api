const Joi = require('joi')

const schema = {

    fund: Joi.object().keys({
        txHash: Joi.string().required(),
        amount: Joi.string().required()
    })

}

module.exports = schema