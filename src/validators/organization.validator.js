const Joi = require('joi')

const schemas = {
    create: Joi.object().keys({
        name: Joi.string().required(),
        creator: Joi.string().required(),
        joinCriteria: Joi.any().required(),
        budgetCriteria: Joi.any().required(),
        joinCriteriaAmount: Joi.number().required(),
        budgetCriteriaAmount: Joi.number().required(),
        address: Joi.string().required(),
        image: Joi.string().required()
    }),

    join: Joi.object().keys({
        address: Joi.string().required()
    })
}

module.exports = schemas;
