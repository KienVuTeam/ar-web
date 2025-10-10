const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");
const session = require("express-session");

//
const route = require("./router");
const connectDB = require("./config/connectDB");
const multerUpload = require("./config/multerUpload");

// Middleware
app.use(express.json());//  // để parse JSON body
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
app.set("views", path.join(__dirname, "view"));
app.use(require("express-ejs-layouts")); //app.use(expressLayouts);
app.set("layout", "layout/main");

//

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));
// ⚠️ Trỏ đúng tới thư mục public chứa file CSS/JS
// Cho phép truy cập thư mục uploads từ trình duyệt
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//config route | truyen app vao func routes
// console.log("co gi: "+route)
app.use("/hehe", (req, res) => {
  res.render("admin/home/index", {
    layout: "layout/layoutAdmin",
  });
});
const uploadDir = path.join(__dirname, "../uploads");
app.use("/uploads", express.static(uploadDir));

//dam bao ton tai thu muc upload
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
console.log("path: " + uploadDir);

route(app);

//connect DB
connectDB();

module.exports = app;
