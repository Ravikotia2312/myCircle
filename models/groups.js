const mongoose = require("mongoose");
const options = {
  collection: "groups",
  timestamps: {
    createdAt: "createdOn",
    updatedAt: "updatedOn",
  },
};
console.log("messages");
const groupsSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    members: [mongoose.Schema.Types.ObjectId],

    groupName: {
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

module.exports = mongoose.model("groups", groupsSchema, "groups");
