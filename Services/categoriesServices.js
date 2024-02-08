const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./HandlerFactory.js");
const Category = require("../models/categories.js");
//const { uploadSingleImage } = require("../middleware/uploadpdfMiddleware.js");

// // Upload single image
// exports.uploadCategoryImage = uploadSingleImage("image");

// // Image processing
// exports.resizeImage = asyncHandler(async (req, res, next) => {
//   const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

//   if (req.file) {
//     await sharp(req.file.buffer)
//       .resize(600, 600)
//       .toFormat("jpeg")
//       .jpeg({ quality: 95 })
//       .toFile(`uploads/categories/${filename}`);

//     // Save image into our db
//     req.body.image = filename;
//   }

//   next();
// });

exports.getCategories = factory.getAll(Category);

exports.getCategory = factory.getOne(Category);

exports.createCategory = factory.createOne(Category);

exports.updateCategory = factory.updateOne(Category);

exports.deleteCategory = factory.deleteOne(Category);
