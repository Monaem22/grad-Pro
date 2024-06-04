const router = require("express").Router();
const favoriteListControl = require("../controller/favoriteList.controller");
const { authentication, } = require("../middleware/auth.middleware");
const cacheService = require("express-api-cache");
const cache = cacheService.cache;


router.use(authentication)

router.post("/addProjectToFavoriteList", favoriteListControl.addProjectToFavoriteList);
router.delete("/removeProjectFromFavoriteList", favoriteListControl.removeProjectFromFavoriteList);
router.get("/showMyFavoriteList", favoriteListControl.showMyFavoriteList);
router.get("/getAllUsersAddedThisProjToFavList", cache("1 minutes"), favoriteListControl.getAllUsersAddedThisProjToFavList);

module.exports = router;
