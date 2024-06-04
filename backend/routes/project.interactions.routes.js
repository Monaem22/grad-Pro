const router = require("express").Router();
const projectInterControl = require("../controller/project.interactions.controller");
const { authentication, adminAuthorization, } = require("../middleware/auth.middleware");


router.delete("/deleteOneComment/:project_Id", adminAuthorization, projectInterControl.deleteOneComment)

router.use(authentication)

router.post("/addComment/:project_Id", projectInterControl.addComment)
router.delete("/deleteMyComment/:project_Id", projectInterControl.deleteMyComment)
router.patch("/updateMyComment/:project_Id", projectInterControl.updateMyComment)
router.get("/getAllComments/:project_Id", projectInterControl.getAllComments)
router.delete("/deleteCommentOnMyProject/:project_Id", projectInterControl.deleteCommentOnMyProject)

router.post("/addlike/:project_Id", projectInterControl.addlike)
router.post("/deleteMyLike/:project_Id", projectInterControl.deleteMyLike)
router.get("/getAllLikes/:project_Id", projectInterControl.getAllLikes)

router.post("/addlikeToComment/:project_Id", projectInterControl.addlikeToComment)
router.delete("/deleteMyLikeOnComment/:project_Id", projectInterControl.deleteMyLikeOnComment)
router.get("/showAllLikesOnComment/:project_Id", projectInterControl.showAllLikesOnComment)



module.exports = router;
