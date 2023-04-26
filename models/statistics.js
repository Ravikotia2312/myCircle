const mongoose = require("mongoose");
const options = {
    collection: "statistics",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
      },
}
console.log("statisticsModel");

const statisticsSchema = new mongoose.Schema({
   
    totalsavedPosts:{
        type:String,
    },
    
    totaluploadedPosts:{
        type:String,
    },
   
    isDeleted: {
        type: Boolean,
    },

},
options
);

module.exports = mongoose.model("statistics", statisticsSchema, "statistics");
