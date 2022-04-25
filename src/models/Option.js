const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    budgetItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    },

    vote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'
    }

}, { 
    timestamps: true
 })

module.exports = mongoose.model('Option', schema)