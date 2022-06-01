const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    hash: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    inputs: {
        type: Object
    },

    outputs: {
        type: Object
    },

    // time: {
    //     type: String,
    //     required: true
    // }

}, {
    timestamps: true
})

module.exports = mongoose.model('Transaction', schema)