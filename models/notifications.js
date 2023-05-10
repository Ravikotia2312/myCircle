const mongoose = require("mongoose");
const options = {
    collection: "notifications",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
      },
}
console.log("notifications");
const notificationsSchema = new mongoose.Schema({
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
    savedByName:{
        type: String,
        required: true,
    },
    isSeen: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
},
options
);

module.exports = mongoose.model("notifications", notificationsSchema, "notifications");
