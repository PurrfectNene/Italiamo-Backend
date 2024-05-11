const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    imageUrl: {
      type: String,
    },
    favoritesRegions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Region",
      },
    ],
    favoritesCities: [
      {
        type: Schema.Types.ObjectId,
        ref: "City",
      },
    ],
    favoritesPlaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Place",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
