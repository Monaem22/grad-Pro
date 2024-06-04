const { default: mongoose } = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    EventOwner: {
      type: String,
    },
    projectOwner: {
      type: String,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "projects_table",
    },
    content: {
      type: String,
    },
    date: {
      type: String,
      default: Date()
    },

  },
  { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
);

const notificationmodel = mongoose.model("notification_table", notificationSchema);

module.exports = notificationmodel;
