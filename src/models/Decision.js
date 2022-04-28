const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    address: {
        type: String,
        required: true
    },

    

    type: {
        type: String,
        required: true
    },

    option: {
        type: String,
        required: true
    },

    amount: {
        type: Number,
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    budgetItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    },

    vote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'
    },

})

module.exports = mongoose.model('Decision', schema)