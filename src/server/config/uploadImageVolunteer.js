// imageUpload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const myPath = require("./path.config");

// save path
const uploadDir = path.join(myPath.root,"src","uploads", "volunteer_certificate");
if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
}

// diskStorage cho ảnh
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const imageFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Chỉ cho phép ảnh (.jpg, .jpeg, .png)"), false);
};

const uploadImageVolunteer = multer({ storage: imageStorage, fileFilter: imageFilter, limits: {fileSize: 5 * 1024*1024} }); //5MB
module.exports = uploadImageVolunteer;
