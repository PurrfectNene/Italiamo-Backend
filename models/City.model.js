const {Schema, model} = require('mongoose')

const citySchema = new Schema(
    {
        region:{
            type: Schema.Types.ObjectId, 
            ref:"Region",
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    }
)

module.exports=model("City", citySchema)
