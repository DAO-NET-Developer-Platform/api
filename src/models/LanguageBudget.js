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

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    },

    budget: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget'
    },

    status: {
        type: String,
        enum: {
          values: ['pending', 'active'],
          message: 'Unsupported value'
        }
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model('LanguageBudget', schema)