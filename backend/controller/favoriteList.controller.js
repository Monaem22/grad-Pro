const projectModel = require("../models/projects.model")
const sysActionModel = require("../models/system-actions.model")

const favoriteListController = {
    addProjectToFavoriteList: async (req, res) => {
        try {
            const loggedUser = req.user;
            const { project_ID } = req.body;
            const IntendedProject = await projectModel.findById(project_ID)
            if (!IntendedProject) {
                return res.status(404).send({ message: "project not found or is deleted before  " })
            }
            if (IntendedProject.status === "pending") {
                return res.status(404).send({message:"you can't add pending project to favorite list " })
                }
            const userAddedBefore = IntendedProject.favoriteList.find(userId =>
                userId.equals(loggedUser._id)
            )
            if (userAddedBefore) {
                return res.status(403).send({ message: "this project is actully existing in your Favorite List" })
            }
            const newNumOfUsersAddedThisProjToFavList = IntendedProject.favoriteList.push(loggedUser._id)
            IntendedProject.numberOfUsersAddedThisProjectToFavoriteList = newNumOfUsersAddedThisProjToFavList
            await IntendedProject.save()

            await sysActionModel.create({
                user: loggedUser._id,
                action: ` ${loggedUser.email} add this Project ${IntendedProject.projectName} To his Favorite List`,
            });

            res.status(202).send({
                message:
                    "project added to favourite list successfully",
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    removeProjectFromFavoriteList: async (req, res) => {
        try {
            const loggedUser = req.user;
            const { project_ID } = req.body;
            const IntendedProject = await projectModel.findById(project_ID)
            if (!IntendedProject) {
                return res.status(404).send({ message: "project not found or is deleted before  " })
            }
            const existingProjectInFavList = IntendedProject.favoriteList.find(userId =>
                userId.equals(loggedUser._id)
            )
            if (!existingProjectInFavList) {
                return res.status(403).send({ message: "this project is not existing in my favorite list" })
            }
            const users_added_this_project_to_favorite_list = IntendedProject.favoriteList.pull(loggedUser._id)
            IntendedProject.numberOfUsersAddedThisProjectToFavoriteList = users_added_this_project_to_favorite_list.length
            await IntendedProject.save()

            await sysActionModel.create({
                user: loggedUser._id,
                action: ` ${loggedUser.email} removed this Project ${IntendedProject.projectName} from his Favorite List`,
            });

            res.status(202).send({
                message: "project removed from my favourite list successfully",
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    showMyFavoriteList: async (req, res) => {
        try {
            const loggedUser = req.user;
            const myFavoriteList = await projectModel.find({
                favoriteList: loggedUser
            })
                .populate("owner", "_id userName email role image")


            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} show his Favorite List`,
            });

            res.status(202).send({
                projects_number: myFavoriteList.length,
                myFavoriteList
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getAllUsersAddedThisProjToFavList: async (req, res) => {
        try {
            const loggedUser = req.user;
            const { project_ID } = req.body;
            const IntendedProject = await projectModel.findById(project_ID)
                .populate("favoriteList", "_id userName email role image")

            if (!IntendedProject) {
                return res.status(404).send({ message: "project not found or is deleted before  " })
            }

            await sysActionModel.create({
                user: loggedUser._id,
                action: ` ${loggedUser.email} show for all users added this project to fav list`,
            });

            res.status(202).send({
                number_Of_users_added_this_project_to_favorite_list:
                    IntendedProject.numberOfUsersAddedThisProjectToFavoriteList,
                users_added_this_project_to_favorite_list:
                    IntendedProject.favoriteList,
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
};
module.exports = favoriteListController 