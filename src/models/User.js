const mongoose = require("mongoose")

const schema = mongoose.Schema({
    address: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("User", schema)
