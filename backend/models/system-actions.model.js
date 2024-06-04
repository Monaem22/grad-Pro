const mongoose = require("mongoose");

const sysActionsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users_table",
    },
    action: {
        type: String,
    },
    date: {
        type: String,
        default: Date()
    },
},
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)
const studentDB = mongoose.model("sysActions_table", sysActionsSchema)
module.exports = studentDB;
