const router = require("express").Router();
const projectControl = require("../controller/project.controller");
const { authentication, adminAuthorization } = require("../middleware/auth.middleware");
const uploading = require("../middleware/uploud.middleware");
const cacheService = require("express-api-cache");
const cache = cacheService.cache;

router.post("/upload_directory",adminAuthorization, projectControl.uploadDataSet)
router.get("/getAllProjects", projectControl.getAllProjects)
router.get("/getRandomProjecs", cache("1 minutes"), projectControl.getRandomProjects)
router.get("/searchOnProject", cache("1 minutes"), projectControl.searchOnProject)

router.get("/AllPendingProjects", adminAuthorization, projectControl.getAllPendingProjects)
router.post("/changeProjectStatus/:project_Id", adminAuthorization, projectControl.changeProjectStatus)
router.delete("/deleteProject/:project_Id", adminAuthorization, projectControl.deleteProject)

router.use(authentication)

router.get("/getSpacificProject/:project_Id", projectControl.getSpacificProject)
router.get("/AllmyProjects", projectControl.getAllmyProjects)
router.delete("/deleteMyProject/:project_Id", projectControl.deleteMyProject)
router.put("/updateProjectData/:project_Id", projectControl.updateProjectData);
router.post("/createProject",
        uploading.projectUploading().single("application"), projectControl.createProject);
router.put("/updateProjectFile/:project_Id",
        uploading.projectUploading().single("application"), projectControl.updateProjectFile);


module.exports = router;
