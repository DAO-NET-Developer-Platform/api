const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    hash: {
        type: String,
        required: true
    },

    type: {
        type: String,
        required: true
    },

    status: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Transaction', schema)