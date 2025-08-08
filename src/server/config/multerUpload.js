const multer = require('multer');
const path = require('path');

// Cấu hình lưu ảnh với multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'uploads'); // thư mục lưu ảnh
    cb(null, path.join(__dirname, '../uploads')); // Đảm bảo đường dẫn đúng
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});
const upload = multer({storage});


module.exports = upload;