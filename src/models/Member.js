const mongoose = require('mongoose')
const mongoosePaginate = require("mongoose-paginate-v2")

const member = new mongoose.Schema({

    address: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    amountInTreasury: {
        type: Number,
        // required: true
    },

    status: {
        type: String,
        enum: {
          values: ['pending', 'active'],
          message: 'Unsupported value'
        }
    },

    identityCommitment: {
        type: String,
    }

}, {
    timestamps: true
})

member.index({ address : 'text' })
member.plugin(mongoosePaginate)

module.exports = mongoose.model('Member', member)