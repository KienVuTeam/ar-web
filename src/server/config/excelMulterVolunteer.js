const multer = require("multer");

// dùng memoryStorage => file nằm trong RAM, không lưu ra ổ cứng
const storage = multer.memoryStorage();

// chỉ chấp nhận Excel
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel" // .xls
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file Excel (.xls, .xlsx)"), false);
  }
};

// Giới hạn dung lượng file (ví dụ 2MB)
const limits = { fileSize: 2 * 1024 * 1024 };

const uploadExcelVolunteer = multer({ storage, fileFilter, limits });

module.exports = uploadExcelVolunteer;
