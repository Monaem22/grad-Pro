const router = require("express").Router();
const userRouter = require("./user.routes");
const chatsRouter = require("./chats.routes");
const authRouter = require("./auth.routes");
const progectRouter = require("./project.routes");
const progectInteractionsRouter = require("./project.interactions.routes");
const favoriteListRouter = require("./favouriteList.routes");
const NotificationsRouter = require("./notification.routes");
const sysActionsRouter = require("./SYS-actions.routes");


router.use("/auth", authRouter)
router.use("/user", userRouter, chatsRouter)
router.use("/userFavList", favoriteListRouter)
router.use("/project", progectRouter)
router.use("/projectInteractions", progectInteractionsRouter)
router.use("/Notification", NotificationsRouter)
router.use("/sysActions", sysActionsRouter)


module.exports = router;