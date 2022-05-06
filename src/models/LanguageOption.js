const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    title: {
        type: String,
    },

    option: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option'
    },

    language: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Language'
    }

})

module.exports = mongoose.model('LanguageOption', schema)