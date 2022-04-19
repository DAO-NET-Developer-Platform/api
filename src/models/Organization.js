const mongoose = require('mongoose')

const organization = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    creator: {
       type: String,
       required: true
    },

    image: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Organization', organization)