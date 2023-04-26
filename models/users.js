const mongoose = require("mongoose");
const options = {
    collection: "users",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
      },
}
console.log("userModel");

const userSchema = new mongoose.Schema({
    firstName:{
    type:String,
    required: true,
    },
    lastName:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
    },
    gender:{
        type:String,
        required: true,
        enum: ['male', 'female']
    },
    password:{
        type: String,
        required: true,
    },
    confirmPassword:{
        type: String,
        required: true,
    },
    profilePic:{
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },

},
options
);

module.exports = mongoose.model("users", userSchema, "users");
