const sysActionModel = require("../models/system-actions.model");
const usermodel = require("../models/User.model");

const sysActionsController = {
    showAllSysActions: async (req, res) => {
        try {
            const AllSysActions = await sysActionModel
                .find()
                .populate("user", "_id userName email image")
                .sort({ creationTime: -1 });

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin showed All System Actions`,
            });

            res.status(202).send({ AllSysActions });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    showSysActionsOfSpecificUser: async (req, res) => {
        try {
            const {userId} = req.params;
            const allSpecificUserActions = await sysActionModel.find({ user: userId })
                .populate("user", "_id userName email image")
                .sort({ creationTime: -1 });

            if (!allSpecificUserActions) {
                return res.status(404)
                    .send({ message: "no Actions founded for this user" });
            }

            const actionsOwner = await usermodel.findById(userId);

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin showed All System Actions Of Specific User`,
            });

            if (!actionsOwner) {
                const deletedActions = await sysActionModel.deleteMany({
                    user: userId,
                });
                return res.status(404).send({
                        message:
                            `this user not found or deleted before , his all actions are deleted from system `,
                    });
            }

            res.status(202).send({ allSpecificUserActions });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
};

module.exports = sysActionsController;
