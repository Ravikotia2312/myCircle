const mongoose = require("mongoose");
const options = {
    collection: "messages",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
      },
}
console.log("messages");
const messagesSchema = new mongoose.Schema({
    
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true,
    },
    sentTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: true,
    },
    message:{
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isNotified: {
        type: Boolean,
        default: false,
    },
    isSeen: {
        type: Boolean,
        default: false,
    },
    messageType: {
        type: String,
        enum :['personal','group'],
        default: 'personal',
    },
    groupId : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"groups",
    }
},
options
);

module.exports = mongoose.model("messages", messagesSchema, "messages");
