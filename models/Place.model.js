const { Schema, model } = require('mongoose')

const placeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    city: {
        type: Schema.Types.ObjectId, ref: "City"
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ["Food", "Cultural"],
        required: true
    }
})

module.exports = model("Place", placeSchema)
