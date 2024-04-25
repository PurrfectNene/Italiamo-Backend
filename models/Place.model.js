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
        enum: ["Food&Wine", "Cultural", "Relax&Wellness", "Villages", "Nature"],
        required: true
    },
    imageUrl:{
        type:String,
        required: true
    }
},
{
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
  }
)

module.exports = model("Place", placeSchema)
