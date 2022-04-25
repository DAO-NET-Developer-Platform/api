const Joi = require('joi')

const schemas = {
    create: Joi.object().keys({
        name: Joi.string().required(),
        creator: Joi.string().required(),
        joinCriteria: Joi.any().required(),
        budgetCriteria: Joi.any().required(),
        joinCriteriaAmount: Joi.number().required(),
        budgetCriteriaAmount: Joi.number().required(),
    }),

    join: Joi.object().keys({
        user: Joi.string().required()
    })
}

module.exports = schemas;
