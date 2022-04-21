const mongoose = require('mongoose')

const organization = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    creator: {
       type: String,
       required: true
    },

    joinCriteria: {
        type: mongoose.Schema.Types.id,
        ref: 'Criteria'
    },

    budgetCriteria: {
        type: mongoose.Schema.Types.id,
        ref: 'Criteria'
    },

    joinCriteriaAmount: {
        type: Number,
        required: true
    },
    
    budgetCriteriaAmount: {
        type: Number,
        required: true
    },

    image: {
        type: String,
        required: true
    },

    treasury: {
        type: Number,
        // required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Organization', organization)