const express = require("express");
const {
  getallProject_warehouse,
  getProject_warehouse,
  createProject_warehouse,
  updateProject_warehouse,
  deleteProject_warehouse,
  uploadprojectpdf,
  processpdf,
  downloadpdf,
<<<<<<< HEAD
} = require("../Services/ProjectMangementServices");

const authService = require("../Services/authServices");
const project = require("../models/projects_WarehouseModel.js");
=======
  acceptProject,
  rejectproject
} = require("../Services/ProjectMangementServices");

const authService = require("../Services/authServices");
>>>>>>> f8fff45bae413ff4093f1cd0ff5a66b1373a0836

const router = express.Router();

router
  .route("/")
  .get(getallProject_warehouse)
  .post(
    authService.protect,
    authService.allowedto("admin", "student"),
    uploadprojectpdf,
    processpdf,
    createProject_warehouse
  );
router
  .route("/:id")
  .get(getProject_warehouse)
  .put(
    authService.protect,
    authService.allowedto("admin", "student"),
    uploadprojectpdf,
    processpdf,
    updateProject_warehouse
  )
  .delete(
    authService.protect,
    authService.allowedto("student"),
    deleteProject_warehouse
  );

router.route("/download/:filename").get(downloadpdf);
<<<<<<< HEAD

//////////////////////////////////////////////
router.post("/like", async (req, res) => {
  try {
    const projectId = req.body.projectId;
    const userId = req.body.id;
    const projectObj = await project.findById(projectId);
    if (!projectObj) {
      return res.status(404).json({ error: "project not found" });
    }
    const alreadyLiked = projectObj.likes.some((like) => like.user === userId);

    if (alreadyLiked) {
      return res.status(400).json({
        error: "You have already liked this project",
      });
    }
    projectObj.likes.push({ user: userId });
    projectObj.numberOfLikes++;

    await projectObj.save();
    res
      .status(200)
      .json({ message: "project is liked successfully", projectObj });
  } catch (error) {
    console.error("Error liking project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/////////////////////////////////////
router.post("/comments", async (req, res) => {
  try {
    const projectId = req.body.projectId;
    const userId = req.body.id;
    const { content } = req.body;

    const projectObj = await project.findById(projectId);
    if (!projectObj) {
      return res.status(404).json({ error: "Project not found" });
    }

    projectObj.comments.push({ user: userId, content });
    await projectObj.save();

    res.status(200).json({ message: "Comment added successfully", projectObj });
  } catch (error) {
    console.error("Error adding comment to project:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
////////////////////////////////////////
router.get("/showLikes/:_id", async (req, res) => {
  try {
    const projectId = req.params._id;
    const projectObj = await project.findById(projectId);

    if (!projectObj) {
      return res.status(404).json({ error: "Project not found" });
    }

    res
      .status(200)
      .json({ likes:  projectObj.likes });
    
  } catch (error) {
    console.error("Error show all likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/showComments/:_id", async (req, res) => {
  try {
    const projectId = req.params._id;
    const projectObj = await project.findById(projectId);

    if (!projectObj) {
      return res.status(404).json({ error: "Project not found" });
    }

    res
      .status(200)
      .json({ likes:  projectObj.comments });
    
  } catch (error) {
    console.error("Error show all likes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

=======
router.route("/accept/:projectid").put(acceptProject);
router.route("/reject/:projectid").delete(rejectproject);

>>>>>>> f8fff45bae413ff4093f1cd0ff5a66b1373a0836
module.exports = router;
