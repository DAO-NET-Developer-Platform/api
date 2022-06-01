const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2")

const budget = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    address:{
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    creator: {
       type: String,
       required: true
    },

    image: {
        type: String,
        required: true
    },

    deadline: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    status: {
        type: String,
        enum: {
          values: ['pending', 'active'],
          message: 'Unsupported value'
        }
    },

    txHash: {
        type: String,
        // required: true
    },

    hash: {
        type: String,
        required: true
    },

    endDate: {
        type: Date
    }

}, {
    timestamps: true
})

budget.index({ title : 'text' })
budget.plugin(mongoosePaginate)

module.exports = mongoose.model('Budget', budget)