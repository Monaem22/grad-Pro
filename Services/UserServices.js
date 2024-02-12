const { default: slugify } = require("slugify");
const usermodel = require("../model/usermodel");
const asyncHandler = require("express-async-handler");
const ApiError = require("../util/ApiErrors");
const slugfiy = require("slugify");
const ApiFeature = require("../util/ApiFeature");
const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");
// const multer = require("multer");
const bcrypt = require("bcryptjs");

const uploadCategoryImage = uploadSingleImage("image");
const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/users/${filename}`);
    //save
    req.body.image = filename;
  }

  next();
});

const getALLUser = async (req, res) => {
  try {
    const documentcount = await usermodel.countDocuments();
    const apifeature = new ApiFeature(usermodel.find(), req.query).paginate(
      documentcount
    );
    const { mongooseQuery, paginationResult } = apifeature;
    const alluser = await mongooseQuery;
    res.status(201).json({ message: "done", paginationResult, data: alluser });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};
const getUser = async (req, res, next) => {
  try {   
    const spefic = await usermodel.findById(req.params.id);
    if (!spefic) {
      return next(new ApiError(`no brand found with this ${id}`, 404));
    } else {
      res.status(201).json({ message: "done", data: spefic });
    }
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};
const createUser = async (req, res) => {
  try {
    const newuser = await usermodel.create(req.body);
    res.status(201).json({ message: "done", data: newuser });
  } catch (error) {
    res.status(400).json({ message: "error", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const Ouser = await usermodel.findById({ _id: id });
    if (!Ouser) {
      res.status(404).json({ message: "not found" });
    } else {
      const newuser = await usermodel.findByIdAndUpdate(
        { _id: req.params.id },
        {
          name: req.body.name,
          slug: req.body.slug,
          phone: req.body.phone,
          email: req.body.email,
          profileImg: req.body.profileImg,
          role: req.body.role,
        },
        { new: true }
      );
      res.status(201).json({ message: "updated", data: newuser });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const Ouser = await usermodel.findById({ _id: id });
    if (!Ouser) {
      res.status(404).json({ message: "not found" });
    } else {
      const deleteduser = await usermodel.deleteOne({ _id: id });
      res.status(201).json({ message: "deleted" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "error", error });
  }
};

const changeuserpassword = asyncHandler(async (req, res, next) => {
  const document = await usermodel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      passwordChangedAt: Date.now(),
    },
    {
      new: true,
    }
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
const getloggedUserData = async (req, res, next) => {
  req.params.id = req.user._id;
  next();
  
};

module.exports = {
  getALLUser,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  uploadCategoryImage,
  resizeImage,
  changeuserpassword,
  getloggedUserData,
}