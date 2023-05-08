const mongoose = require("mongoose");
const options = {
    collection: "savedPosts",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
      },
}
console.log("savedPosts");
const savedPostsSchema = new mongoose.Schema({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"posts",
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true,
    },
    savedBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
options
);

module.exports = mongoose.model("savedPosts", savedPostsSchema, "savedPosts");
