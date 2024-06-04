const projectModel = require("../models/projects.model")
const notificationModel = require("../models/notification.model")
const usermodel = require("../models/User.model")
const sendEmail = require("../Services/sendEmail");
const sysActionModel = require("../models/system-actions.model")

const projectInteractionsController = {

    addComment: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { content } = req.body;
            const { project_Id } = req.params;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const CommentsCount = existingProject.comments.push({ commentOwner: logedUserID, content });
            existingProject.numberOfComments = CommentsCount;
            await existingProject.save();

            const projectOwner = await usermodel.findById(existingProject.owner)
            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: projectOwner.email,
                project: project_Id,
                content: `this user ${req.user.email} add a Comment : ${content} 
                to project : ${existingProject.projectName}`,
            });
            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user added Comment : ${content} 
                on this project : ${existingProject.projectName}`,
            });

            res.status(201).send({ message: "Comment added successfully", CommentsCount, content });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteMyComment: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const { comment_Id } = req.body;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const spacificComment = existingProject.comments.find(comment =>
                comment._id.toString() === comment_Id
            )
            if (!spacificComment) {
                return res.status(404).send("Comment not found with this ID or deleted before")
            }
            if (!spacificComment.commentOwner.equals(logedUserID)) {
                return res.status(403).send("this Comment dosn't belong you to delete")
            }
            const remainingComments = existingProject.comments.pull(comment_Id)
            existingProject.numberOfComments = remainingComments.length;
            await existingProject.save();

            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user deleted his Comment : ${spacificComment.content} 
                on this project : ${existingProject.projectName}`,
            });

            res.status(202).send({
                message: "Comment deleted successfully",
                the_deleted_comment: spacificComment, remainingComments
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    updateMyComment: async (req, res) => {
        try {
            const logedUserID = req.user._id;
            const { project_Id } = req.params;
            const { comment_Id } = req.body;
            const { newContent } = req.body;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const targetComment = existingProject.comments.find(comment =>
                comment._id.toString() === comment_Id
            )
            if (!targetComment) {
                return res.status(404).send("Comment not found with this ID or deleted before")
            }
            if (!targetComment.commentOwner.equals(logedUserID)) {
                return res.status(403).send("this Comment dosn't belong you to update")
            }
            targetComment.content = newContent;
            await existingProject.save();

            const projectOwner = await usermodel.findById(existingProject.owner)
            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: projectOwner.email,
                project: project_Id,
                content: `this user ${req.user.email} updated a Comment : ${newContent} on project : ${existingProject.projectName}`,
            });
            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user updated his Comment : ${newContent} 
                on this project : ${existingProject.projectName}`,
            });

            res.status(202).send({ message: "Comment updated successfully", newContent: targetComment.content });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getAllComments: async (req, res) => {
        try {
            const { project_Id } = req.params;
            const IntendedProject = await projectModel.findById(project_Id)
                .populate("comments.commentOwner comments.likesOfComment.likeOwner", "_id userName email role image")

            if (!IntendedProject) {
                return res.status(404).send("no project founded ")
            }

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user get All Comments on this project : 
                ${IntendedProject.projectName}`,
            });

            return res.status(200).send({
                number_Of_Comments: IntendedProject.numberOfComments,
                comments_data: IntendedProject.comments
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    addlike: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const userAddedLikeBefore = existingProject.likes.find(
                like => like.likeOwner.equals(logedUserID)
            )
            if (userAddedLikeBefore) {
                return res.status(403).send("this user added like to this project before")
            }
            const likesCount = existingProject.likes.push({ likeOwner: logedUserID });
            existingProject.numberOfLikes = likesCount;
            await existingProject.save();

            const projectOwner = await usermodel.findById(existingProject.owner)
            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: projectOwner?.email,
                project: project_Id,
                content: `this user ${req.user.email} add a like to project : ${existingProject.projectName}`,
            });
            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user add a like to this project : 
                ${existingProject.projectName}`,
            });

            res.status(201).send({ message: "like added successfully", number_of_likes: likesCount });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteMyLike: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const { like_Id } = req.body;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const spacificLike = existingProject?.likes?.find(like =>
                like?._id.toString() === like_Id
            )
            if (!spacificLike) {
                return res.status(404).send("like not found with this ID or deleted before")
            }
            if (!spacificLike.likeOwner.equals(logedUserID)) {
                return res.status(403).send("this like dosn't belong you to delete")
            }
            const remaininglikes = existingProject.likes.pull({ _id: like_Id })
            existingProject.numberOfLikes = remaininglikes.length
            await existingProject.save();

            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user deleted his like on this project : 
                ${existingProject.projectName}`,
            });

            res.status(202).send({
                message: "like deleted successfully",
                the_deleted_like: spacificLike, remaininglikes
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getAllLikes: async (req, res) => {
        try {
            const { project_Id } = req.params;
            const IntendedProject = await projectModel.findById(project_Id)
                .populate("likes.likeOwner", "_id userName email role image")
            if (!IntendedProject) {
                return res.status(404).send("no project founded ")
            }

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user get All Likes on this project : 
                ${IntendedProject.projectName}`,
            });

            return res.status(200).send({
                number_Of_Likes: IntendedProject.numberOfLikes,
                Likes_data: IntendedProject.likes
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    addlikeToComment: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const { comment_Id } = req.body;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const spacificComment = existingProject.comments.find(comment =>
                comment._id.toString() === comment_Id
            )
            if (!spacificComment) {
                return res.status(404).send("Comment not found with this ID or deleted before")
            }
            const userAddedLikeBefore = spacificComment.likesOfComment.find(like =>
                like.likeOwner.equals(logedUserID)
            )
            if (userAddedLikeBefore) {
                return res.status(403).send("this user added like to this comment before")
            }
            const likesCount = spacificComment.likesOfComment.push({ likeOwner: logedUserID });
            spacificComment.numberOfCommentLikes = likesCount;
            await existingProject.save();

            const projectOwner = await usermodel.findById(existingProject.owner)
            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: projectOwner.email,
                project: project_Id,
                content: `this user ${req.user.email}add like on Comment : ${spacificComment.content}`,
            });
            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user add like on Comment : ${spacificComment.content}
                on this project ${existingProject.projectName} `,
            });

            res.status(201).send({ message: "like added successfully", number_of_likes: likesCount });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    showAllLikesOnComment: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const { comment_Id } = req.body;
            const existingProject = await projectModel.findById(project_Id)
                .populate("comments.likesOfComment.likeOwner", "_id userName email role image")

            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const spacificComment = existingProject.comments.find(comment =>
                comment._id.toString() === comment_Id
            )
            if (!spacificComment) {
                return res.status(404).send("Comment not found with this ID or deleted before")
            }

            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user add like on Comment : ${spacificComment.content}
                on this project ${existingProject.projectName} `,
            });

            res.status(201).send({
                number_of_likes: spacificComment.numberOfCommentLikes,
                likes_Of_Comment: spacificComment.likesOfComment
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteMyLikeOnComment: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const { comment_Id } = req.body;
            const { like_Id } = req.body;
            const existingProject = await projectModel.findById(project_Id)
            const spacificComment = existingProject.comments.find(comment =>
                comment._id.toString() === comment_Id
            )
            if (!spacificComment) {
                return res.status(404).send("Comment not found with this ID or deleted before")
            }
            const spacificLike = spacificComment.likesOfComment.find(like =>
                like._id.toString() === like_Id
            )
            if (!spacificLike) {
                return res.status(404).send("like not found with this ID or deleted before")
            }
            if (!spacificLike.user.equals(logedUserID)) {
                return res.status(403).send("this like dosn't belong you to delete")
            }
            const remaininglikes = spacificComment.likesOfComment.pull({ _id: like_Id })
            spacificComment.numberOfcommentLikes = remaininglikes.length;
            await existingProject.save();

            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user deleted like on Comment : ${spacificComment.content}
                on this project ${existingProject.projectName} `,
            });

            res.status(202).send({
                message: "like deleted successfully",
                the_deleted_like: spacificLike, remaininglikes
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteCommentOnMyProject: async (req, res) => {
        try {
            const logedUserID = req.user._id;
            const { project_Id } = req.params;
            const { comment_Id } = req.body;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const targetComment = existingProject.comments.find(comment =>
                comment._id.toString() === comment_Id
            )
            if (!targetComment) {
                return res.status(404).send("Comment not found with this ID or deleted before")
            }
            if (!existingProject.owner.equals(logedUserID)) {
                return res.status(403).send("this Project dosn't belong you to delete specific comment")
            }
            const remainingComments = existingProject.comments.pull(comment_Id)
            existingProject.numberOfComments = remainingComments.length;

            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} this user deleted this Comment : ${targetComment.content} 
                on owned project : ${existingProject.projectName}`,
            });

            await existingProject.save();
            res.status(202).send({ message: "Comment deleted successfully", remainingComments });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    deleteOneComment: async (req, res) => {
        try {
            const { project_Id } = req.params;
            const { comment_Id } = req.body;
            const existingProject = await projectModel.findById(project_Id)
            const spacificComment = existingProject.comments.find(comment =>
                comment._id.toString() === comment_Id
            )
            if (!spacificComment) {
                return res.status(404).send("Comment not found with this ID or deleted before")
            }
            const remainingComments = existingProject.comments.pull(comment_Id)
            existingProject.numberOfComments = remainingComments.length;

            const projectOwner = await usermodel.findById(existingProject.owner)
            const CommentOwner = await usermodel.findById(spacificComment.user)
            await notificationModel.create({
                EventOwner: CommentOwner.email,
                projectOwner: projectOwner.email,
                project: project_Id,
                content: `your comment is deleted by admin : ${req.user.Gmail_Acc} 
                communicate with him to know the reason`,
            });
            await sendEmail({
                email: CommentOwner.Gmail_Acc,
                subject: `your comment is deleted `,
                text: `your comment is deleted by admin : ${req.user.Gmail_Acc} 
                communicate with him to know the reason`,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin deleted this Comment : ${spacificComment.content}
                on this project ${existingProject.projectName} 
                of this user ${CommentOwner.email} `,
            });

            await existingProject.save();
            res.status(202).send({
                message: "Comment deleted successfully",
                the_deleted_comment: spacificComment, remainingComments
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
}
module.exports = projectInteractionsController 