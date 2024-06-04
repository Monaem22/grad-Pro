
const usermodel = require("../models/User.model")
const sendEmail = require("../Services/sendEmail");
const sysActionModel = require("../models/system-actions.model")
const chatsModel = require("../models/chats.model");
const notificationModel = require("../models/notification.model")


const chatsController = {
    showAllMyChats : async (req, res) => {
        try {
            const loggedUser = req.user
            const allChats = await chatsModel.find({$or : [
                {sender : loggedUser._id},
                {receiver : loggedUser._id}
            ]})
            .populate("sender receiver AllMessages.messageOwner", "_id userName email image")

            if(!allChats){
                return res.status(404).send({ message: "there is no any chat for you or deleted before " });
            }
            const ChatsNumbers = await chatsModel.countDocuments({$or : [
                {sender : loggedUser._id},
                {receiver : loggedUser._id}
            ]})
            res.status(200).send({ChatsNumbers, myChats :allChats ,});
    
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
showSpecificChat : async (req, res) => {
    try {
        const { chatID } = req.params;
        const specificChat = await chatsModel.findById(chatID)
        .populate("sender receiver AllMessages.messageOwner", "_id userName email image")

        if(!specificChat){
            return res.status(404).send({ message: "there is no chat or deleted before " });
        }

        res.status(200).send({ specificChat });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},
deleteSpecificChat : async (req, res) => {
    try {
        const { chatID } = req.body;
        const specificChat = await chatsModel.findByIdAndDelete(chatID)
        if(!specificChat){
            return res.status(404).send({ message: "there is no chat or deleted before " });
        }

        await sysActionModel.create({
            user: req.user._id,
            action: ` ${req.user.email} this user delete a Chat with : ${specificChat}`,
        });
        
        res.status(200).send({message: "chat deleted successfully" , specificChat });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},
chating :async (req, res) => {
    try {
        const sender = req.user
        const { receiverID } = req.body
        const receiver = await usermodel.findById(receiverID)
        if (!receiver) {
            return res.status(404).send({ message: "there is no receiver or deleted before " });
        }
        const existChat = await chatsModel.findOne({ 
            $or : [
                {sender: sender._id, receiver: receiverID,} ,
                {receiver: sender._id, sender: receiverID,} ,
            ]})
            .populate("sender receiver AllMessages.messageOwner", "_id userName email image")
        if (existChat) {
            return res.status(200).send({ message: 
                "there is a chat between receiver and sender" ,existChat});
        }
        const newChat = await chatsModel.create({ sender: sender._id, 
            receiver: receiverID ,
            chatName: `${receiver.email}|_|${sender.email}`
        })
        .populate("sender receiver AllMessages.messageOwner", "_id userName email image")

        await sysActionModel.create({
            user: sender._id,
            action: ` ${sender.email} this user created a new chat with : ${receiver.email}`,
        });

        return res.status(201).send({message: 
            "new chat is created" ,newChat 
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},
sendMessagePrivte :async (req, res) => {
    try {
        const sender = req.user
        const { receiverID, intendedMessage } = req.body
        if (!intendedMessage) {
            return res.status(404).send({ message: "there is no message" });
        }
        const receiver = await usermodel.findById(receiverID)
        if (!receiver) {
            return res.status(404).send({ message: 
                "there is no receiver or deleted before " 
            });
        }
        const intendedChat = await chatsModel.findOne({
            $or : [
                {sender: sender._id, receiver: receiverID} ,
                {receiver: sender._id, sender: receiverID} ,
            ]
        })
        .populate("sender receiver AllMessages.messageOwner", "_id userName email image")
        if (!intendedChat) {
            return res.status(404).send({ message: 
                "no chat found between you and this user or the chat is deleted"
            });
        }
        await intendedChat.AllMessages.push({theMessage :intendedMessage,
            messageOwner : sender._id 
        })
        await intendedChat.save()

        await sendEmail({
            email: receiver.Gmail_Acc,
            subject: `${sender.email} send you a message`,
            text: `${sender.email} send you a message: ${intendedMessage}
            replay on your chat `,                                                        
        });
        await sysActionModel.create({
            user: sender._id,
            action: ` ${sender.email} this user send a message TO : ${receiver.email}`,
        });
            await notificationModel.create({
                EventOwner: sender.email,
                projectOwner: receiver.email,
                content: `this user ${sender.email} send a message TO you : ${intendedMessage}`,
            });

        return res.status(202).send({ message: "you sent a message", intendedChat,
        receiverEmail: receiver.email,
        senderEmail: sender.email});

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
},

}
module.exports = chatsController