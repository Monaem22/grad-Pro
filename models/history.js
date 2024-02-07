const mongoose = require("mongoose");
const historyDB = mongoose.model("History", {
  date: {
    default: date.now(),
  },
  NameOfUser: { type: mongoose.Types.ObjectId },
  action: {},
},{timestamps:true});

module.exports = historyDB;
