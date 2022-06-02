const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    address: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },

    type: {
        type: String,
        required: true
    },

    option: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
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

    done: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Decision', schema)