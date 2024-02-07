const router = require("express").Router();
const auth = require("../middleWare/auth.js");
const User = require("../models/UserModel.js");

router.use("/student", auth.studentAuth, (req, res, next) => {
  res.setHeader("content-type", "text/plain");
  res.status(200).json(null);
  console.log(req.baseUrl);
});

router.get("/show", (req, res, next) => {
  studentDB
    .find()
    .then((results) => {
      // console.log(results);
      res.json(results);
    })
    .catch((error) => {
      console.error(error);
    });
});

router.post("/create", (req, res, next) => {
  let studentDb = new User({
    userName: req.body.userName,
    password: req.body.password,
    email: req.body.email,
  });
  studentDb
    .save()
    .then((savedInstance) => {
      res.status(200).json({ message: "Student is saved", savedInstance });
    })
    .catch((error) => {
      console.error(error);
      if (error.code === 11000) {
        res
          .status(400)
          .json({
            message:
              "Duplicate key error. The provided data violates a unique constraint.",
          });
      } else {
        // Other errors
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
});

router.delete("/del", (req, res, next) => {});

module.exports = router;
