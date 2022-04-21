const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    criteria: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: {
          values: ['Budget', 'Vote'],
          message: '{VALUE} is not supported'
        }
    }

})

module.exports = mongoose.model('Criteria', schema)