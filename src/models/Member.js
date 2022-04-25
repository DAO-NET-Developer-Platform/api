const mongoose = require('mongoose')

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

    // image: {
    //     type: String,
    //     required: true
    // },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    amountInTreasury: {
        type: Number,
        // required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model('Member', member)