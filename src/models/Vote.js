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

    address:{
        type: String,
        required: true
    },

    creator: {
       type: String,
       required: true
    },

    image: {
        type: String,
        // required: true
    },

    cid: {
        type: String,
        // required: true
    },

    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },

    organization: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization'
    },

    type: {
        type: String,   
    }

})

module.exports = mongoose.model('Vote', schema)