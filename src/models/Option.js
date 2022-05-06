const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    // budgetItem: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Budget'
    // },

    // vote: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Vote'
    // },

    type: {
        type: String,
        enum: {
            values: ['Budget', 'Vote'],
            message: 'Unsupported value'
        }
    }

}, { 
    timestamps: true
 })

module.exports = mongoose.model('Option', schema)