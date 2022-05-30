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

schema.index({ title : 'text' })
schema.plugin(mongoosePaginate)

module.exports = mongoose.model('LanguageBudget', schema)