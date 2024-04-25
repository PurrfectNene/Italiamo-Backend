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

module.exports=model("City", citySchema)
