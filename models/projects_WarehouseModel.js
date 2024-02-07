const mongoose = require("mongoose");
const warehouseDB = mongoose.model("projectsWarehouse", {
  ProjectName: {
    type: String,
    default: "object",
  },
  category: {type:mongoose.Types.ObjectId},
  comments: {
    type: String,
  },

  likes: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: Date.now(),
  },
},{timestamps:true});

module.exports = warehouseDB;
