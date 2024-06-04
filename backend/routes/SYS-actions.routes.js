const router = require("express").Router();
const sysActionsController = require("../controller/SYS-actions.controller");
const { adminAuthorization } = require("../middleware/auth.middleware");


router.get("/showAllSysActions", adminAuthorization, sysActionsController.showAllSysActions)
router.get("/showSysActionsOfSpecificUser/:userId", adminAuthorization, 
sysActionsController.showSysActionsOfSpecificUser
)


module.exports = router;