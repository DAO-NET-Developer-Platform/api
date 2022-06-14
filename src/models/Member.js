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

    txHash: {
        type: String,
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
    },

    unspent: {
        type: Number,
        default: 0
    },

    votingPower: {
        type: Number,
        default: 0
    }


}, {
    timestamps: true
})

member.index({ address : 'text' })
member.plugin(mongoosePaginate)

module.exports = mongoose.model('Member', member)