const { default: mongoose } = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "projectwarehouse",
    },
    content: {
      type: String,
    },

  },
  { timestamps: true }
);

const notificationmodel = mongoose.model("notification", notificationSchema);

module.exports = notificationmodel;
