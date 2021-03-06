const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2")

const organization = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
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
    },

    treasury: {
        type: Number,
        default: 0
    },

    hash: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        required: true
    },

    circulation: {
        type: Number,
        default: 0
    },

    cid: {
        type: String,
        // required: true
    },

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

organization.index({ name : 'text' })
organization.plugin(mongoosePaginate)

module.exports = mongoose.model('Organization', organization)