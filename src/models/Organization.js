const mongoose = require('mongoose')

const organization = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },

    creator: {
       type: String,
       required: true
    },

    joinCriteria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Criteria'
    },

    budgetCriteria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Criteria'
    },

    joinCriteriaAmount: {
        type: Number,
        // required: true
    },
    
    budgetCriteriaAmount: {
        type: Number,
        // required: true
    },

    image: {
        type: String,
        required: true
    },

    treasury: {
        type: Number,
        // required: true
    },

    hash: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    }

    // transaction: {
    //     hash: {
    //         type: String,
    //         required: true
    //     },

    //     blockNumber: {
    //         type: Number
    //     }
    // }

}, {
    timestamps: true
})

module.exports = mongoose.model('Organization', organization)