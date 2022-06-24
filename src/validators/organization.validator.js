const Joi = require('joi')

const schemas = {
    create: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        creator: Joi.string().required(),
        joinCriteria: Joi.any().required(),
        budgetCriteria: Joi.any().required(),
        joinCriteriaAmount: Joi.number(),
        budgetCriteriaAmount: Joi.number(),
        address: Joi.string().required(),
        image: Joi.any(),
        cid: Joi.any(),
        hash: Joi.string().required(),
        identityCommitment: Joi.string().required()
    }),

    join: Joi.object().keys({
        address: Joi.string().required(),
        identityCommitment: Joi.string().required(),
        txHash: Joi.any()
    }),

    // me: Joi.object().key({
    //     address: Joi.string().required(),
    // })
}

module.exports = schemas;
