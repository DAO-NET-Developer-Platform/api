const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    },

    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    },

    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model('LanguageBudget', schema)