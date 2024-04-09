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
    },
    {
        // this second object adds extra properties: `createdAt` and `updatedAt`    
        timestamps: true
      }
)

module.exports=model("Region", regionSchema)