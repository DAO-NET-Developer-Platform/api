const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    
    title: {
        type: String,
        required: true
    },

    code: {
        type: String,
        required: true
    }

})

module.exports = mongoose.model('Language', schema)