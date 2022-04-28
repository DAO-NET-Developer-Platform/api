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

    vote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote'
    }
    
}, {
    timestamps: true
})

module.exports = mongoose.model('LanguageVote', schema)