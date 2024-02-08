const factory = require("./HandlerFactory.js");
const Project_warehouse = require("../models/projects_WarehouseModel.js");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const { uploadSinglePDF } = require("../middleware/uploadpdfMiddleware.js");
const fs = require("fs");
const path = require("path");
const download=require('download');
// Upload single image
exports.uploadprojectpdf = uploadSinglePDF("pdf");

// Image processing
exports.processpdf = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const filename = `project-${uuidv4()}-${Date.now()}.pdf`;

    // Save the PDF file into the desired directory
    req.body.pdf = filename; // Save the filename to the request body if needed

    // Construct the destination directory path
    const destinationDir = path.join(__dirname, "../uploads/project");

    // Ensure the directory exists, if not, create it
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }

    // Construct the destination file path
    const destination = path.join(destinationDir, filename);

    // Write the uploaded file to the destination
    fs.writeFile(destination, req.file.buffer, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  } else {
    return next(new Error("No file uploaded"));
  }
});
exports.getallProject_warehouse = factory.getAll(Project_warehouse);

exports.getProject_warehouse = factory.getOne(Project_warehouse);

exports.createProject_warehouse = factory.createOne(Project_warehouse);

exports.updateProject_warehouse = factory.updateOne(Project_warehouse);

exports.deleteProject_warehouse = factory.deleteOne(Project_warehouse);

exports.downloadpdf= async (req, res, next) => {
    try {
      const filename = req.params.filename;
      const fileURL = `http://${req.headers.host}/project/${filename}`;
      console.log(fileURL);
      console.log(req.headers.host);

      // Download the file asynchronously
      await download(fileURL, 'dist', { extract: { toplevel: true } });
      
      // Send a response indicating successful download
      res.status(200).send('File downloaded successfully');
    } catch (error) {
      // Handle any errors
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  };
  
