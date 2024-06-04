const router = require("express").Router();
const NotificationsControl = require("../controller/notification.controller");
const { authentication, } = require("../middleware/auth.middleware");


router.use(authentication)

router.get("/showAllNotifications", NotificationsControl.showAllNotifications)
router.get("/showMyNotifications", NotificationsControl.showMyNotifications)
router.get("/showMyInteractions", NotificationsControl.showMyInteractions)
router.delete("/deleteNotification", NotificationsControl.deleteNotification)
router.delete("/deleteAllMyNotification", NotificationsControl.deleteAllMyNotification)
router.delete("/deleteAllMyInteractions", NotificationsControl.deleteAllMyInteractions)

module.exports = router;