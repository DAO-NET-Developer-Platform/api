const Joi = require('joi')

const schemas = {
    create: Joi.object().keys({
        name: Joi.string().required(),
        creator: Joi.string().required(),
        joinCriteria: Joi.any().required(),
        budgetCriteria: Joi.any().required(),
        joinCriteriaAmount: Joi.number(),
        budgetCriteriaAmount: Joi.number(),
        address: Joi.string().required(),
        image: Joi.string().required(),
        hash: Joi.string().required(),
        identityCommitment: Joi.string().required()
    }),

    join: Joi.object().keys({
        address: Joi.string().required(),
        identityCommitment: Joi.string().required()
    })
}

module.exports = schemas;
