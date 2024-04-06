const {Schema, model} = require('mongoose')

const regionSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    }
)

module.exports=model("Region", regionSchema)