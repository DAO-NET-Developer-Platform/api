const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2")

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

    deadline: {
        type: String,
    },

    organization: {
        type: mongoose.Types.ObjectId,
        ref: 'Organization'
    },

    type: {
        type: String,
        enum: ['Budget', 'Vote']
    },

    status: {
        type: String,
        enum: ['pending', 'active']
    },

    budget: {
        type: mongoose.Types.ObjectId,
        ref: 'Budget'
    },

    hash: {
        type: String,
        required: true
    },

    endDate: {
        type: Date
    }

})

schema.index({ title : 'text' })
schema.plugin(mongoosePaginate)

module.exports = mongoose.model('Vote', schema)