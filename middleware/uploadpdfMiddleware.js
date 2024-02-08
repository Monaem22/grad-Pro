const multer = require("multer");
const path = require('path');
const ApiError = require("../util/ApiErrors");

const multerOptions = () => {
    const multerStorage = multer.memoryStorage();

    const multerFilter = function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new ApiError("Only PDF files are allowed", 400), false);
        }
    };

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

    return upload;
}

exports.uploadSinglePDF = (fieldName) => multerOptions().single(fieldName);

exports.uploadMultiplePDFs = (arrayOfFields) =>
    multerOptions().fields(arrayOfFields);
