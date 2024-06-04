const router = require("express").Router();
const userControl = require("../controller/user.controller");
const { authentication, adminAuthorization } = require("../middleware/auth.middleware");
const uploading = require("../middleware/uploud.middleware");
const updateUserValidation = require("../middleware/update-user-validation.middleware");
const Valid = require("../middleware/inputValidation.middleware");
const cacheService = require("express-api-cache");
const cache = cacheService.cache;

router.post("/createUser", adminAuthorization, Valid.signUpVaIidation, userControl.createUser);
router.delete("/deleteUser", adminAuthorization, userControl.deletUser);
router.post("/blockUser", adminAuthorization, userControl.blockUser);
router.post("/unblockUser", adminAuthorization, userControl.unBlockUser);


router.use(authentication)


router.get("/getAllUser", userControl.getAllUser);
router.get("/searchOnUser", cache("1 minutes"), userControl.searchOnUser);
router.get("/getUser/:userId", userControl.getSpecificUser);
router.get("/showMyProfile", userControl.showMyProfile);
router.put("/updateProfile", updateUserValidation, userControl.updateMyProfile);
router.patch("/updatePassword", Valid.updatePasswordValidation, userControl.updatePassword);
router.patch("/updateImage",
        uploading.imgUploading().single("image"), userControl.uploadAndUpdateImage);
router.post("/uploadimage",
        uploading.imgUploading().single("image"), userControl.uploadAndUpdateImage);
router.post("/uploadTranscript",
        uploading.transcriptUploading().single("application"), userControl.uploadTranscript);
router.delete("/deleteTranscript", userControl.deleteTranscript);


module.exports = router;
