const router = require("express").Router();
const chatsControl = require("../controller/chats.controller");
const { authentication} = require("../middleware/auth.middleware");

router.use(authentication)

router.post("/sendMessagePrivte",chatsControl.sendMessagePrivte);
router.post("/chating", chatsControl.chating);
router.get("/showSpecificChat/:chatID", chatsControl.showSpecificChat);
router.get("/showAllMyChats", chatsControl.showAllMyChats);
router.delete("/deleteSpecificChat", chatsControl.deleteSpecificChat);


module.exports = router;