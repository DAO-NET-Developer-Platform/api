const mongoose = require('mongoose')

const schema = new mongoose.Schema({

    criteria: {
        type: String,
        required: true
    },
    
    type: {
        type: String,
        enum: {
          values: ['Budget', 'Join'],
          message: 'Unsupported value'
        }
    },

    data: {
        type: String,
        // required: true
    }

})

module.exports = mongoose.model('Criteria', schema)