const mongoose = require("mongoose");
const options = {
    collection: "comments",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
      },
}
console.log("comments");

const commentsSchema = new mongoose.Schema({
    commentOn:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"posts",
    },
    commentBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true,
    },
    comment:{
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
options
);

module.exports = mongoose.model("comments", commentsSchema, "comments");
