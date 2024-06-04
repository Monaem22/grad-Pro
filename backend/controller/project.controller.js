const projectModel = require("../models/projects.model")
const notificationModel = require("../models/notification.model")
const usermodel = require("../models/User.model")
const sendEmail = require("../Services/sendEmail");
const sysActionModel = require("../models/system-actions.model")
const fs = require("fs");
const uploadDirectory = require("../uploud-dataSet.js");

const projectController = {

    updateProjectData: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const updatedFields = { ...req.body }
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID")
            }
            if (!existingProject.owner.equals(logedUserID)) {
                return res.status(403).send("this project dosn't belong you to update")
            }

            await projectModel.findByIdAndUpdate(project_Id, updatedFields, { new: true })
            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: req.user.email,
                project: project_Id,
                content: ` ${req.user.email} updated his project with : ${JSON.stringify(updatedFields)}`,
            });
            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} updated his project and new data :
                ${JSON.stringify(updatedFields)}`,
            });

            return res.status(201).send({ message: "project is updated ", updatedFields })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    updateProjectFile: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const sentFile = req.file;
            if (!sentFile) {
                return res.status(404).send('no file found or check the extention of file (".pdf")')
            }
            const filenameOfSentFile = req.file.filename;
            const PathOfSentFile = `Uploads-projects\\${filenameOfSentFile}`;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                fs.unlinkSync(PathOfSentFile)
                return res.status(404).send("no project found with this ID")
            }
            if (!existingProject.owner.equals(logedUserID)) {
                fs.unlinkSync(PathOfSentFile)
                return res.status(403).send("this project dosn't belong you to update")
            }
            const pathArray = existingProject.pdf.split("/")
            const lastIndex = pathArray.length - 1;
            const oldProjectFileName = pathArray[lastIndex]
            const oldProjectPath = `Uploads-projects\\${oldProjectFileName}`
            fs.unlinkSync(oldProjectPath)
            existingProject.pdf = `${req.baseUrl}/${filenameOfSentFile}`
            existingProject.status = "pending";
            await existingProject.save()

            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: req.user.email,
                project: project_Id,
                content: "this user updated the project file and in pending status",
            });
            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} updated his project file and in pending status`,
            });
            return res.status(201).send({ message: "project file is updated and in pending status" })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    createProject: async (req, res) => {
        try {
            const logedUserID = req.user._id
            if (!req.file) {
                return res.status(404).send('no file found or check the extention of file (".pdf")')
            }
            const newProjectPath = `${req.baseUrl}/${req.file.filename}`
            const newProject = await projectModel.create({
                ...req.body,
                owner: logedUserID,
                pdf: newProjectPath
            });

            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} created a new project ${newProject}
                and in pending status`,
            });

            res.status(201).send({
                message: "project is added and in pending status"
                , newProject
            })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteMyProject: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const { project_Id } = req.params;
            const existingProject = await projectModel.findById(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            if (!existingProject.owner.equals(logedUserID)) {
                return res.status(403).send("this project dosn't belong you to delete")
            }

            await projectModel.findByIdAndDelete(project_Id);
            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: req.user.email,
                project: project_Id,
                content: ` ${req.user.email} this user deleted the project ${existingProject.projectName}`,
            });
            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} deleted the project ${existingProject.projectName}`,
            });

            res.status(202).send({ message: "is deleted" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getSpacificProject: async (req, res) => {
        try {
            const { project_Id } = req.params;
            const existingProject = await projectModel.findById(project_Id)
                .populate("comments.commentOwner likes.likeOwner owner", "_id userName email role image")

            if (!existingProject) {
                return res.status(404).send({ message: "no project found or is deleted before " })
            }

            const ProjectOwner = await usermodel.findById(existingProject.owner)
            if (!ProjectOwner) {
                return res.status(404).send({ message: "no ProjectOwner found or is deleted before " })
            }
            res.status(202).send({ data: existingProject, the_Project_owner: ProjectOwner });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getAllProjects: async (req, res) => {
        try {
            const { category } = req.body;
            if (!category) {
            
                const allProjects = await projectModel.find({status: "accepted"})
                    .populate("comments.commentOwner likes.likeOwner owner", "_id userName email role image")
                    

                if (!allProjects) {
                    return res.status(404).send("no projects founded ")
                }
                const Projectscount = await projectModel.countDocuments({ status: "accepted" });
                return res.status(200).send({
                    message: `number of projects:${Projectscount}`, projects_data: allProjects
                });
            }
            const allProjectsWithCategory = await projectModel.find({ category: category, status: "accepted" })
                .populate("comments.commentOwner likes.likeOwner owner", "_id userName email role image")

            if (!allProjectsWithCategory) {
                return res.status(404).send("no projects founded ")
            }
            const ProjectsWithCategorycount = await projectModel.countDocuments({ category: category, status: "accepted" });

            return res.status(200).send({
                message: `number of projects:${ProjectsWithCategorycount}`,
                projects_data: allProjectsWithCategory
            });

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getAllmyProjects: async (req, res) => {
        try {
            const logedUserID = req.user._id
            const allMyProjects = await projectModel.find({ owner: logedUserID })
                .populate("comments.commentOwner likes.likeOwner", "_id userName email role image")

            if (!allMyProjects) {
                return res.status(404).send("no projects founded ")
            }
            const MyProjectscount = await projectModel.countDocuments({ owner: logedUserID })

            await sysActionModel.create({
                user: logedUserID,
                action: ` ${req.user.email} show all his projects `,
            });

            return res.status(200).send({
                message: `number of My projects:${MyProjectscount}`,
                data: allMyProjects
            })

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getRandomProjects: async (req, res) => {
        try {
            const randomDocuments = await projectModel.aggregate([
                { $sample: { size: 6 } }
            ]).match({ status: "accepted" })
            
            res.status(202).send(randomDocuments);

        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },

    //admin
    changeProjectStatus: async (req, res) => {
        try {
            const { project_Id } = req.params;
            const exactStatus = req.body.status;
            const existingProject = await projectModel.findByIdAndUpdate(project_Id,
                { status: exactStatus }, { new: true })
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }
            const projectOwner = await usermodel.findById(existingProject.owner)
            if (exactStatus === "accepted") {

                await notificationModel.create({
                    EventOwner: req.user.email,
                    projectOwner: projectOwner.email,
                    project: project_Id,
                    content: "this project status is accepted you can show it",
                });

                var message = ` HI ${projectOwner.userName} ,\nyour project status 
                is changed , was (${exactStatus}).it shown for all now \nthanks `;
            } else
                if (exactStatus === "rejected") {
                    await projectModel.findByIdAndDelete(project_Id)

                    await notificationModel.create({
                        EventOwner: req.user.email,
                        projectOwner: projectOwner.email,
                        project: project_Id,
                        content: `this project (${existingProject.projectName}) status is rejected
                        by admin :${req.user.email}
                        it was not meet the policy of real project`,
                    });

                    var message = ` HI ${projectOwner.userName} ,
                    your project(${existingProject.projectName}) status is changed ,
                    it was (${exactStatus}).
                    it was not meet the policy of real project \n thanks `;
                }

            await sendEmail({
                email: projectOwner.Gmail_Acc,
                subject: `your project status ${projectOwner.userName} is changed to ${exactStatus}
                by admin : ${req.user.email} `,
                text: message,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin change status of project :
                ${existingProject.projectName} `,
            });

            res.status(202).send({ message: `status is ${exactStatus}` });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    deleteProject: async (req, res) => {
        try {
            const { project_Id } = req.params;
            if (!project_Id) {
                return res.status(404).send("no project ID found is entered ")
            }
            const existingProject = await projectModel.findByIdAndDelete(project_Id)
            if (!existingProject) {
                return res.status(404).send("no project found with this ID ")
            }

            const projectOwner = await usermodel.findById(existingProject.owner)
            await notificationModel.create({
                EventOwner: req.user.email,
                projectOwner: projectOwner.email,
                project: project_Id,
                content: `this project is deleted by admin : ${req.user.Gmail_Acc} 
                if you want to know why ? communicate with him`,
            });
            await sendEmail({
                email: projectOwner.Gmail_Acc,
                subject: `your project is deleted `,
                text: `this project is deleted by admin : ${req.user.Gmail_Acc} 
                if you want to know why ? communicate with him`,
            });
            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin deleted project : 
                ${existingProject.projectName} `,
            });

            res.status(202).send({ message: "project deleted" });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    getAllPendingProjects: async (req, res) => {
        try {
            const allPendingProjects = await projectModel.find({ status: "pending" })
                .populate("owner", "_id userName email role image")

            if (!allPendingProjects) {
                return res.status(404).send("no projects founded ")
            }
            const PendingProjectscount = await projectModel.countDocuments({ status: "pending" });

            await sysActionModel.create({
                user: req.user._id,
                action: ` ${req.user.email} this admin show all Pending projects `,
            });

            return res.status(200).send({
                message: `number of Pending projects: ${PendingProjectscount} `,
                data: allPendingProjects
            })
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    },
    searchOnProject: async (req, res) => {
        try {
            const { search } = req.body;
            if (!search) {
                return res.status(404).send({
                    message:
                        "enter the project Name or description you want to search"
                })
            }
            const searchOnUser = await projectModel.find({
                $and: [
                    {
                        $or: [
                            { projectName: { $regex: search, $options: "i" } },
                            { description: { $regex: search, $options: "i" } },
                        ]
                    },
                    { status: "accepted" }
                ]
            })
                .populate("owner", "_id userName email role image")

            if (searchOnUser.length === 0) {
                return res.status(404).send({
                    message:
                        "there is no project found with this name or description"
                })
            }
            res.status(200).send(searchOnUser);

        } catch (error) {
            res.status(500).send({ message: error.message })
        }
    },
    uploadDataSet: async (req, res) => {
        try {
            const { directoryPath } = req.body; 
        if (!directoryPath) {
                return res.status(400)
                .json({ message: "Missing directory path in request body!" });
        }
        const uploadedProjects = [];
        
        await uploadDirectory(directoryPath, uploadedProjects);

        await Promise.all(uploadedProjects.map(PdfPath=> 
        new projectModel({pdf :PdfPath ,status: "accepted",owner: req.user._id,})
        .save()
        ));
        res.send({ message: "Upload successful!", projects: uploadedProjects });
        
        } catch (error) {
            res.status(500).json({ message: "Error uploading files!" ,error: error.message});
        }
    },
}
module.exports = projectController
