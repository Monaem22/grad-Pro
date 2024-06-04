const usermodel = require("../models/User.model")
const fs = require("fs");
const bcrypt = require("bcrypt");
const sendEmail = require("../Services/sendEmail");
const sysActionModel = require("../models/system-actions.model")
const projectModel = require("../models/projects.model");
const chatsModel = require("../models/chats.model");


const userController = {
    showMyProfile: async (req, res) => {
        try {
            const myProfile = await usermodel.findById(req.user._id);
            if (!myProfile) {
                return res.status(400).send({ message: "there is no user or deleted before" });
            }

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user show his Profile `,
            });

            res.status(200).send({ my_Profile: myProfile });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    updateMyProfile: async (req, res) => {
        try {
            const { Country, cityOrTown, details,email} = req.body;
            const intendedUser = await usermodel.findById(req.user._id);
            if (!intendedUser) {
                return res.status(400).send({ message: "there is no user or deleted before" });
            }
            if (email && intendedUser.role === "admin") {
                return res.status(400).send({ message: "you can't change your admin email" });
            }
            intendedUser.set({...req.body,addresses: { Country, cityOrTown, details },})
            await intendedUser.save() ;

            await sendEmail({
                email: req.user.Gmail_Acc,
                subject: "your profile data is changed",
                text: `your profile data is changed by you with : ${JSON.stringify(req.body)}`,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user updated his Profile with : 
                ${JSON.stringify(req.body)}`,
            });

            res.status(200).send({ message: "my profile is updated",
            updatedFields :req.body
        });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    updatePassword: async (req, res) => {
        try {
            const logedUser = req.user
            const { newPassword, oldPassword } = req.body
            const validPassword = await bcrypt.compare(oldPassword, logedUser.password)
            if (!validPassword) {
                return res.status(403).send({ message: "Invalid old password" })
            }
            logedUser.password = newPassword
            await logedUser.save()

            await sendEmail({
                email: req.user.Gmail_Acc,
                subject: `your password is changed `,
                text: `your password is changed by you and new Password : ${newPassword} `,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user updated his Password `,
            });
            res.send({ message: "Password Updated !!" })
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    deleteTranscript: async (req, res) => {
        try {
            const logedUser = req.user
            if (logedUser.transcript) {
                const pathArray = logedUser.transcript.split("/")
                const lastIndex = pathArray.length - 1;
                const transcriptFileName = pathArray[lastIndex]
                const transcriptPath = `Uploads-transcript\\${transcriptFileName}`
                fs.unlinkSync(transcriptPath)
            } else {
                return res.status(200).json({ message: "no transcript to delete" });
            }
            logedUser.transcript = undefined;
            await logedUser.save()

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user deleted his Transcript `,
            });

            return res.status(200).json({ message: " Transcript is deleted" });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    uploadTranscript: async (req, res) => {
        try {
            const ownerID = req.user._id;
            if (!req.file) {
                return res.status(404).send('no file found or check the extention of file (".pdf",".png",".jpg",".jpeg")')
            }
            const newTranscriptPath = `${req.baseUrl}/${req.file.filename}`
            if (req.user.transcript) {
                const pathArray = req.user.transcript.split("/")
                const lastIndex = pathArray.length - 1;
                const transcriptFileName = pathArray[lastIndex]
                const transcriptPath = `Uploads-transcript\\${transcriptFileName}`
                fs.unlinkSync(transcriptPath)
            }
            await usermodel.findByIdAndUpdate(
                ownerID, { transcript: newTranscriptPath }, { new: true }
            )
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user Uploaded new Transcript `,
            });

            res.status(201).send({ message: "Transcript is saved", newTranscriptPath })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    uploadAndUpdateImage: async (req, res) => {
        try {
            const ownerID = req.user._id;
            if (!req.file) {
                return res.status(404).send('no file found or check the extention of img (".png",".jpg",".jpeg")')
            }
            const newImagePath = `${req.baseUrl}/${req.file.filename}`
            if (req.user.image) {
                const pathArray = req.user.image.split("/")
                const lastIndex = pathArray.length - 1;
                const oldImageFileName = pathArray[lastIndex]
                const oldImagePath = `Uploads-image\\${oldImageFileName}`
                fs.unlinkSync(oldImagePath)
            }
            await usermodel.findByIdAndUpdate(
                ownerID, { image: newImagePath }, { new: true }
            )

            await sendEmail({
                email: req.user.Gmail_Acc,
                subject: `your profile image is changed `,
                text: `your profile image is changed by you `,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user Uploaded new image `,
            });

            res.status(201).send({ message: "image is saved", newImagePath })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    //admin
    blockUser: async (req, res) => {
        try {
            const userId = req.body.id
            if (!userId) {
                return res.status(404).send({ message: "there is no user id" });
            }
            const userData = await usermodel.findById(userId)
            if (!userData) {
                return res.status(404).send({ message: "there is no user with this ID" });
            }
            userData.isBlocked = true;
            await userData.save();

            await sendEmail({
                email: userData.Gmail_Acc,
                subject: `your profile is Blocked `,
                text: `your profile is Blocked by admin : ${req.user.Gmail_Acc}
            communicate with him to know the reason`,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin blocked this user :  
                ${userData.email}`,
            });
            return res.status(202).send({ message: "user is blocked successfully", user_state: "blocked" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    unBlockUser: async (req, res) => {
        try {
            const userId = req.body.id
            if (!userId) {
                return res.status(404).send({ message: "there is no user id" });
            }
            const userData = await usermodel.findById(userId)
            if (!userData) {
                return res.status(404).send({ message: "there is no user with this ID" });
            }
            userData.isBlocked = false;
            await userData.save();

            await sendEmail({
                email: userData.Gmail_Acc,
                subject: `your profile is unBlocked `,
                text: `your profile is unBlocked by admin : ${req.user.Gmail_Acc}
            now you can log in again in web application`,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin unblocked this user :  
                ${userData.email}`,
            });
            return res.status(202).send({ message: "user is unblocked successfully", user_state: "unblocked" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deletUser: async (req, res) => {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(404).send({ message: "there is no user ID is entered" });
            }
            const userData = await usermodel.findByIdAndDelete(userId)
            if (!userData) {
                return res.status(404).send({ message: "there is no user or deleted before" });
            }
            const deletedProjects = await projectModel.deleteMany({
                owner: userId,
            });

            await sendEmail({
                email: userData.Gmail_Acc,
                subject: `your account is deleted `,
                text: `your account is deleted by admin : ${req.user.Gmail_Acc}
            communicate with him to know the reason`,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin deleted this user :  
                ${userData.email}`,
            });

            return res.status(202).send({ message: "user is deleted" });
        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    getSpecificUser: async (req, res) => {
        try {
            const {userId} = req.params;
            if (!userId) {
                return res.status(404).send({ message: "enter the user id you want to get" });
            }
            const specficUser = await usermodel.findById(userId);
            if (!specficUser) {
                return res.status(404).send({
                    message:
                        `there is no user found with this id : ${userId}`
                });
            }

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this user showed this user :  
                ${specficUser.email}`,
            });

            const user_Projects = await projectModel.find({
                owner: userId, status: "accepted"
            })
            res.status(200).send({ user_data: specficUser, user_Projects });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getAllUser: async (req, res) => {
        try {
            const role = req.body.role;
            if (!role) {
                const AllUsers = await usermodel.find();
                if (!AllUsers) {
                    return res.status(404).send({ message: `there are no users founded ` });
                }
                const documentcount = await usermodel.countDocuments();
                res.status(200).send({
                    message: `number of documents: ${documentcount}`, ALL_users_data: AllUsers
                });
            } else {
                const AllUserWithRole = await usermodel.find({ role: role });
                if (!AllUserWithRole) {
                    return res.status(404).send({ message: `there is no ${role} founded ` });
                }
                const documentcount = await usermodel.countDocuments({ role: role });
                await sysActionModel.create({
                    user: req.user._id,
                    action: ` ${req.user.email} this admin showed all users `,
                });
                res.status(200).send({
                    message: `number of documents: ${documentcount} `, all_users_with_role: AllUserWithRole
                });
            }
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    createUser: async (req, res) => {
        try {
            const { email } = req.body;
            const existingUser = await usermodel.findOne({ email: email });
            if (existingUser) {
                return res.status(403).send({
                    error: "email is already exists..please enter another email"
                });
            }
            const newuser = await usermodel.create({ ...req.body });

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin created new user with data: 
                ${JSON.stringify(req.body)}`,
            });

            res.status(201).send({ message: "new user is created", data: newuser });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    searchOnUser: async (req, res) => {
        try {
            const { search } = req.body;
            if (!search) {
                return res.status(404).send({ message: "enter the user Name or Email you want to search" })
            }
            const searchOnUser = await usermodel.find({
                $or: [
                    { userName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ]
            })
            if (searchOnUser.length === 0) {
                return res.status(404).send({
                    message:
                        "there is no user found with this name or email"
                })
            }
            res.status(200).send(searchOnUser);

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },

}
module.exports = userController




