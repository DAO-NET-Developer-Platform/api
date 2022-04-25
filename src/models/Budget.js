const mongoose = require('mongoose')

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
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Budget', budget)