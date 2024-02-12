const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
  logout
} = require("../Services/authServices.js");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgetPassword", forgetPassword);

router.post("/verifyRestCode", verifyPassResetCode);

router.put("/resetPassword", resetPassword);

router.get('/logout',logout)

<<<<<<< HEAD

=======
>>>>>>> f8fff45bae413ff4093f1cd0ff5a66b1373a0836
module.exports = router;
