const mongoose = require("mongoose");
const Autoincrement = require('mongoose-sequence')(mongoose);


const chatsSchema = new mongoose.Schema({
        chatName: String,
        chatNums : Number,
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users_table",
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users_table",
        },
        AllMessages : [{
            theMessage : String,
            messageOwner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users_table",
            },
            date: {
                type: String,
                default: Date(),
            },
        }],
    },
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)

chatsSchema.plugin(Autoincrement, {
    inc_field: 'chatNums',
    id: 'chatNumsID',
    start_seq: 1
})

module.exports = mongoose.model("chats_table", chatsSchema)