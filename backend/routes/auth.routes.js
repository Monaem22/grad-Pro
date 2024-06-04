const router = require("express").Router();
const authControl = require("../controller/auth.controller")
const { signUpVaIidation, loginVaIidation } = require("../middleware/inputValidation.middleware")


router.post("/signup", signUpVaIidation, authControl.signUp)
router.post("/login", loginVaIidation, authControl.login)
router.get("/logout", authControl.logout)
router.post("/forgetPassword", authControl.forgetPassword);
router.post("/verifyRestCode", authControl.verifyPassResetCode);

router.put("/resetPassword", authControl.resetPassword);

module.exports = router;
