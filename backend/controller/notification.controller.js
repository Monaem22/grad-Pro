const notificationModel = require("../models/notification.model")
const sysActionModel = require("../models/system-actions.model")

const notificationController = {

    showAllNotifications: async (req, res) => {
        try {
            const AllNotifications = await notificationModel.find();

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} show All Notifications`,
            });

            res.status(202).send({
                AllNotifications
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    showMyNotifications: async (req, res) => {
        try {
            const AllMyNotifications = await notificationModel.find({ projectOwner: req.user.email });

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} show All his Notifications`,
            });

            res.status(202).send({
                AllMyNotifications
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteNotification: async (req, res) => {
        try {
            const { notification_ID } = req.body;
            if (!notification_ID) {
                return res.status(404).send("no found notification ID is entered")
            }
            const deletedNotification = await notificationModel.findByIdAndDelete(notification_ID);
            if (!deletedNotification) {
                return res.status(404).send("no notification found with this ID")
            }

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} deleted Notification`,
            });

            res.status(202).send({
                message: "is deleted successful",
                deletedNotification
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteAllMyNotification: async (req, res) => {
        try {
            const deletedNotifications = await notificationModel.deleteMany({ projectOwner: req.user.email });

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} delete All his Notification`,
            });

            res.status(202).send({
                message: "All My Notification are deleted successful",
                deletedNotifications
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    showMyInteractions: async (req, res) => {
        try {
            const AllMyInteractions = await notificationModel.find({ EventOwner: req.user.email });

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} show All his Interactions`,
            });

            res.status(202).send({
                AllMyInteractions
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteAllMyInteractions: async (req, res) => {
        try {
            const deletedInteractions = await notificationModel.deleteMany({ EventOwner: req.user.email });

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} deleted All his Interactions`,
            });

            res.status(202).send({
                message: "All My Interactions are deleted successful",
                deletedInteractions
            });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
};
module.exports = notificationController 