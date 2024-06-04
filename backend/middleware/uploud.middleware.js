const multer = require("multer");
const path = require("path");

const imgUploading = () => {
    var imgStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "Uploads-image");
        },
        filename: function (req, file, cb) {
            const extantion = path.extname(file.originalname);
            const uniqueString =
                file.fieldname + "-" + Date.now() + extantion;
            cb(null, uniqueString);
        },
    });
    const multerFilter = function (req, file, cb) {
        if (file.mimetype === "image/png" ||
            file.mimetype === "image/jpg" ||
            file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };
    const uploading = multer({
        storage: imgStorage,
        fileFilter: multerFilter,
    });
    return uploading;
};

const transcriptUploading = () => {
    try {

        const projectStorage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, "Uploads-transcript");
            },
            filename: function (req, file, cb) {
                const extantion = path.extname(file.originalname);
                const uniqueString =
                    file.fieldname + "-" + Date.now() + extantion;
                cb(null, uniqueString);
            },
        });
        const multerFilter = function (req, file, cb) {
            if (file.mimetype === "application/pdf" ||
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg") {
                cb(null, true);
            } else {
                cb(null, false);
            }
        };
        const uploading = multer({
            storage: projectStorage,
            fileFilter: multerFilter,
        });
        return uploading;
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
};

const projectUploading = () => {
    const projectStorage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "Uploads-projects");
        },
        filename: function (req, file, cb) {
            const extantion = path.extname(file.originalname);
            const uniqueString =
                file.fieldname + "-" + Date.now() + extantion;
            cb(null, uniqueString);
        },
    });
    const multerFilter = function (req, file, cb) {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    };
    const uploading = multer({
        storage: projectStorage,
        fileFilter: multerFilter,
    });
    return uploading;
};

module.exports = { imgUploading, projectUploading, transcriptUploading };



