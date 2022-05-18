const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    address: {
        type: String
    },

    type: {
        type: String,
        enum: {
            values: ['Budget', 'Member'],
            message: 'Unsupported value'
        }
    },

    budgetItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    },

    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    }
})

module.exports = mongoose.model('Approval', schema)