const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization'
    },

    budgetItem: {

    },

    vote: {

    }

})

module.exports = mongoose.model('Decision', schema)