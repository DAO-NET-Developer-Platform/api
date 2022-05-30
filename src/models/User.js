const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const schema = mongoose.Schema({
    address: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

schema.plugin(mongoosePaginate)

module.exports = mongoose.model("User", schema)
