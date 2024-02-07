const express = require("express");
const {
  signup,
  login,
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} = require("../Services/authServices.js");

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/forgetPassword", forgetPassword);

router.post("/verifyRestCode", verifyPassResetCode);

router.put("/resetPassword", resetPassword);

module.exports = router;
