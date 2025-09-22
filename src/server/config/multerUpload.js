// const multer = require('multer');
// const path = require('path');

// // Cấu hình lưu ảnh với multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb(null, 'uploads'); // thư mục lưu ảnh
//     cb(null, path.join(__dirname, '../../uploads')); // Đảm bảo đường dẫn đúng
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname).toLowerCase;
//     cb(null, file.fieldname + '-' + uniqueSuffix + ext);
//   }
// });
// // Chỉ cho phép file Excel
// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
//     file.mimetype === 'application/vnd.ms-excel'
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error('Chỉ cho phép file Excel (.xls, .xlsx)!'), false);
//   }
// };
// const upload = multer({storage, fileFilter});


// module.exports = upload;

// //============

const multer = require('multer');
const path = require('path');
// const fs = require('fs'); // Remove fs module as we are using memoryStorage for excel
const tempStorage = multer.memoryStorage();


//
// 📁 1. Upload Excel
//
// const excelUploadDir = path.join(__dirname, '../../../uploads/excel'); // Remove this
// // Ensure the upload directory exists
// if (!fs.existsSync(excelUploadDir)) { // Remove this
//   fs.mkdirSync(excelUploadDir, { recursive: true }); // Remove this
// }

const excelStorage = multer.memoryStorage(); // Change to memoryStorage

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.mimetype === 'application/vnd.ms-excel'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép file Excel (.xls, .xlsx)!'), false);
  }
};

const uploadExcel = multer({ storage: excelStorage, fileFilter: excelFilter });


//
// 🖼️ 2. Upload Image
//
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../uploads/images'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') // Cho phép jpg, png, gif, webp...
  ) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ cho phép file ảnh!'), false);
  }
};

const uploadImage = multer({ storage: tempStorage, fileFilter: imageFilter, limits: { fileSize: 5 * 1024 * 1024 }, });// giới hạn 5mb


//
// 🚀 Export từng loại upload
//
module.exports = {
  uploadExcel,
  uploadImage
};