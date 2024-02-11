const express = require("express");
const {
  getALLUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  resizeImage,
  changeuserpassword,
  getloggedUserData,
  blockUser,
} = require("../Services/UserServices");
const authservices = require("../Services/authServices");
const router = express.Router();

router.use(authservices.protect, authservices.allowedto("admin"));
router.post("/", createUser);
router.get("/", getALLUser);
router.get("/:id", getUser);
router.put("/update/:id", updateUser);
router.delete("/delete/:id", deleteUser);
router.put("/changepassword/:id", changeuserpassword);
router.get("/getme", authservices.protect, getloggedUserData);
router.post("/blocked", blockUser);

module.exports = router;
