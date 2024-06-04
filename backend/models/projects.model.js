const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({

    projectName: {
        type: String,
        default: "object",
    },
    category: {
        type: String,
        default: "General",
    },
    faculty: {
        type: String,
        default: "General",
    },
    date: {
        type: String,
        default: Date()
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
    numberOfComments: {
        type: Number,
    },
    comments: [
        {
            commentOwner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users_table",
            },
            content: {
                type: String,
                // required: true
            },
            date: {
                type: String,
                default: Date()
            },
            likesOfComment: [{
                likeOwner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "users_table",
                },
            }],
            numberOfCommentLikes: {
                type: Number,
            },
        }],
    likes: [{
        likeOwner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users_table",
        },
    }],
    numberOfLikes: {
        type: Number,
    },
    description: {
        type: String,
        // required: true
    },
    pdf: {
        type: String,
        required: true,
        trim: true,
        
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users_table",
    },
    //who's added this project to his favoite list
    favoriteList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users_table",
    }],
    numberOfUsersAddedThisProjectToFavoriteList: {
        type: Number,
    },
},
    { timestamps: { createdAt: 'creationTime', updatedAt: 'lastModified' } }
)


const projectModel = mongoose.model("projects_table", projectSchema)
module.exports = projectModel;
