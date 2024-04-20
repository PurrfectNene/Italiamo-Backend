const {Schema, model} = require('mongoose')

const reviewSchema = new Schema(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      review: {
        type: String,
        trim: true
      }
    },
    {
      timestamps: true 
    }
  );
  
  const Review = model("Review", reviewSchema);
  
  module.exports = Review;