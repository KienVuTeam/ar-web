const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const session = require("express-session");
const { registerFont } = require("canvas");

//
const route = require("./router");
const connectDB = require("./config/connectDB");
const multerUpload = require("./config/multerUpload");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // để parse form x-www-form-urlencoded

// session
app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // ngăn JS truy cập cookie
      // secure: true,      // chỉ hoạt động trên HTTPS
      maxAge: 1000 * 60 * 60, // session sống 1h
    },
  }),
);

// Cấu hình EJS
app.set("view engine", "ejs");
// app.engine('ejs', require('ejs').__express);
app.set("views", path.join(__dirname, "view"));
app.use(require("express-ejs-layouts")); //app.use(expressLayouts);
app.set("layout", "layout/main");

//

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));
// ⚠️ Trỏ đúng tới thư mục public chứa file CSS/JS
// app.use('/admin/assets', express.static(path.join(__dirname, 'public/admin/assets')));
// Cho phép truy cập thư mục uploads từ trình duyệt
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//config route | truyen app vao func routes
// console.log("co gi: "+route)
app.use("/hehe", (req, res) => {
  res.render("admin/home/index", {
    layout: "layout/layoutAdmin",
  });
});
//test area start
// Tạo thư mục uploads nếu chưa tồn tại
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }
// // Route upload ảnh

// app.use("/test/upload", multerUpload.single("image"), (req, res) => {

//   try {
//     if (!req.file) return res.status(400).json({ error: "No file uploaded" });
// //     // Kiểm tra xem file đã được lưu thành công
// //     console.log('File uploaded successfully:', req.file);
// //     console.log('File name:', req.file.filename);
// //     console.log('File path:', req.file.path);
// // console.log('File exists:', fs.existsSync(req.file.path));
// //
//     const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
//       req.file.filename
//     }`;
//     res.json({ message: "Upload successful", imageUrl });
//   } catch (error) {
//     console.error("Upload error:", error);
//     res.status(500).json({ error: "An error occurred during upload" });
//   }
// });

// //handle img
// const baseUploadPath = path.join(__dirname, '../public/uploads');
// const router = express.Router();
// // Hiển thị danh sách thư mục
// app.get('/img', (req, res) => {
//   const folders = fs.readdirSync(baseUploadPath, { withFileTypes: true })
//     .filter(dirent => dirent.isDirectory())
//     .map(dirent => dirent.name);

//   res.render('img/index', { folders, layout: false, title: 'Image Upload' });
// });

// // Hiển thị ảnh trong thư mục
// app.get('/folder/:name', (req, res) => {
//   const folderName = req.params.name;
//   const folderPath = path.join(baseUploadPath, folderName);

//   if (!fs.existsSync(folderPath)) return res.status(404).send('Thư mục không tồn tại');

//   const images = fs.readdirSync(folderPath).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));
//   res.render('img/folder', { folderName, images, layout: false });
// });

// // Tạo thư mục mới
// const slugify = require('slugify');
// const handleNameFolder = (nameFolder)=>{
//     // const rawFolder = "Hình ảnh nổi bật"; // từ form
//     const safeFolder = slugify(nameFolder, { lower: true, strict: true }); // -> "hinh-anh-noi-bat"
//     return safeFolder;
// }
// //
// app.post('/create-folder', (req, res) => {
//   const folderName = req.body.folderName;
//   const safeFolderName = handleNameFolder(folderName);
//   const folderPath = path.join(baseUploadPath, safeFolderName);

//   if (!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath);
//   }

//   res.redirect('/');
// });

// // Xóa thư mục
// app.post('/delete-folder', (req, res) => {
//   const folderName = req.body.folderName;
//   const folderPath = path.join(baseUploadPath, folderName);

//   if (fs.existsSync(folderPath)) {
//     fs.rmSync(folderPath, { recursive: true, force: true });
//   }

//   res.redirect('/');
// });
// const multer = require('multer');
// // Upload ảnh vào thư mục
// app.post('/upload/:folderName', (req, res) => {
//   const folderName = req.params.folderName;
//   const folderPath = path.join(baseUploadPath, folderName);

//   const storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, folderPath),
//     filename: (req, file, cb) => {
//       const uniqueName = Date.now() + '-' + file.originalname;
//       cb(null, uniqueName);
//     }
//   });

//   const upload = multer({ storage }).single('image');

//   upload(req, res, (err) => {
//     if (err) return res.status(500).send('Upload lỗi');
//     res.redirect(`/folder/${folderName}`);
//   });
// });

//test area end
// , {
//     setHeaders: (res) => {
//       res.setHeader("X-Content-Type-Options", "nosniff");
//     },
//new
const uploadDir = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadDir));

//dam bao ton tai thu muc upload
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
console.log("path: " + uploadDir);

//C:\Workspaces\Nodejs\access-race\src\server\app.js
route(app);

// Register font once at startup
const fontPath = path.join(__dirname, "../public/font/AlexBrush-Regular.ttf");
registerFont(fontPath, { family: "MyCustomAlexBrush" });
console.log("Font registered at startup:", fontPath);

//connect DB
connectDB();

module.exports = app;
