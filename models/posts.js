const mongoose = require("mongoose");
const options = {
    collection: "posts",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
      },
}
console.log("postModel");

const postSchema = new mongoose.Schema({
    postName:{
    type:String,
    required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    postImg:{
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
options
);

module.exports = mongoose.model("posts", postSchema, "posts");
