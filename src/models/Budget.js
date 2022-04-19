const mongoose = require('mongoose')

const budget = new mongoose.Schema({

    title: {
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

    Amount: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Budget', budget)